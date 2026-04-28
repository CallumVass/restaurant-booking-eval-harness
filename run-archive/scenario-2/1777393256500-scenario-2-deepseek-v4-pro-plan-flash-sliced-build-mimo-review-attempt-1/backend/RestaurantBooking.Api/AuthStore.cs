// pattern: Imperative Shell

using System.Security.Cryptography;

namespace RestaurantBooking.Api;

public sealed record AppUser(string Id, string Name, string Email, string PasswordHash);

public sealed class AuthStore
{
    private readonly object gate = new();
    private readonly List<AppUser> users = [];

    public BookingResult<AppUser> Register(string name, string email, string password)
    {
        lock (gate)
        {
            if (users.Any(u => string.Equals(u.Email, email, StringComparison.OrdinalIgnoreCase)))
            {
                return BookingResult<AppUser>.Failure(BookingError.DuplicateEmail, "A user with this email already exists.");
            }

            var id = Guid.NewGuid().ToString("N");
            var hash = HashPassword(password);
            var user = new AppUser(id, name.Trim(), email.Trim().ToLowerInvariant(), hash);
            users.Add(user);
            return BookingResult<AppUser>.Success(user);
        }
    }

    public AppUser? FindByEmail(string email)
    {
        lock (gate)
        {
            return users.FirstOrDefault(u => string.Equals(u.Email, email.Trim().ToLowerInvariant(), StringComparison.OrdinalIgnoreCase));
        }
    }

    public AppUser? FindById(string id)
    {
        lock (gate)
        {
            return users.FirstOrDefault(u => u.Id == id);
        }
    }

    public AppUser? ValidateCredentials(string email, string password)
    {
        var user = FindByEmail(email);
        if (user is null) return null;

        return VerifyPassword(password, user.PasswordHash) ? user : null;
    }

    public void SeedDemoUser()
    {
        lock (gate)
        {
            if (!users.Any(u => string.Equals(u.Email, "demo@example.com", StringComparison.OrdinalIgnoreCase)))
            {
                var hash = HashPassword("Demo1234!");
                var user = new AppUser(Guid.NewGuid().ToString("N"), "Demo User", "demo@example.com", hash);
                users.Add(user);
            }
        }
    }

    private static string HashPassword(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            100_000,
            HashAlgorithmName.SHA256,
            32);
        var result = new byte[49];
        result[0] = 1;
        Buffer.BlockCopy(salt, 0, result, 1, 16);
        Buffer.BlockCopy(hash, 0, result, 17, 32);
        return Convert.ToBase64String(result);
    }

    private static bool VerifyPassword(string password, string storedHash)
    {
        var bytes = Convert.FromBase64String(storedHash);
        if (bytes.Length != 49 || bytes[0] != 1) return false;
        var salt = bytes[1..17];
        var storedHashBytes = bytes[17..49];
        var computedHash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            100_000,
            HashAlgorithmName.SHA256,
            32);
        return CryptographicOperations.FixedTimeEquals(computedHash, storedHashBytes);
    }
}
