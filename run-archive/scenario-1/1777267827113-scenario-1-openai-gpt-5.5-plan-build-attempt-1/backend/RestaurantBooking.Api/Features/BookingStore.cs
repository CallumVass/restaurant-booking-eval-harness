// pattern: Imperative Shell

using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Api.Features;

public sealed class BookingStore
{
    private readonly Lock gate = new();
    private readonly List<Booking> bookings = [];

    public IReadOnlyList<RestaurantDto> Restaurants => SeedData.Restaurants.Select(ToDto).ToArray();

    public IReadOnlyList<BookingDto> Bookings
    {
        get
        {
            lock (gate)
            {
                return bookings.Select(ToDto).OrderBy(booking => booking.Date).ThenBy(booking => booking.StartTime).ToArray();
            }
        }
    }

    public BookingResult<IReadOnlyList<AvailableSlotDto>> GetAvailableSlots(string restaurantId, DateOnly date, int partySize)
    {
        lock (gate)
        {
            return BookingRules.ListAvailableSlots(SeedData.Restaurants, bookings, restaurantId, date, partySize, DateOnly.FromDateTime(DateTime.UtcNow));
        }
    }

    public BookingResult<BookingDto> CreateBooking(CreateBookingRequest request)
    {
        lock (gate)
        {
            var result = BookingRules.CreateBooking(SeedData.Restaurants, bookings, request, Guid.NewGuid().ToString("n"), DateOnly.FromDateTime(DateTime.UtcNow));
            if (!result.IsSuccess || result.Value is null)
            {
                return BookingResult<BookingDto>.Failure(result.Error.Code, result.Error.Message);
            }

            bookings.Add(result.Value);
            return BookingResult<BookingDto>.Success(ToDto(result.Value));
        }
    }

    private static RestaurantDto ToDto(Restaurant restaurant) => new(
        restaurant.Id,
        restaurant.Name,
        restaurant.Cuisine,
        restaurant.Neighborhood,
        restaurant.Description,
        restaurant.Tables.Max(table => table.Capacity),
        restaurant.Tables.Count);

    private static BookingDto ToDto(Booking booking)
    {
        var restaurant = SeedData.Restaurants.Single(item => item.Id == booking.RestaurantId);
        return new BookingDto(
            booking.Id,
            booking.RestaurantId,
            restaurant.Name,
            booking.TableId,
            booking.GuestName,
            booking.GuestEmail,
            booking.PartySize,
            booking.Date,
            booking.StartTime,
            booking.EndTime);
    }
}
