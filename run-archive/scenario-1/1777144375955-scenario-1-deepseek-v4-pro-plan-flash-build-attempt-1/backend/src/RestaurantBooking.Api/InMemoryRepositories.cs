using System.Collections.Concurrent;
using RestaurantBooking.Domain;

namespace RestaurantBooking.Api;

public sealed class InMemoryRestaurantRepository : IRestaurantRepository
{
    private readonly List<Restaurant> _restaurants;

    public InMemoryRestaurantRepository(List<Restaurant> restaurants)
    {
        _restaurants = restaurants;
    }

    public List<Restaurant> GetAll() => [.. _restaurants];
    public Restaurant? GetById(Guid id) => _restaurants.FirstOrDefault(r => r.Id == id);
}

public sealed class InMemoryBookingRepository : IBookingRepository
{
    private readonly ConcurrentDictionary<Guid, Booking> _bookings = new();

    public List<Booking> GetAll() => [.. _bookings.Values.OrderBy(b => b.CreatedAtUtc)];
    public Booking? GetById(Guid id) => _bookings.GetValueOrDefault(id);
    public List<Booking> GetByRestaurantAndDate(Guid restaurantId, DateOnly date)
        => _bookings.Values.Where(b => b.RestaurantId == restaurantId && b.Date == date).ToList();
    public void Add(Booking booking) => _bookings.TryAdd(booking.Id, booking);
}
