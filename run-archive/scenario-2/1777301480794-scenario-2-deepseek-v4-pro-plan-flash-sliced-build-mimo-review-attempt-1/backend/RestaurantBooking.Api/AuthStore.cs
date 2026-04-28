// pattern: Imperative Shell

using System.Collections.Concurrent;
using Microsoft.AspNetCore.Identity;

namespace RestaurantBooking.Api;

public sealed class AuthStore
{
    private readonly ConcurrentDictionary<string, AuthUser> usersByEmail = new(StringComparer.OrdinalIgnoreCase);
    private readonly IPasswordHasher<AuthUser> passwordHasher = new PasswordHasher<AuthUser>();

    public AuthResult<AuthUser> Register(string email, string password, string displayName)
    {
        if (usersByEmail.ContainsKey(email))
        {
            return AuthResult<AuthUser>.Failure(AuthError.DuplicateEmail, "An account with this email already exists.");
        }

        var id = Guid.NewGuid().ToString("N");
        var user = new AuthUser(id, email.Trim(), displayName.Trim(), "");
        var hash = passwordHasher.HashPassword(user, password);
        var hashedUser = user with { PasswordHash = hash };

        if (!usersByEmail.TryAdd(email, hashedUser))
        {
            return AuthResult<AuthUser>.Failure(AuthError.DuplicateEmail, "An account with this email already exists.");
        }

        return AuthResult<AuthUser>.Success(hashedUser);
    }

    public AuthResult<AuthUser> Login(string email, string password)
    {
        if (!usersByEmail.TryGetValue(email, out var user))
        {
            return AuthResult<AuthUser>.Failure(AuthError.InvalidCredentials, "Invalid email or password.");
        }

        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
        if (result is PasswordVerificationResult.Failed)
        {
            return AuthResult<AuthUser>.Failure(AuthError.InvalidCredentials, "Invalid email or password.");
        }

        return AuthResult<AuthUser>.Success(user);
    }

    public AuthUser? GetById(string id) =>
        usersByEmail.Values.FirstOrDefault(u => u.Id == id);
}
