// pattern: Imperative Shell
namespace RestaurantBooking.Api.Bookings;

public sealed class BookingStore
{
    private static readonly Guid BistroId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly Guid GardenId = Guid.Parse("22222222-2222-2222-2222-222222222222");
    private readonly Lock gate = new();
    private readonly List<Booking> bookings = [];
    private readonly List<Restaurant> restaurants =
    [
        new Restaurant(
            BistroId,
            "Harbor Bistro",
            "Seasonal seafood and neighborhood favorites.",
            [
                new RestaurantTable(Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"), "Window two-top", 2),
                new RestaurantTable(Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2"), "Banquette four", 4),
                new RestaurantTable(Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3"), "Family six", 6)
            ]),
        new Restaurant(
            GardenId,
            "Garden Grill",
            "Wood-fired plates with a courtyard patio.",
            [
                new RestaurantTable(Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1"), "Patio four", 4),
                new RestaurantTable(Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2"), "Chef table eight", 8)
            ])
    ];

    public IReadOnlyList<RestaurantSummary> ListRestaurants()
    {
        lock (gate)
        {
            return restaurants
                .Select(restaurant => new RestaurantSummary(
                    restaurant.Id,
                    restaurant.Name,
                    restaurant.Description,
                    restaurant.Tables.Min(table => table.Capacity),
                    restaurant.Tables.Max(table => table.Capacity)))
                .ToArray();
        }
    }

    public IReadOnlyList<BookingConfirmation> ListBookings()
    {
        lock (gate)
        {
            return bookings.Select(ToConfirmation).OrderBy(booking => booking.StartsAt).ToArray();
        }
    }

    public Result<BookingConfirmation> CreateBooking(BookingRequest request, DateOnly today)
    {
        lock (gate)
        {
            var restaurant = restaurants.FirstOrDefault(item => item.Id == request.RestaurantId);
            var result = BookingRules.PlanBooking(restaurant, bookings, request, Guid.NewGuid(), today);
            if (!result.IsSuccess)
            {
                return result;
            }

            var confirmation = result.Value!;
            bookings.Add(new Booking(
                confirmation.Id,
                confirmation.RestaurantId,
                confirmation.TableId,
                confirmation.GuestName,
                confirmation.PartySize,
                confirmation.StartsAt,
                confirmation.EndsAt));

            return result;
        }
    }

    public Result<IReadOnlyList<AvailabilitySlot>> GetAvailability(Guid restaurantId, DateOnly date, int partySize, DateOnly today)
    {
        lock (gate)
        {
            var restaurant = restaurants.FirstOrDefault(item => item.Id == restaurantId);
            return BookingRules.AvailableSlots(restaurant, bookings, date, partySize, today);
        }
    }

    private static BookingConfirmation ToConfirmation(Booking booking) => new(
        booking.Id,
        booking.RestaurantId,
        booking.TableId,
        booking.GuestName,
        booking.PartySize,
        booking.StartsAt,
        booking.EndsAt);
}
