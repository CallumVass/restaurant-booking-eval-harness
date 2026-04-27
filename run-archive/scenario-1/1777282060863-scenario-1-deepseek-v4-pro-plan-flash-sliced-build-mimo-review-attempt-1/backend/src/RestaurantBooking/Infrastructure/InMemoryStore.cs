using System.Collections.Concurrent;
using RestaurantBooking.Domain;

namespace RestaurantBooking.Infrastructure;

public sealed class InMemoryStore
{
    private readonly ConcurrentDictionary<Guid, Restaurant> _restaurants = new();
    private readonly ConcurrentDictionary<Guid, List<Table>> _tables = new();
    private readonly ConcurrentDictionary<Guid, Booking> _bookings = new();

    public void AddRestaurant(Restaurant restaurant, List<Table> tables)
    {
        _restaurants[restaurant.Id] = restaurant;
        _tables[restaurant.Id] = tables;
    }

    public List<Restaurant> GetAllRestaurants() => [.. _restaurants.Values];

    public Restaurant? GetRestaurant(Guid id) => _restaurants.GetValueOrDefault(id);

    public List<Table> GetTables(Guid restaurantId) =>
        _tables.GetValueOrDefault(restaurantId) ?? [];

    public List<Table> GetTables() => [.. _tables.Values.SelectMany(t => t)];

    public void AddBooking(Booking booking) => _bookings[booking.Id] = booking;

    public List<Booking> GetAllBookings() => [.. _bookings.Values];

    public void Clear()
    {
        _restaurants.Clear();
        _tables.Clear();
        _bookings.Clear();
    }
}
