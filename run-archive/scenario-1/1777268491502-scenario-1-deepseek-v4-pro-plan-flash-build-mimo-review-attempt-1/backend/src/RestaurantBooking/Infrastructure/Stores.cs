// pattern: Imperative Shell

using System.Collections.Concurrent;
using RestaurantBooking.Domain;

namespace RestaurantBooking.Infrastructure;

public interface IRestaurantStore
{
    Restaurant? GetById(Guid id);
    List<Restaurant> GetAll();
}

public interface IBookingStore
{
    void Add(Booking booking);
    List<Booking> GetAll();
    List<Booking> GetByRestaurant(Guid restaurantId);
    List<Booking> GetByRestaurantAndDate(Guid restaurantId, DateOnly date);
}

public class InMemoryRestaurantStore : IRestaurantStore
{
    private readonly ConcurrentDictionary<Guid, Restaurant> _restaurants = new();

    public InMemoryRestaurantStore()
    {
        Seed();
    }

    public Restaurant? GetById(Guid id) => _restaurants.GetValueOrDefault(id);
    public List<Restaurant> GetAll() => _restaurants.Values.ToList();

    private void Seed()
    {
        var r1 = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var r2 = Guid.Parse("22222222-2222-2222-2222-222222222222");
        var r3 = Guid.Parse("33333333-3333-3333-3333-333333333333");

        _restaurants[r1] = new Restaurant(r1, "Trattoria Milano", "Authentic Italian cuisine in a cozy setting", "Italian",
        [
            new(Guid.NewGuid(), 2), new(Guid.NewGuid(), 2), new(Guid.NewGuid(), 4),
            new(Guid.NewGuid(), 4), new(Guid.NewGuid(), 6), new(Guid.NewGuid(), 8)
        ]);

        _restaurants[r2] = new Restaurant(r2, "Sakura Garden", "Elegant Japanese dining with seasonal ingredients", "Japanese",
        [
            new(Guid.NewGuid(), 2), new(Guid.NewGuid(), 4), new(Guid.NewGuid(), 4),
            new(Guid.NewGuid(), 6), new(Guid.NewGuid(), 8)
        ]);

        _restaurants[r3] = new Restaurant(r3, "Le Bistro Parisien", "Classic French bistro with a modern twist", "French",
        [
            new(Guid.NewGuid(), 2), new(Guid.NewGuid(), 4), new(Guid.NewGuid(), 6),
            new(Guid.NewGuid(), 8)
        ]);
    }
}

public class InMemoryBookingStore : IBookingStore
{
    private readonly ConcurrentDictionary<Guid, Booking> _bookings = new();

    public void Add(Booking booking) => _bookings[booking.Id] = booking;
    public List<Booking> GetAll() => _bookings.Values.ToList();
    public List<Booking> GetByRestaurant(Guid restaurantId) =>
        _bookings.Values.Where(b => b.RestaurantId == restaurantId).ToList();
    public List<Booking> GetByRestaurantAndDate(Guid restaurantId, DateOnly date) =>
        _bookings.Values.Where(b => b.RestaurantId == restaurantId && b.Date == date).ToList();
}
