using RestaurantBooking.Api.Models;

namespace RestaurantBooking.Api.Data;

public static class SeedData
{
    public static void Initialize(InMemoryStore store)
    {
        if (!store.Restaurants.IsEmpty) return;

        var italian = new Restaurant
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Name = "La Trattoria",
            Description = "Authentic Italian cuisine in a cozy setting",
            Cuisine = "Italian",
            Address = "123 Main St, Anytown",
            Tables =
            [
                new() { Id = Guid.NewGuid(), RestaurantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), Capacity = 2, Label = "T1" },
                new() { Id = Guid.NewGuid(), RestaurantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), Capacity = 2, Label = "T2" },
                new() { Id = Guid.NewGuid(), RestaurantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), Capacity = 4, Label = "T3" },
                new() { Id = Guid.NewGuid(), RestaurantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), Capacity = 4, Label = "T4" },
                new() { Id = Guid.NewGuid(), RestaurantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), Capacity = 6, Label = "T5" },
            ]
        };

        var japanese = new Restaurant
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Name = "Sakura Sushi",
            Description = "Fresh sushi and Japanese delicacies",
            Cuisine = "Japanese",
            Address = "456 Oak Ave, Anytown",
            Tables =
            [
                new() { Id = Guid.NewGuid(), RestaurantId = Guid.Parse("22222222-2222-2222-2222-222222222222"), Capacity = 2, Label = "S1" },
                new() { Id = Guid.NewGuid(), RestaurantId = Guid.Parse("22222222-2222-2222-2222-222222222222"), Capacity = 4, Label = "S2" },
                new() { Id = Guid.NewGuid(), RestaurantId = Guid.Parse("22222222-2222-2222-2222-222222222222"), Capacity = 4, Label = "S3" },
                new() { Id = Guid.NewGuid(), RestaurantId = Guid.Parse("22222222-2222-2222-2222-222222222222"), Capacity = 8, Label = "S4" },
            ]
        };

        var mexican = new Restaurant
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            Name = "El Mariachi",
            Description = "Bold Mexican flavors and craft cocktails",
            Cuisine = "Mexican",
            Address = "789 Pine Rd, Anytown",
            Tables =
            [
                new() { Id = Guid.NewGuid(), RestaurantId = Guid.Parse("33333333-3333-3333-3333-333333333333"), Capacity = 2, Label = "M1" },
                new() { Id = Guid.NewGuid(), RestaurantId = Guid.Parse("33333333-3333-3333-3333-333333333333"), Capacity = 4, Label = "M2" },
                new() { Id = Guid.NewGuid(), RestaurantId = Guid.Parse("33333333-3333-3333-3333-333333333333"), Capacity = 6, Label = "M3" },
            ]
        };

        store.Restaurants.TryAdd(italian.Id, italian);
        store.Restaurants.TryAdd(japanese.Id, japanese);
        store.Restaurants.TryAdd(mexican.Id, mexican);
    }
}
