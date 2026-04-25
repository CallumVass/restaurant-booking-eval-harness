// pattern: Imperative Shell

using System.Collections.Concurrent;
using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Api.Infrastructure;

public class InMemoryStore
{
    public ConcurrentDictionary<int, Restaurant> Restaurants { get; } = new();
    public ConcurrentDictionary<string, Booking> Bookings { get; } = new();

    public InMemoryStore()
    {
        Seed();
    }

    private void Seed()
    {
        Restaurants[1] = new Restaurant(1, "Bella Napoli", [
            new Table(1, 1, 2),
            new Table(2, 1, 4),
            new Table(3, 1, 6),
            new Table(4, 1, 8)
        ]);

        Restaurants[2] = new Restaurant(2, "Sakura Garden", [
            new Table(5, 2, 2),
            new Table(6, 2, 2),
            new Table(7, 2, 4),
            new Table(8, 2, 6)
        ]);

        Restaurants[3] = new Restaurant(3, "The Steakhouse", [
            new Table(9, 3, 2),
            new Table(10, 3, 4),
            new Table(11, 3, 4),
            new Table(12, 3, 8),
            new Table(13, 3, 8)
        ]);
    }
}
