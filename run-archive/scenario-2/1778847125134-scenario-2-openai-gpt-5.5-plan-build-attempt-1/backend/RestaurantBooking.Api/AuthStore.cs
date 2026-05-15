// pattern: Imperative Shell

using System.Collections.Concurrent;
using System.Security.Cryptography;

namespace RestaurantBooking.Api;

public sealed class UserStore
{
    private readonly ConcurrentDictionary<string, AppUser> usersByEmail = new(StringComparer.OrdinalIgnoreCase);

    public UserStore()
    {
        Register("demo@example.com", "Password123!");
        Register("riley@example.com", "Password123!");
    }

    public AuthResult Register(string email, string password)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(normalizedEmail) || !normalizedEmail.Contains('@', StringComparison.Ordinal))
        {
            return AuthResult.Failure("InvalidEmail", "Enter a valid email address.");
        }

        if (password.Length < 8)
        {
            return AuthResult.Failure("WeakPassword", "Password must be at least 8 characters.");
        }

        var user = new AppUser(Guid.NewGuid().ToString("N"), normalizedEmail, PasswordHash.Create(password));
        return usersByEmail.TryAdd(normalizedEmail, user)
            ? AuthResult.Success(user)
            : AuthResult.Failure("DuplicateEmail", "An account already exists for that email.");
    }

    public AuthResult ValidateLogin(string email, string password)
    {
        if (!usersByEmail.TryGetValue(email.Trim(), out var user) || !user.Password.Verify(password))
        {
            return AuthResult.Failure("InvalidCredentials", "Email or password is incorrect.");
        }

        return AuthResult.Success(user);
    }
}

public sealed record AppUser(string Id, string Email, PasswordHash Password);

public sealed record AuthResult(AppUser? User, string? Code, string? Message)
{
    public bool IsSuccess => User is not null;

    public static AuthResult Success(AppUser user) => new(user, null, null);

    public static AuthResult Failure(string code, string message) => new(null, code, message);
}

public sealed record PasswordHash(byte[] Salt, byte[] Hash)
{
    private const int Iterations = 100_000;
    private const int SaltSize = 16;
    private const int HashSize = 32;

    public static PasswordHash Create(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, HashAlgorithmName.SHA256, HashSize);
        return new PasswordHash(salt, hash);
    }

    public bool Verify(string password)
    {
        var attempted = Rfc2898DeriveBytes.Pbkdf2(password, Salt, Iterations, HashAlgorithmName.SHA256, HashSize);
        return CryptographicOperations.FixedTimeEquals(Hash, attempted);
    }
}
