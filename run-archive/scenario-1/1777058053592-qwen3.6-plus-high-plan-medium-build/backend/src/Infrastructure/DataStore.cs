// pattern: Imperative Shell

using System.Collections.Concurrent;
using RestaurantBooking.Domain;

namespace RestaurantBooking.Infrastructure;

public class DataStore
{
    private readonly ConcurrentDictionary<Guid, Restaurant> _restaurants = new();
    private readonly ConcurrentDictionary<Guid, Booking> _bookings = new();

    public DataStore()
    {
        SeedData();
    }

    public IReadOnlyList<Restaurant> GetAllRestaurants() => _restaurants.Values.ToList();

    public Restaurant? GetRestaurant(Guid id) =>
        _restaurants.TryGetValue(id, out var restaurant) ? restaurant : null;

    public IReadOnlyList<Booking> GetBookingsByRestaurant(Guid restaurantId) =>
        _bookings.Values.Where(b => b.RestaurantId == restaurantId).ToList();

    public IReadOnlyList<Booking> GetAllBookings() => _bookings.Values.ToList();

    public void AddBooking(Booking booking) => _bookings[booking.Id] = booking;

    private void SeedData()
    {
        var rest1Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
        var rest2Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
        var rest3Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");

        _restaurants[rest1Id] = new Restaurant(
            rest1Id,
            "The Golden Fork",
            "123 Main Street",
            new List<Table>
            {
                new(Guid.NewGuid(), rest1Id, 2),
                new(Guid.NewGuid(), rest1Id, 4),
                new(Guid.NewGuid(), rest1Id, 6),
            });

        _restaurants[rest2Id] = new Restaurant(
            rest2Id,
            "Bella Italia",
            "456 Oak Avenue",
            new List<Table>
            {
                new(Guid.NewGuid(), rest2Id, 2),
                new(Guid.NewGuid(), rest2Id, 4),
            });

        _restaurants[rest3Id] = new Restaurant(
            rest3Id,
            "Sakura Sushi",
            "789 Pine Road",
            new List<Table>
            {
                new(Guid.NewGuid(), rest3Id, 3),
                new(Guid.NewGuid(), rest3Id, 5),
                new(Guid.NewGuid(), rest3Id, 8),
            });
    }
}
