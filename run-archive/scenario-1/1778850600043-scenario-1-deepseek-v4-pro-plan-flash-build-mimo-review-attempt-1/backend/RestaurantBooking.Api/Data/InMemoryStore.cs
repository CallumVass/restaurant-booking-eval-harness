using System.Collections.Concurrent;
using RestaurantBooking.Api.Models;

namespace RestaurantBooking.Api.Data;

public class InMemoryStore
{
    public ConcurrentDictionary<Guid, Restaurant> Restaurants { get; } = new();
    public ConcurrentBag<Booking> Bookings { get; } = [];
}
