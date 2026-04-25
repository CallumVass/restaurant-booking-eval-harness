using RestaurantBooking.Domain;

namespace RestaurantBooking.Seeding;

public static class SeedData
{
    public static IReadOnlyList<Restaurant> Restaurants =>
    [
        new("r1", "The Italian Kitchen", "Authentic Italian cuisine"),
        new("r2", "Sakura Sushi", "Traditional Japanese sushi"),
        new("r3", "The Steak House", "Premium cuts and grills")
    ];

    public static IReadOnlyList<Table> Tables =>
    [
        new("t1", "r1", 2),
        new("t2", "r1", 4),
        new("t3", "r1", 6),
        new("t4", "r2", 2),
        new("t5", "r2", 4),
        new("t6", "r2", 8),
        new("t7", "r3", 4),
        new("t8", "r3", 6),
        new("t9", "r3", 10)
    ];
}