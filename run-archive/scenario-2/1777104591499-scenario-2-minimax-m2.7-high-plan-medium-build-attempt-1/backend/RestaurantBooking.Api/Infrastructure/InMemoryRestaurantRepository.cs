// pattern: Imperative Shell

using RestaurantBooking.Domain.Entities;
using RestaurantBooking.Domain.Services;

namespace RestaurantBooking.Api.Infrastructure;

public sealed class InMemoryRestaurantRepository : IRestaurantRepository
{
    private readonly List<Restaurant> _restaurants;

    public InMemoryRestaurantRepository()
    {
        var r1 = new Restaurant
        {
            Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
            Name = "The Golden Fork",
            Description = "Fine dining with a modern twist",
            Address = "123 Main St, Downtown",
            Tables =
            [
                new() { Id = Guid.Parse("00000000-0000-0000-0001-000000000001"), RestaurantId = Guid.Parse("00000000-0000-0000-0000-000000000001"), TableNumber = 1, Capacity = 2 },
                new() { Id = Guid.Parse("00000000-0000-0000-0001-000000000002"), RestaurantId = Guid.Parse("00000000-0000-0000-0000-000000000001"), TableNumber = 2, Capacity = 4 },
                new() { Id = Guid.Parse("00000000-0000-0000-0001-000000000003"), RestaurantId = Guid.Parse("00000000-0000-0000-0000-000000000001"), TableNumber = 3, Capacity = 6 },
                new() { Id = Guid.Parse("00000000-0000-0000-0001-000000000004"), RestaurantId = Guid.Parse("00000000-0000-0000-0000-000000000001"), TableNumber = 4, Capacity = 8 },
            ]
        };
        var r2 = new Restaurant
        {
            Id = Guid.Parse("00000000-0000-0000-0000-000000000002"),
            Name = "Bella Italia",
            Description = "Authentic Italian cuisine",
            Address = "456 Oak Ave, Midtown",
            Tables =
            [
                new() { Id = Guid.Parse("00000000-0000-0000-0001-000000000005"), RestaurantId = Guid.Parse("00000000-0000-0000-0000-000000000002"), TableNumber = 1, Capacity = 2 },
                new() { Id = Guid.Parse("00000000-0000-0000-0001-000000000006"), RestaurantId = Guid.Parse("00000000-0000-0000-0000-000000000002"), TableNumber = 2, Capacity = 4 },
                new() { Id = Guid.Parse("00000000-0000-0000-0001-000000000007"), RestaurantId = Guid.Parse("00000000-0000-0000-0000-000000000002"), TableNumber = 3, Capacity = 6 },
            ]
        };
        var r3 = new Restaurant
        {
            Id = Guid.Parse("00000000-0000-0000-0000-000000000003"),
            Name = "Sakura Sushi",
            Description = "Premium Japanese dining",
            Address = "789 Cherry Blvd, Uptown",
            Tables =
            [
                new() { Id = Guid.Parse("00000000-0000-0000-0001-000000000008"), RestaurantId = Guid.Parse("00000000-0000-0000-0000-000000000003"), TableNumber = 1, Capacity = 4 },
                new() { Id = Guid.Parse("00000000-0000-0000-0001-000000000009"), RestaurantId = Guid.Parse("00000000-0000-0000-0000-000000000003"), TableNumber = 2, Capacity = 8 },
            ]
        };
        _restaurants = [r1, r2, r3];
    }

    public Task<IReadOnlyList<Restaurant>> GetAllAsync(CancellationToken ct = default)
        => Task.FromResult<IReadOnlyList<Restaurant>>(_restaurants);

    public Task<Restaurant?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => Task.FromResult(_restaurants.FirstOrDefault(r => r.Id == id));
}