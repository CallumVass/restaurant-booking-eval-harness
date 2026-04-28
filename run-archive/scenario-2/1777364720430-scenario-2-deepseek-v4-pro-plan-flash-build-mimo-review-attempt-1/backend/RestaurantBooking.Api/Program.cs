// pattern: Imperative Shell

using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RestaurantBooking.Api;

var builder = WebApplication.CreateBuilder(args);

// OpenAPI
builder.Services.AddOpenApi();

// CORS — explicit origin for local SPA dev with credentials
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowCredentials()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// Persistence
builder.Services.AddSingleton<BookingStore>();

// Identity + EF Core InMemory
builder.Services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase("Identity"));
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

// Authorization
builder.Services.AddAuthorization();

// Antiforgery
builder.Services.AddAntiforgery(options => options.HeaderName = "X-CSRF-TOKEN");

var app = builder.Build();

// Seed demo users
using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.EnsureCreated();

    var demoUsers = new[] { ("demo@example.com", "Demo1234!"), ("guest@example.com", "Guest1234!") };
    foreach (var (email, password) in demoUsers)
    {
        if (await userManager.FindByEmailAsync(email) is null)
        {
            var user = new IdentityUser { UserName = email, Email = email };
            await userManager.CreateAsync(user, password);
        }
    }
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapOpenApi();

// Antiforgery token endpoint
app.MapGet("/api/antiforgery/token", (IAntiforgery antiforgery, HttpContext context) =>
{
    var tokens = antiforgery.GetAndStoreTokens(context);
    return Results.Ok(new { token = tokens.RequestToken, headerName = tokens.HeaderName });
});

var api = app.MapGroup("/api");

// Auth endpoints using Identity API
var authGroup = api.MapGroup("/auth");
authGroup.MapPost("/register", async (RegisterRequest request, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IAntiforgery antiforgery, HttpContext context) =>
{
    if (!await antiforgery.IsRequestValidAsync(context))
    {
        return Results.BadRequest(new ErrorResponse("Antiforgery", "Invalid CSRF token."));
    }

    var user = new IdentityUser { UserName = request.Email, Email = request.Email };
    var createResult = await userManager.CreateAsync(user, request.Password);
    if (!createResult.Succeeded)
    {
        var errors = createResult.Errors.Select(e => e.Description);
        return Results.BadRequest(new ErrorResponse("ValidationError", string.Join("; ", errors)));
    }

    await signInManager.SignInAsync(user, isPersistent: false);
    return Results.Created("/api/auth/me", new UserInfo(user.Id, user.Email!));
})
    .WithName("Register");

authGroup.MapPost("/login", async (LoginRequest request, SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, IAntiforgery antiforgery, HttpContext context) =>
{
    if (!await antiforgery.IsRequestValidAsync(context))
    {
        return Results.BadRequest(new ErrorResponse("Antiforgery", "Invalid CSRF token."));
    }

    var user = await userManager.FindByEmailAsync(request.Email);
    if (user is null)
    {
        return Results.Unauthorized();
    }

    var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
    if (!result.Succeeded)
    {
        return Results.Unauthorized();
    }

    await signInManager.SignInAsync(user, isPersistent: false);
    return Results.Ok(new UserInfo(user.Id, user.Email!));
})
    .WithName("Login");

authGroup.MapPost("/logout", async (SignInManager<IdentityUser> signInManager, IAntiforgery antiforgery, HttpContext context) =>
{
    if (!await antiforgery.IsRequestValidAsync(context))
    {
        return Results.BadRequest(new ErrorResponse("Antiforgery", "Invalid CSRF token."));
    }

    await signInManager.SignOutAsync();
    return Results.Ok(new { message = "Logged out" });
})
    .WithName("Logout");

authGroup.MapGet("/me", (ClaimsPrincipal user) =>
{
    if (user.Identity?.IsAuthenticated != true)
    {
        return Results.Unauthorized();
    }

    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    var email = user.FindFirstValue(ClaimTypes.Email)!;
    return Results.Ok(new UserInfo(userId, email));
})
    .WithName("Me");

// Existing public endpoints
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

// Protected endpoints
api.MapPost("/bookings", async (CreateBookingRequest request, BookingStore store, ClaimsPrincipal user, IAntiforgery antiforgery, HttpContext context) =>
{
    if (!await antiforgery.IsRequestValidAsync(context))
    {
        return Results.BadRequest(new ErrorResponse("Antiforgery", "Invalid CSRF token."));
    }

    var bookingRequest = request with { UserId = user.FindFirstValue(ClaimTypes.NameIdentifier) };
    var result = store.TryCreate(bookingRequest, DateOnly.FromDateTime(DateTime.UtcNow));
    return ToHttpResult(result, created: true);
})
    .WithName("CreateBooking")
    .RequireAuthorization();

api.MapGet("/bookings/mine", (BookingStore store, ClaimsPrincipal user) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId is null)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(store.GetBookingsByUser(userId));
})
    .WithName("ListMyBookings")
    .RequireAuthorization();

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

public sealed record LoginRequest(string Email, string Password);
public sealed record RegisterRequest(string Email, string Password);
public sealed record UserInfo(string Id, string Email);

public sealed class AppDbContext : IdentityDbContext<IdentityUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
}

public partial class Program;
