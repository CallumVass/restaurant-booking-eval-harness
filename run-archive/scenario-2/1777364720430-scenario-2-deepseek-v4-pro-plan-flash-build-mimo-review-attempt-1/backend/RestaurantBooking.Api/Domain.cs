// pattern: Functional Core

namespace RestaurantBooking.Api;

public sealed record Restaurant(string Id, string Name, string Cuisine, string Neighborhood, string Description, IReadOnlyList<Table> Tables);

public sealed record Table(string Id, int Capacity);

public sealed record Booking(
    string Id,
    string RestaurantId,
    string RestaurantName,
    string TableId,
    int PartySize,
    DateOnly Date,
    TimeOnly Time,
    string GuestName,
    string GuestEmail,
    string? UserId = null);

public sealed record CreateBookingRequest(
    string RestaurantId,
    DateOnly Date,
    TimeOnly Time,
    int PartySize,
    string GuestName,
    string GuestEmail,
    string? UserId = null);

public sealed record AvailabilityQuery(string RestaurantId, DateOnly Date, int PartySize);

public sealed record AvailabilitySlot(TimeOnly Time, int AvailableTableCount);

public sealed record ErrorResponse(string Code, string Message);

public enum BookingError
{
    UnknownRestaurant,
    InvalidPartySize,
    InvalidDate,
    InvalidTime,
    NoTableForPartySize,
    OverlappingReservation,
}

public sealed record BookingResult<T>(T? Value, BookingError? Error, string? Message)
{
    public bool IsSuccess => Error is null;

    public static BookingResult<T> Success(T value) => new(value, null, null);

    public static BookingResult<T> Failure(BookingError error, string message) => new(default, error, message);
}

public static class BookingRules
{
    public const int MinPartySize = 1;
    public const int MaxPartySize = 8;
    public static readonly TimeSpan BookingDuration = TimeSpan.FromHours(2);
    private static readonly TimeOnly OpeningTime = new(17, 0);
    private static readonly TimeOnly LastSeatingTime = new(21, 0);

    public static BookingResult<IReadOnlyList<AvailabilitySlot>> AvailableSlots(
        Restaurant? restaurant,
        DateOnly date,
        int partySize,
        DateOnly today,
        IReadOnlyList<Booking> existingBookings)
    {
        var validation = ValidateCommon(restaurant, date, partySize, today);
        if (!validation.IsSuccess)
        {
            return BookingResult<IReadOnlyList<AvailabilitySlot>>.Failure(validation.Error!.Value, validation.Message!);
        }

        var suitableTables = restaurant!.Tables.Where(table => table.Capacity >= partySize).ToArray();
        if (suitableTables.Length == 0)
        {
            return BookingResult<IReadOnlyList<AvailabilitySlot>>.Failure(
                BookingError.NoTableForPartySize,
                $"No table can seat a party of {partySize}.");
        }

        var slots = SeatingTimes()
            .Select(time => new AvailabilitySlot(
                time,
                suitableTables.Count(table => !Overlaps(existingBookings, restaurant.Id, table.Id, date, time))))
            .Where(slot => slot.AvailableTableCount > 0)
            .ToArray();

        return BookingResult<IReadOnlyList<AvailabilitySlot>>.Success(slots);
    }

    public static BookingResult<Booking> CreateBooking(
        Restaurant? restaurant,
        CreateBookingRequest request,
        DateOnly today,
        IReadOnlyList<Booking> existingBookings,
        string bookingId)
    {
        var validation = ValidateCommon(restaurant, request.Date, request.PartySize, today);
        if (!validation.IsSuccess)
        {
            return BookingResult<Booking>.Failure(validation.Error!.Value, validation.Message!);
        }

        if (!IsSeatingTime(request.Time))
        {
            return BookingResult<Booking>.Failure(BookingError.InvalidTime, "Bookings must start on an available hourly seating between 17:00 and 21:00.");
        }

        var table = restaurant!.Tables
            .Where(candidate => candidate.Capacity >= request.PartySize)
            .OrderBy(candidate => candidate.Capacity)
            .FirstOrDefault(candidate => !Overlaps(existingBookings, restaurant.Id, candidate.Id, request.Date, request.Time));

        if (table is null && restaurant.Tables.All(candidate => candidate.Capacity < request.PartySize))
        {
            return BookingResult<Booking>.Failure(
                BookingError.NoTableForPartySize,
                $"No table can seat a party of {request.PartySize}.");
        }

        if (table is null)
        {
            return BookingResult<Booking>.Failure(BookingError.OverlappingReservation, "No suitable table is available at that time.");
        }

        var booking = new Booking(
            bookingId,
            restaurant.Id,
            restaurant.Name,
            table.Id,
            request.PartySize,
            request.Date,
            request.Time,
            request.GuestName.Trim(),
            request.GuestEmail.Trim(),
            request.UserId);

        return BookingResult<Booking>.Success(booking);
    }

    private static BookingResult<object> ValidateCommon(Restaurant? restaurant, DateOnly date, int partySize, DateOnly today)
    {
        if (restaurant is null)
        {
            return BookingResult<object>.Failure(BookingError.UnknownRestaurant, "Restaurant was not found.");
        }

        if (partySize is < MinPartySize or > MaxPartySize)
        {
            return BookingResult<object>.Failure(BookingError.InvalidPartySize, "Party size must be between 1 and 8.");
        }

        if (date < today || date > today.AddDays(30))
        {
            return BookingResult<object>.Failure(BookingError.InvalidDate, "Bookings must be made from today up to 30 days ahead.");
        }

        return BookingResult<object>.Success(new object());
    }

    private static bool IsSeatingTime(TimeOnly time) => SeatingTimes().Contains(time);

    private static IEnumerable<TimeOnly> SeatingTimes()
    {
        for (var time = OpeningTime; time <= LastSeatingTime; time = time.AddHours(1))
        {
            yield return time;
        }
    }

    private static bool Overlaps(IReadOnlyList<Booking> bookings, string restaurantId, string tableId, DateOnly date, TimeOnly time)
    {
        var requestedStart = date.ToDateTime(time);
        var requestedEnd = requestedStart.Add(BookingDuration);

        return bookings.Any(booking =>
            booking.RestaurantId == restaurantId
            && booking.TableId == tableId
            && booking.Date == date
            && requestedStart < booking.Date.ToDateTime(booking.Time).Add(BookingDuration)
            && booking.Date.ToDateTime(booking.Time) < requestedEnd);
    }
}
