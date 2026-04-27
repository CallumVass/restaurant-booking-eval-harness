// pattern: Imperative Shell

using System.Collections.Concurrent;
using RestaurantBooking.Domain;

namespace RestaurantBooking.Web.Repositories;

public sealed class InMemoryRestaurantRepository
{
    private readonly ConcurrentDictionary<string, Restaurant> _restaurants = new();

    public InMemoryRestaurantRepository()
    {
        Seed();
    }

    public IReadOnlyList<Restaurant> GetAll() => _restaurants.Values.ToList();

    public Restaurant? GetById(string id) =>
        _restaurants.TryGetValue(id, out var r) ? r : null;

    private void Seed()
    {
        var restaurants = new[]
        {
            new Restaurant
            {
                Id = "r1",
                Name = "La Trattoria",
                Cuisine = "Italian",
                Address = "123 Main St, Downtown",
                Tables = new List<Table>
                {
                    new() { Id = "r1-t1", Capacity = 2, Label = "Window Table" },
                    new() { Id = "r1-t2", Capacity = 4, Label = "Booth 1" },
                    new() { Id = "r1-t3", Capacity = 6, Label = "Family Table" },
                    new() { Id = "r1-t4", Capacity = 4, Label = "Booth 2" }
                }
            },
            new Restaurant
            {
                Id = "r2",
                Name = "Sakura Sushi",
                Cuisine = "Japanese",
                Address = "456 Oak Ave, Midtown",
                Tables = new List<Table>
                {
                    new() { Id = "r2-t1", Capacity = 4, Label = "Sushi Bar" },
                    new() { Id = "r2-t2", Capacity = 6, Label = "Private Room" },
                    new() { Id = "r2-t3", Capacity = 2, Label = "Corner Table" }
                }
            },
            new Restaurant
            {
                Id = "r3",
                Name = "The Grill House",
                Cuisine = "American",
                Address = "789 Pine Rd, Uptown",
                Tables = new List<Table>
                {
                    new() { Id = "r3-t1", Capacity = 8, Label = "Private Dining" },
                    new() { Id = "r3-t2", Capacity = 4, Label = "Patio 1" },
                    new() { Id = "r3-t3", Capacity = 4, Label = "Patio 2" },
                    new() { Id = "r3-t4", Capacity = 2, Label = "Bar Side" },
                    new() { Id = "r3-t5", Capacity = 6, Label = "Main Floor" }
                }
            },
            new Restaurant
            {
                Id = "r4",
                Name = "El Pueblo",
                Cuisine = "Mexican",
                Address = "321 Elm St, Riverside",
                Tables = new List<Table>
                {
                    new() { Id = "r4-t1", Capacity = 4, Label = "Cantina 1" },
                    new() { Id = "r4-t2", Capacity = 6, Label = "Cantina 2" },
                    new() { Id = "r4-t3", Capacity = 2, Label = "Garden Table" },
                    new() { Id = "r4-t4", Capacity = 8, Label = "Fiesta Room" }
                }
            }
        };

        foreach (var r in restaurants)
            _restaurants[r.Id] = r;
    }
}
