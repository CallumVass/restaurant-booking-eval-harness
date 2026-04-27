// pattern: Functional Core

namespace RestaurantBooking.Api.Domain;

public static class BookingRules
{
    public static readonly TimeOnly OpensAt = new(17, 0);
    public static readonly TimeOnly LastSeatingAt = new(20, 30);
    public static readonly TimeSpan SlotStep = TimeSpan.FromMinutes(30);
    public static readonly TimeSpan BookingDuration = TimeSpan.FromMinutes(90);
    public const int MinimumPartySize = 1;
    public const int MaximumPartySize = 8;

    public static BookingResult<Booking> CreateBooking(
        IReadOnlyList<Restaurant> restaurants,
        IReadOnlyList<Booking> existingBookings,
        CreateBookingRequest request,
        string bookingId,
        DateOnly today)
    {
        var restaurant = restaurants.FirstOrDefault(item => item.Id == request.RestaurantId);
        if (restaurant is null)
        {
            return BookingResult<Booking>.Failure(BookingErrorCode.UnknownRestaurant, "Restaurant was not found.");
        }

        var validation = ValidateRequest(request.PartySize, request.Date, request.StartTime, today);
        if (!validation.IsSuccess)
        {
            return BookingResult<Booking>.Failure(validation.Error.Code, validation.Error.Message);
        }

        var endTime = request.StartTime.Add(BookingDuration);
        var bookingsForRestaurant = existingBookings
            .Where(booking => booking.RestaurantId == restaurant.Id && booking.Date == request.Date)
            .ToArray();

        var table = FindAvailableTable(restaurant, bookingsForRestaurant, request.PartySize, request.StartTime, endTime);
        if (table is null)
        {
            var hasTableThatFits = restaurant.Tables.Any(item => item.Capacity >= request.PartySize);
            return hasTableThatFits
                ? BookingResult<Booking>.Failure(BookingErrorCode.OverlappingReservation, "No matching table is available at that time.")
                : BookingResult<Booking>.Failure(BookingErrorCode.NoCapacity, "No table can fit that party size.");
        }

        var booking = new Booking(
            bookingId,
            restaurant.Id,
            table.Id,
            request.GuestName.Trim(),
            request.GuestEmail.Trim(),
            request.PartySize,
            request.Date,
            request.StartTime,
            endTime);

        return BookingResult<Booking>.Success(booking);
    }

    public static BookingResult<IReadOnlyList<AvailableSlotDto>> ListAvailableSlots(
        IReadOnlyList<Restaurant> restaurants,
        IReadOnlyList<Booking> existingBookings,
        string restaurantId,
        DateOnly date,
        int partySize,
        DateOnly today)
    {
        var restaurant = restaurants.FirstOrDefault(item => item.Id == restaurantId);
        if (restaurant is null)
        {
            return BookingResult<IReadOnlyList<AvailableSlotDto>>.Failure(BookingErrorCode.UnknownRestaurant, "Restaurant was not found.");
        }

        var validation = ValidateRequest(partySize, date, OpensAt, today, validateStartTime: false);
        if (!validation.IsSuccess)
        {
            return BookingResult<IReadOnlyList<AvailableSlotDto>>.Failure(validation.Error.Code, validation.Error.Message);
        }

        if (!restaurant.Tables.Any(table => table.Capacity >= partySize))
        {
            return BookingResult<IReadOnlyList<AvailableSlotDto>>.Failure(BookingErrorCode.NoCapacity, "No table can fit that party size.");
        }

        var bookingsForRestaurant = existingBookings
            .Where(booking => booking.RestaurantId == restaurant.Id && booking.Date == date)
            .ToArray();

        var slots = EnumerateStartTimes()
            .Select(start =>
            {
                var end = start.Add(BookingDuration);
                var table = FindAvailableTable(restaurant, bookingsForRestaurant, partySize, start, end);
                return table is null ? null : new AvailableSlotDto(date, start, end, table.Capacity);
            })
            .OfType<AvailableSlotDto>()
            .ToArray();

        return BookingResult<IReadOnlyList<AvailableSlotDto>>.Success(slots);
    }

    public static bool Overlaps(TimeOnly start, TimeOnly end, TimeOnly existingStart, TimeOnly existingEnd) =>
        start < existingEnd && existingStart < end;

    private static BookingResult<bool> ValidateRequest(int partySize, DateOnly date, TimeOnly startTime, DateOnly today, bool validateStartTime = true)
    {
        if (partySize is < MinimumPartySize or > MaximumPartySize)
        {
            return BookingResult<bool>.Failure(BookingErrorCode.InvalidPartySize, $"Party size must be between {MinimumPartySize} and {MaximumPartySize}.");
        }

        if (date < today)
        {
            return BookingResult<bool>.Failure(BookingErrorCode.InvalidDate, "Booking date cannot be in the past.");
        }

        if (validateStartTime && (startTime < OpensAt || startTime > LastSeatingAt || startTime.Minute % 30 != 0))
        {
            return BookingResult<bool>.Failure(BookingErrorCode.InvalidTime, "Bookings must start on a half-hour slot between 17:00 and 20:30.");
        }

        return BookingResult<bool>.Success(true);
    }

    private static Table? FindAvailableTable(Restaurant restaurant, IReadOnlyList<Booking> existingBookings, int partySize, TimeOnly start, TimeOnly end) =>
        restaurant.Tables
            .Where(table => table.Capacity >= partySize)
            .OrderBy(table => table.Capacity)
            .FirstOrDefault(table => existingBookings.All(booking => booking.TableId != table.Id || !Overlaps(start, end, booking.StartTime, booking.EndTime)));

    private static IEnumerable<TimeOnly> EnumerateStartTimes()
    {
        for (var time = OpensAt; time <= LastSeatingAt; time = time.Add(SlotStep))
        {
            yield return time;
        }
    }
}
