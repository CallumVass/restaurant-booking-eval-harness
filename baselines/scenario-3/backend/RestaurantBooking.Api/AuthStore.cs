// pattern: Imperative Shell

using Microsoft.AspNetCore.Identity;

namespace RestaurantBooking.Api;

public sealed class AuthStore
{
    public const string DemoEmail = "demo@restaurant.test";
    public const string DemoPassword = "DinnerTable42!";

    private readonly object gate = new();
    private readonly PasswordHasher<AppUser> passwordHasher = new();
    private readonly List<AppUser> users = [];

    public AuthStore()
    {
        Create(DemoEmail, DemoPassword);
    }

    public AuthUserResponse? Validate(string email, string password)
    {
        lock (gate)
        {
            var user = FindByEmail(email);
            if (user is null)
            {
                return null;
            }

            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            return result == PasswordVerificationResult.Failed ? null : user.ToResponse();
        }
    }

    public AuthUserResponse? Create(string email, string password)
    {
        lock (gate)
        {
            var normalizedEmail = NormalizeEmail(email);
            if (normalizedEmail.Length == 0 || password.Length < 8 || FindByEmail(normalizedEmail) is not null)
            {
                return null;
            }

            var user = new AppUser(Guid.NewGuid().ToString("N"), normalizedEmail, string.Empty);
            var hashed = user with { PasswordHash = passwordHasher.HashPassword(user, password) };
            users.Add(hashed);
            return hashed.ToResponse();
        }
    }

    public AuthUserResponse? Find(string id)
    {
        lock (gate)
        {
            return users.FirstOrDefault(user => user.Id == id)?.ToResponse();
        }
    }

    private AppUser? FindByEmail(string email)
    {
        var normalizedEmail = NormalizeEmail(email);
        return users.FirstOrDefault(user => user.Email == normalizedEmail);
    }

    private static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
}

public sealed record AppUser(string Id, string Email, string PasswordHash)
{
    public AuthUserResponse ToResponse() => new(Id, Email);
}
