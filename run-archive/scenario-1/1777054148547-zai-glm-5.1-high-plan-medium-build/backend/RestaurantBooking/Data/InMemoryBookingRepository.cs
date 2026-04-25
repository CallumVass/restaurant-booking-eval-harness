using System.Collections.Concurrent;
using RestaurantBooking.Domain;

namespace RestaurantBooking.Data;

public sealed class InMemoryBookingRepository : IBookingRepository
{
    private readonly ConcurrentBag<Booking> _bookings = [];

    public IReadOnlyList<Booking> GetByRestaurantId(string restaurantId) =>
        _bookings.Where(b => b.RestaurantId == restaurantId).ToList();

    public void Add(Booking booking) => _bookings.Add(booking);

    public IReadOnlyList<Booking> GetAll() => _bookings.ToList();
}