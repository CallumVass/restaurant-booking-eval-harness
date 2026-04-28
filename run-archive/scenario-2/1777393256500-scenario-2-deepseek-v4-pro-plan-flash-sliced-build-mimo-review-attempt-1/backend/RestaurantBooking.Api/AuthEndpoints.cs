// pattern: Imperative Shell

using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Antiforgery;

namespace RestaurantBooking.Api;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this RouteGroupBuilder group)
    {
        group.MapPost("/auth/register", Register);
        group.MapPost("/auth/login", Login);
        group.MapPost("/auth/logout", LogoutSync);
        group.MapGet("/auth/me", Me);
        group.MapGet("/auth/csrf", GetCsrfToken);
        return group;
    }

    public sealed record RegisterRequest(string Name, string Email, string Password);

    public sealed record LoginRequest(string Email, string Password);

    public sealed record UserResponse(string Id, string Name, string Email);

    public static IResult Register(RegisterRequest request, AuthStore store, HttpContext httpContext)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Results.BadRequest(new ErrorResponse("ValidationError", "Name is required."));
        if (string.IsNullOrWhiteSpace(request.Email) || !request.Email.Contains('@'))
            return Results.BadRequest(new ErrorResponse("ValidationError", "A valid email is required."));
        if (string.IsNullOrWhiteSpace(request.Password) || request.Password.Length < 8)
            return Results.BadRequest(new ErrorResponse("WeakPassword", "Password must be at least 8 characters."));

        var result = store.Register(request.Name, request.Email, request.Password);
        if (!result.IsSuccess)
        {
            if (result.Error == BookingError.DuplicateEmail)
                return Results.Conflict(new ErrorResponse("DuplicateEmail", result.Message!));
            return Results.BadRequest(new ErrorResponse(result.Error!.ToString()!, result.Message!));
        }

        var user = result.Value!;
        SignInUser(httpContext, user);
        return Results.Created("/api/auth/me", new UserResponse(user.Id, user.Name, user.Email));
    }

    public static IResult Login(LoginRequest request, AuthStore store, HttpContext httpContext)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return Results.BadRequest(new ErrorResponse("ValidationError", "Email and password are required."));

        var user = store.ValidateCredentials(request.Email, request.Password);
        if (user is null)
            return Results.Unauthorized();

        SignInUser(httpContext, user);
        return Results.Ok(new UserResponse(user.Id, user.Name, user.Email));
    }

    public static async Task Logout(HttpContext httpContext)
    {
        await httpContext.SignOutAsync();
    }

    public static IResult LogoutSync(HttpContext httpContext)
    {
        httpContext.SignOutAsync().GetAwaiter().GetResult();
        return Results.Ok(new { message = "Logged out." });
    }

    public static IResult Me(HttpContext httpContext, AuthStore store)
    {
        var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId is null)
            return Results.Unauthorized();

        var user = store.FindById(userId);
        if (user is null)
            return Results.Unauthorized();

        return Results.Ok(new UserResponse(user.Id, user.Name, user.Email));
    }

    public static IResult GetCsrfToken(IAntiforgery antiforgery, HttpContext httpContext)
    {
        var tokens = antiforgery.GetAndStoreTokens(httpContext);
        var token = tokens.RequestToken!;
        httpContext.Response.Headers["X-CSRF-TOKEN"] = token;
        return Results.Ok(new { csrfToken = token });
    }

    private static void SignInUser(HttpContext httpContext, AppUser user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Email, user.Email),
        };
        var identity = new ClaimsIdentity(claims, "Cookies");
        var principal = new ClaimsPrincipal(identity);
        httpContext.SignInAsync(principal).GetAwaiter().GetResult();
    }
}
