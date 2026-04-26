// pattern: Imperative Shell

namespace RestaurantBooking.Api;

public sealed class BookingStore
{
    private readonly object gate = new();
    private readonly List<Booking> bookings = [];
    private readonly List<Restaurant> restaurants =
    [
        new(
            "ember-table",
            "Ember Table",
            "Wood-fired seasonal",
            "Riverside",
            "Open-flame cooking, warm lighting, and produce-led tasting plates.",
            [new("ember-2a", 2), new("ember-2b", 2), new("ember-4", 4), new("ember-6", 6)]),
        new(
            "luna-verde",
            "Luna Verde",
            "Modern Italian",
            "Old Town",
            "Handmade pasta, coastal wines, and a relaxed plant-filled dining room.",
            [new("luna-2", 2), new("luna-4a", 4), new("luna-4b", 4), new("luna-8", 8)]),
        new(
            "saffron-court",
            "Saffron Court",
            "Contemporary Indian",
            "Market Quarter",
            "Regional curries, tandoor breads, and fragrant cocktails for groups.",
            [new("saffron-4", 4), new("saffron-6", 6), new("saffron-8", 8)]),
    ];

    public IReadOnlyList<Restaurant> Restaurants => restaurants;

    public IReadOnlyList<Booking> AllBookings
    {
        get
        {
            lock (gate)
            {
                return bookings.OrderBy(booking => booking.Date).ThenBy(booking => booking.Time).ToArray();
            }
        }
    }

    public IReadOnlyList<Booking> BookingsForUser(string userId)
    {
        lock (gate)
        {
            return bookings
                .Where(b => b.UserId == userId)
                .OrderBy(booking => booking.Date)
                .ThenBy(booking => booking.Time)
                .ToArray();
        }
    }

    public Restaurant? FindRestaurant(string id) => restaurants.FirstOrDefault(restaurant => restaurant.Id == id);

    public BookingResult<Booking> TryCreate(CreateBookingRequest request, DateOnly today, string? userId)
    {
        lock (gate)
        {
            var restaurant = FindRestaurant(request.RestaurantId);
            var result = BookingRules.CreateBooking(restaurant, request, today, bookings, Guid.NewGuid().ToString("N"), userId);
            if (result.IsSuccess)
            {
                bookings.Add(result.Value!);
            }

            return result;
        }
    }
}
