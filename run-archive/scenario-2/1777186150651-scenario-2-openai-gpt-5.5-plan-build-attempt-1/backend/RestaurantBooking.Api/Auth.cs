// pattern: Imperative Shell

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace RestaurantBooking.Api;

public sealed class AppUser : IdentityUser;

public sealed class AuthDbContext(DbContextOptions<AuthDbContext> options) : IdentityDbContext<AppUser>(options);

public static class DemoUsers
{
    public const string Email = "demo@example.com";
    public const string Password = "Password123!";

    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

        if (await userManager.FindByEmailAsync(Email) is not null)
        {
            return;
        }

        var user = new AppUser { UserName = Email, Email = Email, EmailConfirmed = true };
        var result = await userManager.CreateAsync(user, Password);
        if (!result.Succeeded)
        {
            throw new InvalidOperationException($"Failed to seed demo user: {string.Join(", ", result.Errors.Select(error => error.Description))}");
        }
    }
}
