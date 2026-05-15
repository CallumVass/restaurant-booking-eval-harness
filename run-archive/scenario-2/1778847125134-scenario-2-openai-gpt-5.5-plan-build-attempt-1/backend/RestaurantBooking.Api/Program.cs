// pattern: Imperative Shell

using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using RestaurantBooking.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy
        .WithOrigins("http://localhost:5173", "https://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});
builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "RestaurantBooking.Auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });
builder.Services.AddAuthorization();
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "XSRF-TOKEN";
    options.Cookie.HttpOnly = false;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
});
builder.Services.AddSingleton<BookingStore>();
builder.Services.AddSingleton<UserStore>();

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapOpenApi();

var api = app.MapGroup("/api");

api.MapGet("/auth/csrf", (HttpContext context, IAntiforgery antiforgery) =>
{
    var tokens = antiforgery.GetAndStoreTokens(context);
    return Results.Ok(new CsrfResponse(tokens.RequestToken!));
})
    .WithName("GetCsrfToken");

api.MapGet("/auth/me", (ClaimsPrincipal user) =>
{
    var email = user.FindFirstValue(ClaimTypes.Email);
    return email is null ? Results.Unauthorized() : Results.Ok(new CurrentUserResponse(email));
})
    .RequireAuthorization()
    .WithName("GetCurrentUser");

api.MapPost("/auth/register", async (AuthRequest request, HttpContext context, UserStore users, IAntiforgery antiforgery) =>
{
    var csrfError = await ValidateCsrf(context, antiforgery);
    if (csrfError is not null)
    {
        return csrfError;
    }

    var result = users.Register(request.Email, request.Password);
    if (!result.IsSuccess)
    {
        return Results.BadRequest(new ErrorResponse(result.Code!, result.Message!));
    }

    await SignIn(context, result.User!);
    return Results.Created("/api/auth/me", new CurrentUserResponse(result.User!.Email));
})
    .WithName("Register");

api.MapPost("/auth/login", async (AuthRequest request, HttpContext context, UserStore users, IAntiforgery antiforgery) =>
{
    var csrfError = await ValidateCsrf(context, antiforgery);
    if (csrfError is not null)
    {
        return csrfError;
    }

    var result = users.ValidateLogin(request.Email, request.Password);
    if (!result.IsSuccess)
    {
        return Results.BadRequest(new ErrorResponse(result.Code!, result.Message!));
    }

    await SignIn(context, result.User!);
    return Results.Ok(new CurrentUserResponse(result.User!.Email));
})
    .WithName("Login");

api.MapPost("/auth/logout", async (HttpContext context, IAntiforgery antiforgery) =>
{
    var csrfError = await ValidateCsrf(context, antiforgery);
    if (csrfError is not null)
    {
        return csrfError;
    }

    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.NoContent();
})
    .RequireAuthorization()
    .WithName("Logout");

api.MapGet("/restaurants", (BookingStore store) => store.Restaurants)
    .WithName("ListRestaurants");

api.MapGet("/bookings", (BookingStore store, ClaimsPrincipal user) => store.UserBookings(CurrentUserId(user)))
    .RequireAuthorization()
    .WithName("ListBookings");

api.MapGet("/restaurants/{restaurantId}/bookings", (string restaurantId, BookingStore store, ClaimsPrincipal user) => store.UserBookings(CurrentUserId(user), restaurantId))
    .RequireAuthorization()
    .WithName("ListRestaurantBookings");

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

api.MapPost("/bookings", async (CreateBookingRequest request, BookingStore store, ClaimsPrincipal user, HttpContext context, IAntiforgery antiforgery) =>
{
    var csrfError = await ValidateCsrf(context, antiforgery);
    if (csrfError is not null)
    {
        return csrfError;
    }

    var result = store.TryCreate(request, DateOnly.FromDateTime(DateTime.UtcNow), CurrentUserId(user));
    return ToHttpResult(result, created: true);
})
    .RequireAuthorization()
    .WithName("CreateBooking");

app.Run();

static async Task SignIn(HttpContext context, AppUser user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Email, user.Email),
    };
    var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
    await context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
}

static string CurrentUserId(ClaimsPrincipal user) =>
    user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new InvalidOperationException("Authenticated user id missing.");

static async Task<IResult?> ValidateCsrf(HttpContext context, IAntiforgery antiforgery)
{
    try
    {
        await antiforgery.ValidateRequestAsync(context);
        return null;
    }
    catch (AntiforgeryValidationException)
    {
        return Results.BadRequest(new ErrorResponse("InvalidCsrfToken", "Refresh the page and try again."));
    }
}

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

public partial class Program;
