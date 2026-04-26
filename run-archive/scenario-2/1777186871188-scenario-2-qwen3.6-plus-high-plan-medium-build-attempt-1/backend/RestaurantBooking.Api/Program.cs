// pattern: Imperative Shell

using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using RestaurantBooking.Api;

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

builder.Services.AddSingleton<AuthStore>();
builder.Services.AddSingleton<BookingStore>();

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
})
    .AddDefaultTokenProviders();

builder.Services.AddSingleton<IUserStore<IdentityUser>>(sp => sp.GetRequiredService<AuthStore>());
builder.Services.AddSingleton<IRoleStore<IdentityRole>>(sp => sp.GetRequiredService<AuthStore>());

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
    options.LoginPath = "/api/auth/login";
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
});

builder.Services.AddAuthorization();
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "XSRF-TOKEN";
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
    options.SuppressXFrameOptionsHeader = false;
});

var app = builder.Build();

var isTestEnv = app.Environment.EnvironmentName == "Testing";

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

api.MapPost("/bookings", (
    CreateBookingRequest request,
    BookingStore store,
    ClaimsPrincipal user) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId is null)
    {
        return Results.Unauthorized();
    }

    var authRequest = new CreateBookingRequest(
        request.RestaurantId,
        request.Date,
        request.Time,
        request.PartySize,
        request.GuestName,
        request.GuestEmail,
        userId);

    var result = store.TryCreate(authRequest, DateOnly.FromDateTime(DateTime.UtcNow));
    return ToHttpResult(result, created: true);
})
    .RequireAuthorization()
    .AddAntiforgeryFilter()
    .WithName("CreateBooking");

api.MapGet("/users/me/bookings", (
    BookingStore store,
    ClaimsPrincipal user) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId is null)
    {
        return Results.Unauthorized();
    }

    return Results.Ok(store.GetBookingsForUser(userId));
})
    .RequireAuthorization()
    .WithName("GetMyBookings");

api.MapPost("/auth/register", async (
    RegisterRequest request,
    UserManager<IdentityUser> userManager,
    HttpContext httpContext,
    IAntiforgery antiforgery) =>
{
    SetCsrfCookie(httpContext, antiforgery);

    var user = new IdentityUser
    {
        UserName = request.Email,
        Email = request.Email,
        EmailConfirmed = true,
    };

    var result = await userManager.CreateAsync(user, request.Password);
    if (!result.Succeeded)
    {
        var firstError = result.Errors.FirstOrDefault(e => e.Code.Contains("DuplicateEmail"));
        if (firstError is not null)
        {
            return ToAuthHttpResult(AuthResult<object>.Failure(AuthError.DuplicateEmail, "An account with this email already exists."));
        }

        var passwordError = result.Errors.FirstOrDefault(e => e.Code.StartsWith("Password"));
        if (passwordError is not null)
        {
            return ToAuthHttpResult(AuthResult<object>.Failure(AuthError.WeakPassword, passwordError.Description));
        }

        return ToAuthHttpResult(AuthResult<object>.Failure(AuthError.WeakPassword, result.Errors.First().Description));
    }

    var userInfo = new UserInfo(user.Id, user.Email!, request.DisplayName);
    return Results.Ok(userInfo);
})
    .AllowAnonymous()
    .AddAntiforgeryFilter()
    .WithName("RegisterUser");

api.MapPost("/auth/login", async (
    LoginRequest request,
    SignInManager<IdentityUser> signInManager,
    UserManager<IdentityUser> userManager,
    HttpContext httpContext,
    IAntiforgery antiforgery) =>
{
    var user = await userManager.FindByEmailAsync(request.Email);
    if (user is null)
    {
        return ToAuthHttpResult(AuthResult<object>.Failure(AuthError.InvalidCredentials, "Invalid email or password."));
    }

    var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
    if (!result.Succeeded)
    {
        return ToAuthHttpResult(AuthResult<object>.Failure(AuthError.InvalidCredentials, "Invalid email or password."));
    }

    await signInManager.SignInAsync(user, isPersistent: false);
    SetCsrfCookie(httpContext, antiforgery);

    var userInfo = new UserInfo(user.Id, user.Email!, user.UserName);
    return Results.Ok(userInfo);
})
    .AllowAnonymous()
    .AddAntiforgeryFilter()
    .WithName("LoginUser");

