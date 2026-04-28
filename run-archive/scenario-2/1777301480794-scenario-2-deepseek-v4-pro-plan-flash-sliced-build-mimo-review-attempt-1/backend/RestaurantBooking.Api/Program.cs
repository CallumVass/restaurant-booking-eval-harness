// pattern: Imperative Shell

using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Antiforgery;
using RestaurantBooking.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy
        .WithOrigins("http://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});
builder.Services.AddSingleton<BookingStore>();
builder.Services.AddSingleton<AuthStore>();
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = ".AspNetCore.Antiforgery";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
});
builder.Services.AddAuthorization();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.None;
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
    });

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();
app.MapOpenApi();

var api = app.MapGroup("/api");

api.MapGet("/restaurants", (BookingStore store) => store.Restaurants)
    .WithName("ListRestaurants");

api.MapGet("/bookings", (BookingStore store) => store.Bookings)
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

api.MapPost("/bookings", (CreateBookingRequest request, BookingStore store, HttpContext httpContext) =>
{
    var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        ?? throw new InvalidOperationException("Authenticated user expected.");

    var result = store.TryCreate(request, DateOnly.FromDateTime(DateTime.UtcNow), userId);
    return ToHttpResult(result, created: true);
})
    .RequireAuthorization()
    .WithName("CreateBooking");

api.MapGet("/bookings/mine", (BookingStore store, HttpContext httpContext) =>
{
    var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        ?? throw new InvalidOperationException("Authenticated user expected.");

    return Results.Ok(store.GetUserBookings(userId));
})
    .RequireAuthorization()
    .WithName("ListMyBookings");

var auth = api.MapGroup("/auth");

auth.MapGet("/csrf-token", (IAntiforgery antiforgery, HttpContext httpContext) =>
{
    var tokens = antiforgery.GetAndStoreTokens(httpContext);
    return Results.Ok(new { token = tokens.RequestToken });
})
    .WithName("GetCsrfToken");

auth.MapPost("/register", async (RegisterRequest request, AuthStore authStore, HttpContext httpContext) =>
{
    var result = authStore.Register(request.Email, request.Password, request.DisplayName);
    if (!result.IsSuccess)
    {
        return ToAuthHttpResult(result);
    }

    await SignInUser(httpContext, result.Value!);
    return Results.Ok(new UserInfo(result.Value!.Id, result.Value.Email, result.Value.DisplayName));
})
    .WithName("Register");

auth.MapPost("/login", async (LoginRequest request, AuthStore authStore, HttpContext httpContext) =>
{
    var result = authStore.Login(request.Email, request.Password);
    if (!result.IsSuccess)
    {
        return ToAuthHttpResult(result);
    }

    await SignInUser(httpContext, result.Value!);
    return Results.Ok(new UserInfo(result.Value!.Id, result.Value.Email, result.Value.DisplayName));
})
    .WithName("Login");

auth.MapPost("/logout", async (HttpContext httpContext) =>
{
    await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.Ok(new { message = "Logged out." });
})
    .WithName("Logout");

auth.MapGet("/me", (HttpContext httpContext) =>
{
    var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var email = httpContext.User.FindFirst(ClaimTypes.Email)?.Value;
    var displayName = httpContext.User.FindFirst(ClaimTypes.GivenName)?.Value;

    if (userId is null || email is null)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(new UserInfo(userId, email, displayName ?? ""));
})
    .RequireAuthorization()
    .WithName("Me");

// Seed demo users
var authStore = app.Services.GetRequiredService<AuthStore>();
authStore.Register("alice@example.com", "Demo1234!", "Alice");
authStore.Register("bob@example.com", "Demo1234!", "Bob");

app.Run();

static async Task SignInUser(HttpContext httpContext, AuthUser user)
{
    var claims = new List<Claim>
    {
        new(ClaimTypes.NameIdentifier, user.Id),
        new(ClaimTypes.Email, user.Email),
        new(ClaimTypes.GivenName, user.DisplayName),
    };

    var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
    var principal = new ClaimsPrincipal(identity);

    await httpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
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

static IResult ToAuthHttpResult<T>(AuthResult<T> result)
{
    var response = new ErrorResponse(result.Error!.Value.ToString(), result.Message!);
    return result.Error switch
    {
        AuthError.DuplicateEmail => Results.Conflict(response),
        _ => Results.Unauthorized(),
    };
}

public sealed record RegisterRequest(string Email, string Password, string DisplayName);

public sealed record LoginRequest(string Email, string Password);

public partial class Program;
