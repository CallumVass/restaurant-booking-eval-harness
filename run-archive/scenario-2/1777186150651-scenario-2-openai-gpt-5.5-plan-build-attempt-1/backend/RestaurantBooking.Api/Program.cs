// pattern: Imperative Shell

using RestaurantBooking.Api;
using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddAntiforgery(options => options.HeaderName = "X-CSRF-TOKEN");
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy
        .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});
builder.Services.AddDbContext<AuthDbContext>(options => options.UseInMemoryDatabase("RestaurantBookingAuth"));
builder.Services
    .AddIdentityCore<AppUser>(options =>
    {
        options.User.RequireUniqueEmail = true;
        options.Password.RequiredLength = 8;
        options.Password.RequireNonAlphanumeric = false;
    })
    .AddEntityFrameworkStores<AuthDbContext>()
    .AddSignInManager();
builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme).AddIdentityCookies();
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
});
builder.Services.AddAuthorization();
builder.Services.AddSingleton<BookingStore>();

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapOpenApi();

await DemoUsers.SeedAsync(app.Services);

var api = app.MapGroup("/api");

var auth = api.MapGroup("/auth");

auth.MapGet("/csrf", (HttpContext httpContext, IAntiforgery antiforgery) =>
{
    var tokens = antiforgery.GetAndStoreTokens(httpContext);
    return TypedResults.Ok(new CsrfResponse(tokens.RequestToken!));
})
    .WithName("GetCsrfToken");

auth.MapGet("/me", Results<Ok<CurrentUserResponse>, UnauthorizedHttpResult> (ClaimsPrincipal user) =>
{
    var email = user.FindFirstValue(ClaimTypes.Email);
    return email is null ? TypedResults.Unauthorized() : TypedResults.Ok(new CurrentUserResponse(email));
})
    .RequireAuthorization()
    .WithName("GetCurrentUser");

auth.MapPost("/register", async Task<Results<Ok<CurrentUserResponse>, BadRequest<ErrorResponse>>> (
    AuthRequest request,
    HttpContext httpContext,
    IAntiforgery antiforgery,
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager) =>
{
    if (!await IsValidCsrf(httpContext, antiforgery))
    {
        return TypedResults.BadRequest(new ErrorResponse("InvalidCsrfToken", "A valid CSRF token is required."));
    }

    var email = request.Email.Trim();
    var user = new AppUser { UserName = email, Email = email, EmailConfirmed = true };
    var result = await userManager.CreateAsync(user, request.Password);
    if (!result.Succeeded)
    {
        return TypedResults.BadRequest(new ErrorResponse("InvalidRegistration", string.Join(" ", result.Errors.Select(error => error.Description))));
    }

    await signInManager.SignInAsync(user, isPersistent: false);
    return TypedResults.Ok(new CurrentUserResponse(email));
})
    .WithName("Register");

auth.MapPost("/login", async Task<Results<Ok<CurrentUserResponse>, BadRequest<ErrorResponse>>> (
    AuthRequest request,
    HttpContext httpContext,
    IAntiforgery antiforgery,
    SignInManager<AppUser> signInManager) =>
{
    if (!await IsValidCsrf(httpContext, antiforgery))
    {
        return TypedResults.BadRequest(new ErrorResponse("InvalidCsrfToken", "A valid CSRF token is required."));
    }

    var email = request.Email.Trim();
    var result = await signInManager.PasswordSignInAsync(email, request.Password, isPersistent: false, lockoutOnFailure: false);
    if (!result.Succeeded)
    {
        return TypedResults.BadRequest(new ErrorResponse("InvalidCredentials", "Email or password is incorrect."));
    }

    return TypedResults.Ok(new CurrentUserResponse(email));
})
    .WithName("Login");

auth.MapPost("/logout", async Task<IResult> (
    HttpContext httpContext,
    IAntiforgery antiforgery,
    SignInManager<AppUser> signInManager) =>
{
    if (!await IsValidCsrf(httpContext, antiforgery))
    {
        return TypedResults.BadRequest(new ErrorResponse("InvalidCsrfToken", "A valid CSRF token is required."));
    }

    await signInManager.SignOutAsync();
    return TypedResults.NoContent();
})
    .RequireAuthorization()
    .WithName("Logout");

api.MapGet("/restaurants", (BookingStore store) => store.Restaurants)
    .WithName("ListRestaurants");

api.MapGet("/bookings", (string? restaurantId, ClaimsPrincipal user, BookingStore store) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    return store.BookingsForUser(userId, restaurantId).Select(BookingRules.ToDetails).ToArray();
})
    .RequireAuthorization()
    .WithName("ListBookings");

api.MapGet("/restaurants/{restaurantId}/availability", (
    string restaurantId,
    DateOnly date,
    int partySize,
    BookingStore store) =>
{
    var result = BookingRules.AvailableSlots(store.FindRestaurant(restaurantId), date, partySize, DateOnly.FromDateTime(DateTime.UtcNow), store.Bookings);
    return ToHttpResult(result);
})
    .WithName("ListAvailableSlots");

api.MapPost("/bookings", async Task<IResult> (
    CreateBookingRequest request,
    HttpContext httpContext,
    IAntiforgery antiforgery,
    ClaimsPrincipal user,
    BookingStore store) =>
{
    if (!await IsValidCsrf(httpContext, antiforgery))
    {
        return TypedResults.BadRequest(new ErrorResponse("InvalidCsrfToken", "A valid CSRF token is required."));
    }

    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    var result = store.TryCreate(request, DateOnly.FromDateTime(DateTime.UtcNow), userId);
    return ToHttpResult(result.Map(BookingRules.ToDetails), created: true);
})
    .RequireAuthorization()
    .WithName("CreateBooking");

app.Run();

static IResult ToHttpResult<T>(BookingResult<T> result, bool created = false)
{
    if (result.IsSuccess)
    {
        return created ? Results.Created("/api/bookings", result.Value) : Results.Ok(result.Value);
    }

    var response = new ErrorResponse(result.Error!.Value.ToString(), result.Message!);
    return result.Error switch
    {
        BookingError.UnknownRestaurant => Results.NotFound(response),
        BookingError.OverlappingReservation => Results.Conflict(response),
        _ => Results.BadRequest(response),
    };
}

static async Task<bool> IsValidCsrf(HttpContext httpContext, IAntiforgery antiforgery)
{
    try
    {
        await antiforgery.ValidateRequestAsync(httpContext);
        return true;
    }
    catch (AntiforgeryValidationException)
    {
        return false;
    }
}

public static class BookingResultExtensions
{
    public static BookingResult<TNew> Map<T, TNew>(this BookingResult<T> result, Func<T, TNew> mapper) =>
        result.IsSuccess
            ? BookingResult<TNew>.Success(mapper(result.Value!))
            : BookingResult<TNew>.Failure(result.Error!.Value, result.Message!);
}

public partial class Program;