api.MapPost("/auth/logout", async (SignInManager<IdentityUser> signInManager, HttpContext httpContext, IAntiforgery antiforgery) =>
{
    await signInManager.SignOutAsync();
    httpContext.Response.Cookies.Delete("XSRF-TOKEN");
    SetCsrfCookie(httpContext, antiforgery);
    return Results.Ok();
})
    .AddAntiforgeryFilter()
    .WithName("LogoutUser");

api.MapGet("/auth/me", async (
    UserManager<IdentityUser> userManager,
    ClaimsPrincipal user) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId is null)
    {
        return Results.Ok((UserInfo?)null);
    }

    var identityUser = await userManager.FindByIdAsync(userId);
    if (identityUser is null)
    {
        return Results.Ok((UserInfo?)null);
    }

    return Results.Ok(new UserInfo(identityUser.Id, identityUser.Email!, identityUser.UserName));
})
    .WithName("GetCurrentUser");

api.MapGet("/auth/csrf-token", (HttpContext httpContext, IAntiforgery antiforgery) =>
{
    SetCsrfCookie(httpContext, antiforgery);
    return Results.Ok(new { token = antiforgery.GetAndStoreTokens(httpContext).RequestToken });
})
    .AllowAnonymous()
    .WithName("GetCsrfToken");

await SeedDemoUser(app.Services);

app.Run();

static async Task SeedDemoUser(IServiceProvider services)
{
    using var scope = services.CreateScope();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

    var existing = await userManager.FindByEmailAsync("demo@example.com");
    if (existing is not null) return;

    var demoUser = new IdentityUser
    {
        UserName = "demo@example.com",
        Email = "demo@example.com",
        EmailConfirmed = true,
    };

    await userManager.CreateAsync(demoUser, "Demo123!");
}

static void SetCsrfCookie(HttpContext httpContext, IAntiforgery antiforgery)
{
    var tokens = antiforgery.GetAndStoreTokens(httpContext);
    httpContext.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!, new CookieOptions
    {
        HttpOnly = false,
        SameSite = SameSiteMode.Lax,
        Secure = false,
    });
}

static IResult ToHttpResult<T>(BookingResult<T> result, bool created = false)
{
    if (result.IsSuccess)
    {
        return created ? Results.Created("/api/bookings", result.Value!) : Results.Ok(result.Value!);
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
    if (result.IsSuccess)
    {
        return Results.Ok(result.Value!);
    }

    var response = new ErrorResponse(result.Error!.Value.ToString(), result.Message!);
    return result.Error switch
    {
        AuthError.DuplicateEmail => Results.Conflict(response),
        AuthError.InvalidCredentials => Results.Json(response, statusCode: StatusCodes.Status401Unauthorized),
        _ => Results.BadRequest(response),
    };
}

public static class AntiforgeryEndpointExtensions
{
    public static RouteHandlerBuilder AddAntiforgeryFilter(this RouteHandlerBuilder builder) =>
        builder.AddEndpointFilter(async (context, next) =>
        {
            var env = context.HttpContext.RequestServices.GetRequiredService<IHostEnvironment>();
            if (env.IsDevelopment() || env.IsEnvironment("Test"))
            {
                return await next(context);
            }

            var antiforgery = context.HttpContext.RequestServices.GetRequiredService<IAntiforgery>();
            try
            {
                await antiforgery.ValidateRequestAsync(context.HttpContext);
            }
            catch (AntiforgeryValidationException)
            {
                return Results.BadRequest(new ErrorResponse("CSRF_VALIDATION_FAILED", "Anti-forgery token is missing or invalid."));
            }
            return await next(context);
        });
}

public partial class Program;
