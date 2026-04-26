// pattern: Imperative Shell

using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RestaurantBooking.Api;
using RestaurantBooking.Api.Auth;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

builder.Services.AddDbContext<AppDbContext>(opts => opts.UseInMemoryDatabase("Identity"));
builder.Services.AddIdentity<AppUser, IdentityRole>(opts =>
    {
        opts.Password.RequireDigit = true;
        opts.Password.RequiredLength = 6;
        opts.Password.RequireNonAlphanumeric = false;
        opts.Password.RequireUppercase = false;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(opts =>
{
    opts.Cookie.HttpOnly = true;
    opts.Cookie.SameSite = SameSiteMode.Lax;
    opts.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    opts.ExpireTimeSpan = TimeSpan.FromHours(4);
    opts.SlidingExpiration = true;
    opts.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
    opts.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = 403;
        return Task.CompletedTask;
    };
});

builder.Services.AddAuthorization();
builder.Services.AddAntiforgery(opts =>
{
    opts.HeaderName = "X-CSRF-TOKEN";
    opts.Cookie.HttpOnly = true;
    opts.Cookie.SameSite = SameSiteMode.Lax;
    opts.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
});

builder.Services.AddSingleton<BookingStore>();

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();
app.MapOpenApi();

// Seed demo user
using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
    if (await userManager.FindByEmailAsync("demo@example.com") is null)
    {
        var demoUser = new AppUser { UserName = "demo@example.com", Email = "demo@example.com" };
        await userManager.CreateAsync(demoUser, "Demo123!");
    }
}

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

api.MapPost("/bookings", (CreateBookingRequest request, BookingStore store, ClaimsPrincipal user) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    var result = store.TryCreate(request, DateOnly.FromDateTime(DateTime.UtcNow), userId);
    return ToHttpResult(result, created: true);
})
    .RequireAuthorization()
    .WithName("CreateBooking");

api.MapGet("/bookings/mine", (BookingStore store, ClaimsPrincipal user) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    return store.GetBookingsByUser(userId!);
})
    .RequireAuthorization()
    .WithName("ListMyBookings");

// Auth endpoints
var auth = api.MapGroup("/auth");

auth.MapPost("/register", async (RegisterRequest req, UserManager<AppUser> userManager, HttpContext httpContext) =>
{
    if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
    {
        return Results.BadRequest(new ErrorResponse("VALIDATION_ERROR", "Email and password are required."));
    }

    var user = new AppUser { UserName = req.Email, Email = req.Email };
    var result = await userManager.CreateAsync(user, req.Password);

    if (!result.Succeeded)
    {
        var message = string.Join("; ", result.Errors.Select(e => e.Description));
        return Results.BadRequest(new ErrorResponse("REGISTRATION_ERROR", message));
    }

    await SignInManager(httpContext).SignInAsync(user, isPersistent: false);
    return Results.Ok(new UserResponse(user.Id, user.Email!));
})
    .WithName("Register");

auth.MapPost("/login", async (LoginRequest req, UserManager<AppUser> userManager, HttpContext httpContext) =>
{
    var user = await userManager.FindByEmailAsync(req.Email);
    if (user is null || !await userManager.CheckPasswordAsync(user, req.Password))
    {
        return Results.Unauthorized();
    }

    await SignInManager(httpContext).SignInAsync(user, isPersistent: false);
    return Results.Ok(new UserResponse(user.Id, user.Email!));
})
    .WithName("Login");

auth.MapPost("/logout", async (HttpContext httpContext) =>
{
    await SignInManager(httpContext).SignOutAsync();
    return Results.Ok();
})
    .RequireAuthorization()
    .WithName("Logout");

auth.MapGet("/me", (ClaimsPrincipal user) =>
{
    if (user.Identity?.IsAuthenticated != true)
    {
        return Results.Unauthorized();
    }

    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)!;
    var email = user.FindFirstValue(ClaimTypes.Email)!;
    return Results.Ok(new UserResponse(userId, email));
})
    .RequireAuthorization()
    .WithName("GetCurrentUser");

auth.MapGet("/antiforgery/token", (IAntiforgery antiforgery, HttpContext httpContext) =>
{
    var tokenSet = antiforgery.GetAndStoreTokens(httpContext);
    return Results.Ok(new { requestToken = tokenSet.RequestToken });
})
    .WithName("GetAntiforgeryToken");

app.Run();

static SignInManager<AppUser> SignInManager(HttpContext httpContext) =>
    httpContext.RequestServices.GetRequiredService<SignInManager<AppUser>>();

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

public sealed record RegisterRequest(string Email, string Password);
public sealed record LoginRequest(string Email, string Password);
public sealed record UserResponse(string Id, string Email);
