// pattern: Imperative Shell

using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantBooking.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("RestaurantBooking"));

builder.Services.AddIdentity<AuthUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.Name = "RestaurantBooking.Auth";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
    options.LoginPath = "/api/auth/login";
    options.LogoutPath = "/api/auth/logout";
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

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "RestaurantBooking.CSRF";
    options.Cookie.HttpOnly = false;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
});

builder.Services.AddAuthorization();
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy
        .WithOrigins("http://localhost:5174", "http://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});
builder.Services.AddSingleton<BookingStore>();

var app = builder.Build();

app.UseCors();
app.UseAntiforgery();
app.UseAuthentication();
app.UseAuthorization();
app.MapOpenApi();

// Seed demo users
using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AuthUser>>();
    await SeedUsersAsync(userManager);
}

var api = app.MapGroup("/api");

// Auth endpoints
var auth = api.MapGroup("/auth");

auth.MapGet("/csrf", (HttpContext http, IAntiforgery antiforgery) =>
{
    var tokens = antiforgery.GetAndStoreTokens(http);
    http.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!, new CookieOptions
    {
        HttpOnly = false,
        SameSite = SameSiteMode.Lax,
        Secure = false,
        Path = "/",
    });
    return Results.Ok(new { token = tokens.RequestToken });
})
.WithName("GetCsrfToken")
.RequireCors();

auth.MapPost("/register", async (
    RegisterRequest request,
    UserManager<AuthUser> userManager,
    SignInManager<AuthUser> signInManager,
    HttpContext http) =>
{
    var user = new AuthUser { UserName = request.Email, Email = request.Email };
    var result = await userManager.CreateAsync(user, request.Password);

    if (!result.Succeeded)
    {
        var errors = result.Errors.Select(e => e.Description).ToArray();
        return Results.BadRequest(new ErrorResponse("RegistrationFailed", string.Join(" ", errors)));
    }

    await signInManager.SignInAsync(user, isPersistent: false);
    return Results.Ok(new AuthResponse(user.Email!, user.Id));
})
.WithName("Register")
.RequireCors();

auth.MapPost("/login", async (
    LoginRequest request,
    SignInManager<AuthUser> signInManager,
    UserManager<AuthUser> userManager) =>
{
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
    return Results.Ok(new AuthResponse(user.Email!, user.Id));
})
.WithName("Login")
.RequireCors();

auth.MapPost("/logout", async (SignInManager<AuthUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    return Results.Ok();
})
.WithName("Logout")
.RequireCors();

auth.MapGet("/me", [Authorize] (ClaimsPrincipal user) =>
{
    var email = user.FindFirstValue(ClaimTypes.Email) ?? user.FindFirstValue(ClaimTypes.Name);
    var id = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (email is null || id is null)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(new AuthResponse(email, id));
})
.WithName("GetCurrentUser")
.RequireCors();

// Public endpoints
api.MapGet("/restaurants", (BookingStore store) => store.Restaurants)
    .WithName("ListRestaurants")
    .RequireCors();

api.MapGet("/restaurants/{restaurantId}/availability", (
    string restaurantId,
    DateOnly date,
    int partySize,
    BookingStore store) =>
{
    var result = BookingRules.AvailableSlots(store.FindRestaurant(restaurantId), date, partySize, DateOnly.FromDateTime(DateTime.UtcNow), store.AllBookings);
    return ToHttpResult(result);
})
    .WithName("ListAvailableSlots")
    .RequireCors();

// Protected endpoints
api.MapGet("/bookings", [Authorize] (ClaimsPrincipal user, BookingStore store) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    return Results.Ok(store.BookingsForUser(userId));
})
    .WithName("ListBookings")
    .RequireCors();

api.MapPost("/bookings", [Authorize][ValidateAntiForgeryToken] (
    CreateBookingRequest request,
    ClaimsPrincipal user,
    BookingStore store) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    var result = store.TryCreate(request, DateOnly.FromDateTime(DateTime.UtcNow), userId);
    return ToHttpResult(result, created: true);
})
    .WithName("CreateBooking")
    .RequireCors();

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

static async Task SeedUsersAsync(UserManager<AuthUser> userManager)
{
    const string aliceEmail = "alice@example.com";
    const string bobEmail = "bob@example.com";
    const string defaultPassword = "Password1!";

    if (await userManager.FindByEmailAsync(aliceEmail) is null)
    {
        await userManager.CreateAsync(new AuthUser { UserName = aliceEmail, Email = aliceEmail }, defaultPassword);
    }

    if (await userManager.FindByEmailAsync(bobEmail) is null)
    {
        await userManager.CreateAsync(new AuthUser { UserName = bobEmail, Email = bobEmail }, defaultPassword);
    }
}

public sealed record RegisterRequest(string Email, string Password);
public sealed record LoginRequest(string Email, string Password);
public sealed record AuthResponse(string Email, string UserId);

public partial class Program;
