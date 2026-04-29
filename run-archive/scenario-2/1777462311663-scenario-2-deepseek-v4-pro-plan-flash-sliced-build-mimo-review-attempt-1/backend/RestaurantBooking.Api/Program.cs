// pattern: Imperative Shell

using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RestaurantBooking.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("RestaurantBooking"));

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = true;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.SlidingExpiration = true;
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

builder.Services.AddAuthorization();

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
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

// Seed demo users
using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
    if (await userManager.FindByEmailAsync("alice@example.com") is null)
    {
        await userManager.CreateAsync(new IdentityUser
        {
            UserName = "alice@example.com",
            Email = "alice@example.com",
            EmailConfirmed = true,
        }, "Demo1234!");
    }
    if (await userManager.FindByEmailAsync("bob@example.com") is null)
    {
        await userManager.CreateAsync(new IdentityUser
        {
            UserName = "bob@example.com",
            Email = "bob@example.com",
            EmailConfirmed = true,
        }, "Demo1234!");
    }
}

var api = app.MapGroup("/api");

// Antiforgery token endpoint (needed by SPA for CSRF)
api.MapGet("/antiforgery/token", (IAntiforgery antiforgery, HttpContext context) =>
{
    var tokens = antiforgery.GetAndStoreTokens(context);
    return Results.Ok(new { token = tokens.RequestToken });
})
.WithName("GetAntiforgeryToken");

// Auth endpoints
api.MapPost("/auth/register", async (RegisterRequest request, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IAntiforgery antiforgery, HttpContext context) =>
{
    var csrfResult = await ValidateCsrf(context, antiforgery);
    if (csrfResult is not null) return csrfResult;

    if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains('@'))
    {
        return Results.BadRequest(new ErrorResponse("InvalidEmail", "A valid email address is required."));
    }

    var existingUser = await userManager.FindByEmailAsync(request.Email);
    if (existingUser is not null)
    {
        return Results.BadRequest(new ErrorResponse("DuplicateEmail", "An account with this email already exists."));
    }

    var user = new IdentityUser
    {
        UserName = request.Email,
        Email = request.Email,
        EmailConfirmed = true,
    };

    var createResult = await userManager.CreateAsync(user, request.Password);
    if (!createResult.Succeeded)
    {
        var errors = string.Join("; ", createResult.Errors.Select(e => e.Description));
        return Results.BadRequest(new ErrorResponse("RegistrationFailed", errors));
    }

    await signInManager.SignInAsync(user, isPersistent: true);

    return Results.Ok(new UserInfo(user.Id, user.Email));
})
.WithName("Register");

api.MapPost("/auth/login", async (LoginRequest request, SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, IAntiforgery antiforgery, HttpContext context) =>
{
    var csrfResult = await ValidateCsrf(context, antiforgery);
    if (csrfResult is not null) return csrfResult;

    var user = await userManager.FindByEmailAsync(request.Email);
    if (user is null)
    {
        return Results.Unauthorized();
    }

    var signInResult = await signInManager.PasswordSignInAsync(user, request.Password, isPersistent: true, lockoutOnFailure: false);
    if (!signInResult.Succeeded)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(new UserInfo(user.Id, user.Email!));
})
.WithName("Login");

api.MapPost("/auth/logout", async (SignInManager<IdentityUser> signInManager, IAntiforgery antiforgery, HttpContext context) =>
{
    var csrfResult = await ValidateCsrf(context, antiforgery);
    if (csrfResult is not null) return csrfResult;

    await signInManager.SignOutAsync();
    return Results.Ok();
})
.WithName("Logout");

api.MapGet("/auth/me", (HttpContext context) =>
{
    if (context.User.Identity?.IsAuthenticated != true)
    {
        return Results.Ok<object?>(null);
    }

    var userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "";
    var email = context.User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value ?? "";
    return Results.Ok<object?>(new UserInfo(userId, email));
})
.WithName("Me");

// Restaurant endpoints (public — no auth required)
api.MapGet("/restaurants", (BookingStore store) => store.Restaurants)
    .WithName("ListRestaurants");

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

// Booking endpoints (authenticated)
api.MapGet("/bookings/mine", (HttpContext context, BookingStore store) =>
{
    var userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userId))
    {
        return Results.Unauthorized();
    }

    return Results.Ok(store.GetBookingsForUser(userId));
})
    .WithName("ListBookingsMine");

api.MapPost("/bookings", async (CreateBookingRequest request, BookingStore store, IAntiforgery antiforgery, HttpContext context) =>
{
    var userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userId))
    {
        return Results.Unauthorized();
    }

    var csrfResult = await ValidateCsrf(context, antiforgery);
    if (csrfResult is not null) return csrfResult;

    var result = store.TryCreate(request, DateOnly.FromDateTime(DateTime.UtcNow), userId);
    return ToHttpResult(result, created: true);
})
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

static async Task<IResult?> ValidateCsrf(HttpContext context, IAntiforgery antiforgery)
{
    try
    {
        await antiforgery.ValidateRequestAsync(context);
        return null;
    }
    catch (AntiforgeryValidationException)
    {
        return Results.BadRequest(new ErrorResponse("CsrfTokenMissing", "A valid anti-forgery token is required."));
    }
}

public partial class Program;
