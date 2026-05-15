// pattern: Imperative Shell

using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RestaurantBooking.Api;
using RestaurantBooking.Api.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("RestaurantBooking"));

builder.Services.AddIdentityCore<AppUser>(options =>
    {
        options.Password.RequireDigit = false;
        options.Password.RequiredLength = 4;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = false;
        options.User.RequireUniqueEmail = true;
    })
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddCookie(IdentityConstants.ApplicationScheme, options =>
    {
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.None;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;
        options.LoginPath = "/api/auth/login";
        options.AccessDeniedPath = "/api/auth/login";
    });

builder.Services.AddAuthorization();

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-XSRF-TOKEN";
    options.Cookie.Name = "XSRF-TOKEN";
    options.Cookie.HttpOnly = false;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy
            .WithOrigins("http://localhost:5173", "http://localhost:4173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

builder.Services.AddSingleton<BookingStore>();

var app = builder.Build();

// Ensure database and seed demo user
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();

    if (!context.Users.Any())
    {
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        var demo = new AppUser
        {
            UserName = "demo@example.com",
            Email = "demo@example.com",
            Name = "Demo User",
        };
        var result = await userManager.CreateAsync(demo, "demo1234");
        if (!result.Succeeded)
        {
            throw new InvalidOperationException($"Failed to seed demo user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }
    }
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapOpenApi();

var api = app.MapGroup("/api");

// CSRF token endpoint — must be reachable before auth
api.MapGet("/csrf-token", (IAntiforgery antiforgery, HttpContext context) =>
{
    var tokens = antiforgery.GetAndStoreTokens(context);
    return Results.Ok(new { token = tokens.RequestToken! });
});

// Auth endpoints
var auth = api.MapGroup("/auth");

auth.MapPost("/register", async (
    RegisterRequest request,
    UserManager<AppUser> userManager,
    SignInManager<AppUser> signInManager,
    HttpContext context) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        return Results.BadRequest(new ErrorResponse("Validation", "Email and password are required."));

    var user = new AppUser
    {
        UserName = request.Email,
        Email = request.Email,
        Name = request.Name ?? request.Email,
    };

    var createResult = await userManager.CreateAsync(user, request.Password);
    if (!createResult.Succeeded)
    {
        var errors = createResult.Errors.Select(e => e.Description);
        return Results.BadRequest(new ErrorResponse("RegistrationFailed", string.Join("; ", errors)));
    }

    await signInManager.SignInAsync(user, isPersistent: false);
    return Results.Ok(new UserInfo(user.Id, user.Email!, user.Name));
})
    .WithName("Register");

auth.MapPost("/login", async (
    LoginRequest request,
    SignInManager<AppUser> signInManager,
    UserManager<AppUser> userManager,
    IAntiforgery antiforgery,
    HttpContext context) =>
{
    if (!await antiforgery.IsRequestValidAsync(context))
        return Results.BadRequest(new ErrorResponse("CSRF", "Invalid anti-forgery token."));

    var user = await userManager.FindByEmailAsync(request.Email);
    if (user is null)
        return Results.Unauthorized();

    var result = await signInManager.PasswordSignInAsync(user, request.Password, isPersistent: false, lockoutOnFailure: false);
    if (!result.Succeeded)
        return Results.Unauthorized();

    return Results.Ok(new UserInfo(user.Id, user.Email!, user.Name));
})
    .WithName("Login");

auth.MapPost("/logout", async (
    SignInManager<AppUser> signInManager,
    IAntiforgery antiforgery,
    HttpContext context) =>
{
    if (!await antiforgery.IsRequestValidAsync(context))
        return Results.BadRequest(new ErrorResponse("CSRF", "Invalid anti-forgery token."));

    await signInManager.SignOutAsync();
    return Results.Ok();
})
    .WithName("Logout");

auth.MapGet("/me", (HttpContext context) =>
{
    if (context.User.Identity?.IsAuthenticated != true)
        return Results.Unauthorized();

    var userId = context.User.GetUserId();
    var email = context.User.GetUserEmail() ?? "";
    var name = context.User.GetUserName() ?? email;
    return Results.Ok(new UserInfo(userId, email, name));
})
    .WithName("GetCurrentUser");

// Restaurant endpoints (public)
api.MapGet("/restaurants", (BookingStore store) => store.Restaurants)
    .WithName("ListRestaurants");

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

// Booking endpoints (protected — require auth and CSRF for mutations)
api.MapGet("/bookings", async (BookingStore store, HttpContext context) =>
{
    await Task.CompletedTask;
    return Results.Ok(store.Bookings);
})
    .WithName("ListBookings");

api.MapPost("/bookings", async (
    CreateBookingRequest request,
    BookingStore store,
    IAntiforgery antiforgery,
    HttpContext context) =>
{
    if (!await antiforgery.IsRequestValidAsync(context))
        return Results.BadRequest(new ErrorResponse("CSRF", "Invalid anti-forgery token."));

    if (context.User.Identity?.IsAuthenticated != true)
        return Results.Json(new ErrorResponse("Unauthenticated", "Authentication is required to create a booking."), statusCode: 401);

    var userId = context.User.GetUserId();
    var userBookingRequest = request with { UserId = userId };
    var result = store.TryCreate(userBookingRequest, DateOnly.FromDateTime(DateTime.UtcNow));
    return ToHttpResult(result, created: true);
})
    .WithName("CreateBooking")
    .RequireAuthorization();

// User-scoped booking history
api.MapGet("/my-bookings", (BookingStore store, HttpContext context) =>
{
    if (context.User.Identity?.IsAuthenticated != true)
        return Results.Unauthorized();

    var userId = context.User.GetUserId();
    return Results.Ok(store.GetBookingsForUser(userId));
})
    .WithName("GetMyBookings");

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

public partial class Program;

internal static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal user) =>
        user.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "";

    public static string? GetUserEmail(this ClaimsPrincipal user) =>
        user.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;

    public static string? GetUserName(this ClaimsPrincipal user) =>
        user.FindFirst("name")?.Value;
}
