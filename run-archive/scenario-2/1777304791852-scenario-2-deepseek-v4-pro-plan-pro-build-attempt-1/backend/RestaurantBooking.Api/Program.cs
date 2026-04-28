// pattern: Imperative Shell

using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Identity;
using RestaurantBooking.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

var userStore = new InMemoryUserStore();
var roleStore = new InMemoryRoleStore();

builder.Services.AddSingleton<IUserStore<IdentityUser>>(userStore);
builder.Services.AddSingleton<IUserEmailStore<IdentityUser>>(userStore);
builder.Services.AddSingleton<IUserPasswordStore<IdentityUser>>(userStore);
builder.Services.AddSingleton<IUserSecurityStampStore<IdentityUser>>(userStore);
builder.Services.AddSingleton<IRoleStore<IdentityRole>>(roleStore);

builder.Services.AddIdentityCore<IdentityUser>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 4;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
    .AddRoles<IdentityRole>()
    .AddSignInManager();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
    options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
})
    .AddCookie(IdentityConstants.ApplicationScheme, options =>
    {
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.Events.OnRedirectToLogin = ctx =>
        {
            ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddAntiforgery(options =>
{
    options.Cookie.HttpOnly = false;
    options.HeaderName = "X-CSRF-TOKEN";
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

builder.Services.AddSingleton<BookingStore>();

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapOpenApi();

SeedDemoUser(app.Services).GetAwaiter().GetResult();

var api = app.MapGroup("/api");

api.MapGet("/restaurants", (BookingStore store) => store.Restaurants)
    .WithName("ListRestaurants");

api.MapGet("/bookings", (BookingStore store, ClaimsPrincipal user) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId is null)
        return Results.Unauthorized();

    return Results.Ok(store.BookingsForUser(userId));
})
    .RequireAuthorization()
    .WithName("ListBookings");

api.MapGet("/restaurants/{restaurantId}/availability", (
    string restaurantId,
    DateOnly date,
    int partySize,
    BookingStore store) =>
{
    var result = BookingRules.AvailableSlots(
        store.FindRestaurant(restaurantId), date, partySize,
        DateOnly.FromDateTime(DateTime.UtcNow), store.Bookings);
    return ToHttpResult(result);
})
    .WithName("ListAvailableSlots");

api.MapPost("/bookings", (CreateBookingRequest request, BookingStore store, ClaimsPrincipal user) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId is null)
        return Results.Unauthorized();

    var result = store.TryCreate(request, DateOnly.FromDateTime(DateTime.UtcNow), userId);
    return ToHttpResult(result, created: true);
})
    .RequireAuthorization()
    .WithName("CreateBooking");

var auth = api.MapGroup("/auth");

auth.MapPost("/register", async (
    RegisterRequest request,
    UserManager<IdentityUser> userManager,
    SignInManager<IdentityUser> signInManager,
    HttpContext httpContext) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        return Results.BadRequest(new ErrorResponse("ValidationError", "Email and password are required."));

    var user = new IdentityUser { UserName = request.Email, Email = request.Email };
    var created = await userManager.CreateAsync(user, request.Password);
    if (!created.Succeeded)
        return Results.BadRequest(new ErrorResponse("RegistrationFailed",
            string.Join("; ", created.Errors.Select(e => e.Description))));

    await signInManager.SignInAsync(user, isPersistent: true);
    return Results.Ok(new UserInfo(request.Email, true));
})
    .WithName("Register");

auth.MapPost("/login", async (
    LoginRequest request,
    SignInManager<IdentityUser> signInManager,
    UserManager<IdentityUser> userManager) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        return Results.BadRequest(new ErrorResponse("ValidationError", "Email and password are required."));

    var user = await userManager.FindByEmailAsync(request.Email);
    if (user is null)
        return Results.Unauthorized();

    var result = await signInManager.PasswordSignInAsync(user, request.Password, isPersistent: true, lockoutOnFailure: false);
    if (!result.Succeeded)
        return Results.Unauthorized();

    return Results.Ok(new UserInfo(request.Email, true));
})
    .WithName("Login");

auth.MapPost("/logout", async (SignInManager<IdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    return Results.Ok();
})
    .WithName("Logout");

auth.MapGet("/me", (ClaimsPrincipal user) =>
{
    var email = user.FindFirstValue(ClaimTypes.Email);
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId is null || email is null)
        return Results.Ok(new UserInfo("", false));

    return Results.Ok(new UserInfo(email, true));
})
    .WithName("Me");

auth.MapGet("/csrf", (IAntiforgery antiforgery, HttpContext httpContext) =>
{
    var tokens = antiforgery.GetAndStoreTokens(httpContext);
    return Results.Ok(new { token = tokens.RequestToken });
})
    .WithName("Csrf");

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

static async Task SeedDemoUser(IServiceProvider services)
{
    using var scope = services.CreateScope();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

    var demo = await userManager.FindByEmailAsync("demo@example.com");
    if (demo is null)
    {
        demo = new IdentityUser { UserName = "demo@example.com", Email = "demo@example.com", EmailConfirmed = true };
        var result = await userManager.CreateAsync(demo, "Demo123!");
        if (!result.Succeeded)
        {
            throw new InvalidOperationException(
                $"Failed to seed demo user: {string.Join("; ", result.Errors.Select(e => e.Description))}");
        }
    }
}

public partial class Program;
