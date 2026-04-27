namespace RestaurantBooking.Domain;

public interface IRestaurantRepository
{
    IReadOnlyList<Restaurant> GetAll();
    Restaurant? GetById(string id);
}

public interface ITableRepository
{
    IReadOnlyList<Table> GetByRestaurant(string restaurantId);
}

public interface IBookingRepository
{
    IReadOnlyList<Booking> GetByRestaurantAndDate(string restaurantId, DateOnly date);
    Booking? GetById(string id);
    void Add(Booking booking);
}

public class InMemoryRestaurantRepository : IRestaurantRepository
{
    private readonly List<Restaurant> _restaurants =
    [
        new("r1", "The Golden Fork", "123 Main Street, Downtown", "Italian",
            new TimeOnly(11, 0), new TimeOnly(22, 0)),
        new("r2", "Sakura Garden", "456 Oak Avenue, Midtown", "Japanese",
            new TimeOnly(12, 0), new TimeOnly(23, 0)),
        new("r3", "Le Petit Bistro", "789 Elm Boulevard, Uptown", "French",
            new TimeOnly(17, 0), new TimeOnly(23, 30))
    ];

    public IReadOnlyList<Restaurant> GetAll() => _restaurants;

    public Restaurant? GetById(string id) => _restaurants.FirstOrDefault(r => r.Id == id);
}

public class InMemoryTableRepository : ITableRepository
{
    private readonly List<Table> _tables =
    [
        new("t1", "r1", 2, "Patio"),
        new("t2", "r1", 4, "Main"),
        new("t3", "r1", 6, "Main"),
        new("t4", "r1", 8, "Private Room"),
        new("t5", "r2", 2, "Bar"),
        new("t6", "r2", 4, "Main"),
        new("t7", "r2", 6, "Private Room"),
        new("t8", "r3", 2, "Main"),
        new("t9", "r3", 4, "Main"),
        new("t10", "r3", 6, "Garden"),
        new("t11", "r3", 8, "Private Room")
    ];

    public IReadOnlyList<Table> GetByRestaurant(string restaurantId) =>
        _tables.Where(t => t.RestaurantId == restaurantId).ToList();
}

public class InMemoryBookingRepository : IBookingRepository
{
    private readonly List<Booking> _bookings = [];

    public IReadOnlyList<Booking> GetByRestaurantAndDate(string restaurantId, DateOnly date) =>
        _bookings.Where(b => b.RestaurantId == restaurantId && b.Date == date).ToList();

    public Booking? GetById(string id) => _bookings.FirstOrDefault(b => b.Id == id);

    public void Add(Booking booking) => _bookings.Add(booking);
}
