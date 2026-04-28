// pattern: Imperative Shell

using System.Collections.Concurrent;
using Microsoft.AspNetCore.Identity;

namespace RestaurantBooking.Api;

public sealed class InMemoryUserStore :
    IUserStore<IdentityUser>,
    IUserPasswordStore<IdentityUser>,
    IUserEmailStore<IdentityUser>,
    IUserSecurityStampStore<IdentityUser>
{
    private readonly ConcurrentDictionary<string, IdentityUser> _users = new();

    public Task<IdentityResult> CreateAsync(IdentityUser user, CancellationToken ct)
    {
        if (_users.TryAdd(user.Id, Clone(user)))
            return Task.FromResult(IdentityResult.Success);

        return Task.FromResult(IdentityResult.Failed(new IdentityError { Code = "DuplicateUser", Description = "User already exists." }));
    }

    public Task<IdentityResult> UpdateAsync(IdentityUser user, CancellationToken ct)
    {
        _users[user.Id] = Clone(user);
        return Task.FromResult(IdentityResult.Success);
    }

    public Task<IdentityResult> DeleteAsync(IdentityUser user, CancellationToken ct)
    {
        _users.TryRemove(user.Id, out _);
        return Task.FromResult(IdentityResult.Success);
    }

    public Task<IdentityUser?> FindByIdAsync(string userId, CancellationToken ct) =>
        Task.FromResult(_users.TryGetValue(userId, out var user) ? Clone(user) : null);

    public Task<IdentityUser?> FindByNameAsync(string normalizedUserName, CancellationToken ct) =>
        Task.FromResult(_users.Values.FirstOrDefault(u => u.NormalizedUserName == normalizedUserName) is { } user ? Clone(user) : null);

    public Task<string> GetUserIdAsync(IdentityUser user, CancellationToken ct) =>
        Task.FromResult(user.Id);

    public Task<string?> GetUserNameAsync(IdentityUser user, CancellationToken ct) =>
        Task.FromResult<string?>(user.UserName);

    public Task SetUserNameAsync(IdentityUser user, string? userName, CancellationToken ct)
    {
        user.UserName = userName;
        return Task.CompletedTask;
    }

    public Task<string?> GetNormalizedUserNameAsync(IdentityUser user, CancellationToken ct) =>
        Task.FromResult(user.NormalizedUserName);

    public Task SetNormalizedUserNameAsync(IdentityUser user, string? normalizedName, CancellationToken ct)
    {
        user.NormalizedUserName = normalizedName;
        return Task.CompletedTask;
    }

    public Task SetPasswordHashAsync(IdentityUser user, string? passwordHash, CancellationToken ct)
    {
        user.PasswordHash = passwordHash;
        return Task.CompletedTask;
    }

    public Task<string?> GetPasswordHashAsync(IdentityUser user, CancellationToken ct) =>
        Task.FromResult(user.PasswordHash);

    public Task<bool> HasPasswordAsync(IdentityUser user, CancellationToken ct) =>
        Task.FromResult(user.PasswordHash != null);

    public Task SetEmailAsync(IdentityUser user, string? email, CancellationToken ct)
    {
        user.Email = email;
        return Task.CompletedTask;
    }

    public Task<string?> GetEmailAsync(IdentityUser user, CancellationToken ct) =>
        Task.FromResult<string?>(user.Email);

    public Task<bool> GetEmailConfirmedAsync(IdentityUser user, CancellationToken ct) =>
        Task.FromResult(user.EmailConfirmed);

    public Task SetEmailConfirmedAsync(IdentityUser user, bool confirmed, CancellationToken ct)
    {
        user.EmailConfirmed = confirmed;
        return Task.CompletedTask;
    }

    public Task<IdentityUser?> FindByEmailAsync(string normalizedEmail, CancellationToken ct) =>
        Task.FromResult(_users.Values.FirstOrDefault(u => u.NormalizedEmail == normalizedEmail) is { } user ? Clone(user) : null);

    public Task<string?> GetNormalizedEmailAsync(IdentityUser user, CancellationToken ct) =>
        Task.FromResult(user.NormalizedEmail);

    public Task SetNormalizedEmailAsync(IdentityUser user, string? normalizedEmail, CancellationToken ct)
    {
        user.NormalizedEmail = normalizedEmail;
        return Task.CompletedTask;
    }

    public Task SetSecurityStampAsync(IdentityUser user, string stamp, CancellationToken ct)
    {
        user.SecurityStamp = stamp;
        return Task.CompletedTask;
    }

    public Task<string?> GetSecurityStampAsync(IdentityUser user, CancellationToken ct) =>
        Task.FromResult(user.SecurityStamp);

    public void Dispose() { }

    private static IdentityUser Clone(IdentityUser source) => new()
    {
        Id = source.Id,
        UserName = source.UserName,
        NormalizedUserName = source.NormalizedUserName,
        Email = source.Email,
        NormalizedEmail = source.NormalizedEmail,
        EmailConfirmed = source.EmailConfirmed,
        PasswordHash = source.PasswordHash,
        SecurityStamp = source.SecurityStamp,
        ConcurrencyStamp = source.ConcurrencyStamp,
    };
}

public sealed class InMemoryRoleStore : IRoleStore<IdentityRole>
{
    private readonly ConcurrentDictionary<string, IdentityRole> _roles = new();

    public Task<IdentityResult> CreateAsync(IdentityRole role, CancellationToken ct)
    {
        if (_roles.TryAdd(role.Id, Clone(role)))
            return Task.FromResult(IdentityResult.Success);

        return Task.FromResult(IdentityResult.Failed(new IdentityError { Code = "DuplicateRole", Description = "Role already exists." }));
    }

    public Task<IdentityResult> UpdateAsync(IdentityRole role, CancellationToken ct)
    {
        _roles[role.Id] = Clone(role);
        return Task.FromResult(IdentityResult.Success);
    }

    public Task<IdentityResult> DeleteAsync(IdentityRole role, CancellationToken ct)
    {
        _roles.TryRemove(role.Id, out _);
        return Task.FromResult(IdentityResult.Success);
    }

    public Task<IdentityRole?> FindByIdAsync(string roleId, CancellationToken ct) =>
        Task.FromResult(_roles.TryGetValue(roleId, out var role) ? Clone(role) : null);

    public Task<IdentityRole?> FindByNameAsync(string normalizedRoleName, CancellationToken ct) =>
        Task.FromResult(_roles.Values.FirstOrDefault(r => r.NormalizedName == normalizedRoleName) is { } role ? Clone(role) : null);

    public Task<string> GetRoleIdAsync(IdentityRole role, CancellationToken ct) =>
        Task.FromResult(role.Id);

    public Task<string?> GetRoleNameAsync(IdentityRole role, CancellationToken ct) =>
        Task.FromResult<string?>(role.Name);

    public Task SetRoleNameAsync(IdentityRole role, string? roleName, CancellationToken ct)
    {
        role.Name = roleName;
        return Task.CompletedTask;
    }

    public Task<string?> GetNormalizedRoleNameAsync(IdentityRole role, CancellationToken ct) =>
        Task.FromResult(role.NormalizedName);

    public Task SetNormalizedRoleNameAsync(IdentityRole role, string? normalizedName, CancellationToken ct)
    {
        role.NormalizedName = normalizedName;
        return Task.CompletedTask;
    }

    public void Dispose() { }

    private static IdentityRole Clone(IdentityRole source) => new()
    {
        Id = source.Id,
        Name = source.Name,
        NormalizedName = source.NormalizedName,
        ConcurrencyStamp = source.ConcurrencyStamp,
    };
}
