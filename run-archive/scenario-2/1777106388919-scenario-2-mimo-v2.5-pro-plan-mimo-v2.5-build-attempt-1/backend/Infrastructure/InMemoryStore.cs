using RestaurantBooking.Domain;

namespace RestaurantBooking.Infrastructure;

public sealed class InMemoryStore
{
    private readonly List<Restaurant> _restaurants = CreateSeedData();
    private readonly List<Booking> _bookings = [];

    public IReadOnlyList<Restaurant> GetRestaurants() => _restaurants;

    public Restaurant? GetRestaurant(string id) =>
        _restaurants.FirstOrDefault(r => r.Id == id);

    public IReadOnlyList<Booking> GetBookings(string? restaurantId = null) =>
        restaurantId is null
            ? _bookings.ToList()
            : _bookings.Where(b => b.RestaurantId == restaurantId).ToList();

    public void AddBooking(Booking booking) => _bookings.Add(booking);

    private static List<Restaurant> CreateSeedData() =>
    [
        new Restaurant
        {
            Id = "rest-1",
            Name = "The Golden Fork",
            Address = "123 Main Street, Downtown",
            Tables =
            [
                new Table { Id = "t1-1", RestaurantId = "rest-1", Seats = 2 },
                new Table { Id = "t1-2", RestaurantId = "rest-1", Seats = 4 },
                new Table { Id = "t1-3", RestaurantId = "rest-1", Seats = 6 },
                new Table { Id = "t1-4", RestaurantId = "rest-1", Seats = 8 },
            ]
        },
        new Restaurant
        {
            Id = "rest-2",
            Name = "La Bella Vista",
            Address = "456 Oak Avenue, Midtown",
            Tables =
            [
                new Table { Id = "t2-1", RestaurantId = "rest-2", Seats = 2 },
                new Table { Id = "t2-2", RestaurantId = "rest-2", Seats = 4 },
                new Table { Id = "t2-3", RestaurantId = "rest-2", Seats = 4 },
                new Table { Id = "t2-4", RestaurantId = "rest-2", Seats = 6 },
                new Table { Id = "t2-5", RestaurantId = "rest-2", Seats = 10 },
            ]
        },
        new Restaurant
        {
            Id = "rest-3",
            Name = "Sakura Garden",
            Address = "789 Elm Boulevard, Uptown",
            Tables =
            [
                new Table { Id = "t3-1", RestaurantId = "rest-3", Seats = 2 },
                new Table { Id = "t3-2", RestaurantId = "rest-3", Seats = 2 },
                new Table { Id = "t3-3", RestaurantId = "rest-3", Seats = 4 },
                new Table { Id = "t3-4", RestaurantId = "rest-3", Seats = 6 },
            ]
        }
    ];
}
