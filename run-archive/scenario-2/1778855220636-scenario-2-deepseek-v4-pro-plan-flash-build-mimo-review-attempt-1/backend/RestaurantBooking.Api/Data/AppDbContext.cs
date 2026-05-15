// pattern: Imperative Shell

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace RestaurantBooking.Api.Data;

public sealed class AppUser : IdentityUser
{
    public string Name { get; set; } = string.Empty;
}

public sealed class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<AppUser>(entity => entity.Property(u => u.Name).HasMaxLength(100));
    }
}
