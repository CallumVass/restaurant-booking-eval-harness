using System.Collections.Concurrent;
using Domain.Models;
using Domain.Store;

namespace Api.Infrastructure;

public class InMemoryBookingStore : IBookingStore
{
    private readonly ConcurrentDictionary<string, Restaurant> _restaurants = new();
    private readonly ConcurrentBag<Booking> _bookings = new();

    public void Seed(IEnumerable<Restaurant> restaurants)
    {
        foreach (var r in restaurants)
            _restaurants.TryAdd(r.Id, r);
    }

    public IReadOnlyList<Restaurant> GetRestaurants() => _restaurants.Values.ToList();

    public Restaurant? GetRestaurant(string id) =>
        _restaurants.TryGetValue(id, out var r) ? r : null;

    public IReadOnlyList<Booking> GetBookings() => _bookings.ToList();

    public IReadOnlyList<Booking> GetBookingsByRestaurant(string restaurantId) =>
        _bookings.Where(b => b.RestaurantId == restaurantId).ToList();

    public void AddBooking(Booking booking) => _bookings.Add(booking);
}
