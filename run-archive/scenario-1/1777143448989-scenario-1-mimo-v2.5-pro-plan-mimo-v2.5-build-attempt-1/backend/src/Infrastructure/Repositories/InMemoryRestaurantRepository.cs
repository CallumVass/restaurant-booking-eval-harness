using System.Collections.Concurrent;
using RestaurantBooking.Domain.Restaurants;

namespace RestaurantBooking.Infrastructure.Repositories;

public sealed class InMemoryRestaurantRepository : IRestaurantRepository
{
    private readonly ConcurrentDictionary<Guid, Restaurant> _restaurants = new();

    public InMemoryRestaurantRepository()
    {
        var seeds = new[]
        {
            new Restaurant
            {
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "The Golden Fork",
                Address = "123 Main Street, Downtown",
                MaxPartySize = 12
            },
            new Restaurant
            {
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Sakura Garden",
                Address = "456 Oak Avenue, Midtown",
                MaxPartySize = 8
            },
            new Restaurant
            {
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "La Piazza",
                Address = "789 Elm Boulevard, Uptown",
                MaxPartySize = 10
            },
            new Restaurant
            {
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Name = "Spice Route",
                Address = "321 Pine Lane, Eastside",
                MaxPartySize = 6
            },
            new Restaurant
            {
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Name = "Harbor View Seafood",
                Address = "654 Waterfront Drive, Harbor District",
                MaxPartySize = 14
            }
        };

        foreach (var restaurant in seeds)
            _restaurants.TryAdd(restaurant.Id, restaurant);
    }

    public Task<IReadOnlyList<Restaurant>> GetAllAsync() =>
        Task.FromResult<IReadOnlyList<Restaurant>>(_restaurants.Values.ToList());

    public Task<Restaurant?> GetByIdAsync(Guid id) =>
        Task.FromResult(_restaurants.TryGetValue(id, out var restaurant) ? restaurant : null);
}
