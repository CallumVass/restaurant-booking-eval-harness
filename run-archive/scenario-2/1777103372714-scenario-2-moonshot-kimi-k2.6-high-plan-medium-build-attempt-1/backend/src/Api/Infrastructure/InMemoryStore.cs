// pattern: Imperative Shell

using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Api.Infrastructure;

public interface IRestaurantStore
{
    IReadOnlyList<Restaurant> GetAll();
    Restaurant? GetById(Guid id);
}

public interface IBookingStore
{
    IReadOnlyList<Booking> GetAll();
    Booking? GetById(Guid id);
    IReadOnlyList<Booking> GetByRestaurant(Guid restaurantId);
    void Add(Booking booking);
}

public class InMemoryRestaurantStore : IRestaurantStore
{
    private readonly Dictionary<Guid, Restaurant> _restaurants;

    public InMemoryRestaurantStore()
    {
        var r1t1 = new Table(Guid.NewGuid(), "Table 1", 2);
        var r1t2 = new Table(Guid.NewGuid(), "Table 2", 4);
        var r1t3 = new Table(Guid.NewGuid(), "Table 3", 6);
        var r1 = new Restaurant(Guid.NewGuid(), "The Golden Spoon",
            "Fine dining with a modern twist.", [r1t1, r1t2, r1t3]);

        var r2t1 = new Table(Guid.NewGuid(), "Table A", 2);
        var r2t2 = new Table(Guid.NewGuid(), "Table B", 4);
        var r2 = new Restaurant(Guid.NewGuid(), "Burger Barn",
            "Casual burgers and shakes.", [r2t1, r2t2]);

        var r3t1 = new Table(Guid.NewGuid(), "Patio 1", 8);
        var r3 = new Restaurant(Guid.NewGuid(), "Ocean View",
            "Seafood with a stunning view.", [r3t1]);

        _restaurants = new Dictionary<Guid, Restaurant>
        {
            [r1.Id] = r1,
            [r2.Id] = r2,
            [r3.Id] = r3
        };
    }

    public IReadOnlyList<Restaurant> GetAll() => _restaurants.Values.ToList();
    public Restaurant? GetById(Guid id) => _restaurants.TryGetValue(id, out var r) ? r : null;
}

public class InMemoryBookingStore : IBookingStore
{
    private readonly List<Booking> _bookings = new();
    private readonly Lock _lock = new();

    public IReadOnlyList<Booking> GetAll()
    {
        lock (_lock) { return _bookings.ToList(); }
    }

    public Booking? GetById(Guid id)
    {
        lock (_lock) { return _bookings.FirstOrDefault(b => b.Id == id); }
    }

    public IReadOnlyList<Booking> GetByRestaurant(Guid restaurantId)
    {
        lock (_lock)
        {
            return _bookings.Where(b => b.RestaurantId == restaurantId).ToList();
        }
    }

    public void Add(Booking booking)
    {
        lock (_lock) { _bookings.Add(booking); }
    }
}
