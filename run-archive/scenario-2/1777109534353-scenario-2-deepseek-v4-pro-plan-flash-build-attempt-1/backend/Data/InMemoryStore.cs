using System.Collections.Concurrent;
using Backend.Domain;

namespace Backend.Data;

public class InMemoryStore
{
    public ConcurrentDictionary<Guid, Restaurant> Restaurants { get; } = new();
    public ConcurrentDictionary<Guid, Booking> Bookings { get; } = new();

    public InMemoryStore()
    {
        Seed();
    }

    private void Seed()
    {
        var r1 = Guid.NewGuid();
        var r2 = Guid.NewGuid();
        var r3 = Guid.NewGuid();

        var restaurants = new[]
        {
            new Restaurant(r1, "La Piazza", "Authentic Italian cuisine with a cozy atmosphere", new List<Table>
            {
                new(Guid.NewGuid(), r1, 2),
                new(Guid.NewGuid(), r1, 2),
                new(Guid.NewGuid(), r1, 4),
                new(Guid.NewGuid(), r1, 4),
                new(Guid.NewGuid(), r1, 6),
                new(Guid.NewGuid(), r1, 8),
            }),
            new Restaurant(r2, "Sakura Sushi", "Fresh Japanese sushi and seafood", new List<Table>
            {
                new(Guid.NewGuid(), r2, 2),
                new(Guid.NewGuid(), r2, 2),
                new(Guid.NewGuid(), r2, 4),
                new(Guid.NewGuid(), r2, 4),
                new(Guid.NewGuid(), r2, 6),
            }),
            new Restaurant(r3, "The Grill House", "Premium steaks and grilled specialties", new List<Table>
            {
                new(Guid.NewGuid(), r3, 2),
                new(Guid.NewGuid(), r3, 4),
                new(Guid.NewGuid(), r3, 4),
                new(Guid.NewGuid(), r3, 6),
                new(Guid.NewGuid(), r3, 8),
                new(Guid.NewGuid(), r3, 8),
            }),
        };

        foreach (var r in restaurants)
        {
            Restaurants[r.Id] = r;
        }
    }
}
