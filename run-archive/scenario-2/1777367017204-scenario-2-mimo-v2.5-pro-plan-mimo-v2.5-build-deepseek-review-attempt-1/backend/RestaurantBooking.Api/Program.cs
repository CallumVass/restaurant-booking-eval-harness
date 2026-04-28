// pattern: Imperative Shell

using System.Security.Claims;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RestaurantBooking.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase("RestaurantBooking"));
builder.Services.AddIdentityCore<IdentityUser>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireDigit = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddSignInManager();

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = IdentityConstants.ApplicationScheme;
    options.DefaultSignInScheme = IdentityConstants.ApplicationScheme;
})
.AddCookie(IdentityConstants.ApplicationScheme, options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
    options.Cookie.IsEssential = true;
    options.ExpireTimeSpan = TimeSpan.FromHours(24);
    options.SlidingExpiration = true;
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
    options.Events.OnRedirectToAccessDenied = context =>
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        return Task.CompletedTask;
    };
});

builder.Services.AddAuthorization();

builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
});

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

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
    if (await userManager.FindByEmailAsync("demo@example.com") is null)
    {
        await userManager.CreateAsync(new IdentityUser { UserName = "demo@example.com", Email = "demo@example.com" }, "Demo123!");
    }
}

app.UseCors();
app.UseAntiforgery();
app.UseAuthentication();
app.UseAuthorization();
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

api.MapPost("/bookings", async (CreateBookingRequest request, BookingStore store, UserManager<IdentityUser> userManager, HttpContext httpContext, IAntiforgery antiforgery) =>
{
    await antiforgery.ValidateRequestAsync(httpContext);

    var user = await userManager.GetUserAsync(httpContext.User);
    if (user is null) return Results.Unauthorized();

    var result = store.TryCreate(request, DateOnly.FromDateTime(DateTime.UtcNow), user.Id);
    return ToHttpResult(result, created: true);
})
    .RequireAuthorization()
    .WithName("CreateBooking");

api.MapGet("/bookings/mine", async (BookingStore store, UserManager<IdentityUser> userManager, HttpContext httpContext) =>
{
    var user = await userManager.GetUserAsync(httpContext.User);
    if (user is null) return Results.Unauthorized();

    return Results.Ok(store.FindByUser(user.Id));
})
    .RequireAuthorization()
    .WithName("ListMyBookings");

var auth = app.MapGroup("/api/auth");

auth.MapGet("/csrf", (HttpContext httpContext, IAntiforgery antiforgery) =>
{
    var tokenSet = antiforgery.GetAndStoreTokens(httpContext);
    return Results.Ok(new { token = tokenSet.RequestToken });
})
    .WithName("GetCsrfToken")
    .AllowAnonymous();

auth.MapPost("/register", async (RegisterRequest request, UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, HttpContext httpContext, IAntiforgery antiforgery) =>
{
    await antiforgery.ValidateRequestAsync(httpContext);

    var user = new IdentityUser { UserName = request.Email, Email = request.Email };
    var result = await userManager.CreateAsync(user, request.Password);
    if (!result.Succeeded)
    {
        var error = result.Errors.FirstOrDefault()?.Description ?? "Registration failed.";
        return Results.BadRequest(new { error });
    }

    await signInManager.SignInAsync(user, isPersistent: false);
    return Results.Ok(new { user.Email, user.Id });
})
    .AllowAnonymous()
    .WithName("Register");

auth.MapPost("/login", async (LoginRequest request, SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, HttpContext httpContext, IAntiforgery antiforgery) =>
{
    await antiforgery.ValidateRequestAsync(httpContext);

    var user = await userManager.FindByEmailAsync(request.Email);
    if (user is null) return Results.Unauthorized();

    var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
    if (!result.Succeeded) return Results.Unauthorized();

    await signInManager.SignInAsync(user, isPersistent: false);
    return Results.Ok(new { user.Email, user.Id });
})
    .AllowAnonymous()
    .WithName("Login");

auth.MapPost("/logout", async (SignInManager<IdentityUser> signInManager, HttpContext httpContext, IAntiforgery antiforgery) =>
{
    await antiforgery.ValidateRequestAsync(httpContext);

    await signInManager.SignOutAsync();
    return Results.NoContent();
})
    .WithName("Logout");

auth.MapGet("/me", async (UserManager<IdentityUser> userManager, HttpContext httpContext) =>
{
    var user = await userManager.GetUserAsync(httpContext.User);
    if (user is null) return Results.Unauthorized();
    return Results.Ok(new { user.Email, user.Id });
})
    .WithName("GetCurrentUser");

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
