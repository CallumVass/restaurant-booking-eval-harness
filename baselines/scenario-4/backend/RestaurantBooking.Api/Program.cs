// pattern: Imperative Shell

using RestaurantBooking.Api;
using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy
        .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials());
});
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "RestaurantBooking.Csrf";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
});
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
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
builder.Services.AddSingleton<BookingStore>();
builder.Services.AddSingleton<AuthStore>();

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (AntiforgeryValidationException)
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        await context.Response.WriteAsJsonAsync(new ErrorResponse("CsrfValidationFailed", "A valid CSRF token is required."));
    }
});
app.MapOpenApi();

var api = app.MapGroup("/api");

var auth = api.MapGroup("/auth");

auth.MapGet("/csrf", (HttpContext httpContext, IAntiforgery antiforgery) =>
{
    var tokens = antiforgery.GetAndStoreTokens(httpContext);
    return Results.Ok(new CsrfResponse(tokens.RequestToken!));
})
    .WithName("GetCsrfToken");

auth.MapPost("/register", async (AuthRequest request, HttpContext httpContext, AuthStore users, IAntiforgery antiforgery) =>
{
    await antiforgery.ValidateRequestAsync(httpContext);
    var user = users.Create(request.Email, request.Password);
    if (user is null)
    {
        return Results.BadRequest(new ErrorResponse("InvalidRegistration", "Use a unique email and a password of at least 8 characters."));
    }

    await SignIn(httpContext, user);
    return Results.Created("/api/auth/me", user);
})
    .WithName("Register");

auth.MapPost("/login", async (AuthRequest request, HttpContext httpContext, AuthStore users, IAntiforgery antiforgery) =>
{
    await antiforgery.ValidateRequestAsync(httpContext);
    var user = users.Validate(request.Email, request.Password);
    if (user is null)
    {
        return Results.Unauthorized();
    }

    await SignIn(httpContext, user);
    return Results.Ok(user);
})
    .WithName("Login");

auth.MapPost("/logout", async (HttpContext httpContext, IAntiforgery antiforgery) =>
{
    await antiforgery.ValidateRequestAsync(httpContext);
    await httpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.NoContent();
})
    .RequireAuthorization()
    .WithName("Logout");

auth.MapGet("/me", (HttpContext httpContext, AuthStore users) =>
{
    var userId = CurrentUserId(httpContext);
    if (userId is null)
    {
        return Results.Unauthorized();
    }

    var user = users.Find(userId);
    return user is null ? Results.Unauthorized() : Results.Ok(user);
})
    .WithName("GetCurrentUser");

api.MapGet("/restaurants", (BookingStore store) => store.Restaurants)
    .WithName("ListRestaurants");

api.MapGet("/bookings", (HttpContext httpContext, BookingStore store) =>
{
    var userId = CurrentUserId(httpContext)!;
    return Results.Ok(store.BookingsForUser(userId));
})
    .RequireAuthorization()
    .WithName("ListMyBookings");

api.MapGet("/restaurants/{restaurantId}/bookings", (string restaurantId, HttpContext httpContext, BookingStore store) =>
{
    var userId = CurrentUserId(httpContext)!;
    return Results.Ok(store.BookingsForUser(userId, restaurantId));
})
    .RequireAuthorization()
    .WithName("ListMyRestaurantBookings");

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

api.MapPost("/bookings", async (CreateBookingRequest request, HttpContext httpContext, BookingStore store, IAntiforgery antiforgery) =>
{
    await antiforgery.ValidateRequestAsync(httpContext);
    var result = store.TryCreate(request, DateOnly.FromDateTime(DateTime.UtcNow), CurrentUserId(httpContext)!);
    return ToHttpResult(result, created: true);
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

static string? CurrentUserId(HttpContext httpContext) =>
    httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

static Task SignIn(HttpContext httpContext, AuthUserResponse user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id),
        new Claim(ClaimTypes.Email, user.Email),
    };
    var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
    return httpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(identity));
}

public partial class Program;
