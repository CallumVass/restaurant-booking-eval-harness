// pattern: Functional Core
namespace RestaurantBooking.Api.Bookings;

public static class BookingRules
{
    public static readonly TimeSpan BookingDuration = TimeSpan.FromMinutes(90);
    public static readonly TimeOnly OpensAt = new(17, 0);
    public static readonly TimeOnly LastSlotAt = new(21, 0);
    public static readonly TimeSpan SlotStep = TimeSpan.FromMinutes(30);

    public static Result<BookingConfirmation> PlanBooking(
        Restaurant? restaurant,
        IReadOnlyCollection<Booking> existingBookings,
        BookingRequest request,
        Guid bookingId,
        DateOnly today)
    {
        var validation = ValidateRequest(restaurant, request.PartySize, request.StartsAt, today);
        if (!validation.IsSuccess)
        {
            return Result<BookingConfirmation>.Failure(validation.Error!.Code, validation.Error.Message);
        }

        var endsAt = request.StartsAt.Add(BookingDuration);
        var capableTables = restaurant!.Tables
            .Where(table => table.Capacity >= request.PartySize)
            .OrderBy(table => table.Capacity)
            .ThenBy(table => table.Name)
            .ToArray();

        var table = capableTables.FirstOrDefault(candidate => existingBookings
            .Where(booking => booking.RestaurantId == restaurant.Id && booking.TableId == candidate.Id)
            .All(booking => !Overlaps(request.StartsAt, endsAt, booking.StartsAt, booking.EndsAt)));

        if (table is null)
        {
            return Result<BookingConfirmation>.Failure(
                BookingErrorCode.OverlappingReservation,
                "No table is free for the requested time.");
        }

        return Result<BookingConfirmation>.Success(new BookingConfirmation(
            bookingId,
            restaurant.Id,
            table.Id,
            request.GuestName.Trim(),
            request.PartySize,
            request.StartsAt,
            endsAt));
    }

    public static Result<IReadOnlyList<AvailabilitySlot>> AvailableSlots(
        Restaurant? restaurant,
        IReadOnlyCollection<Booking> existingBookings,
        DateOnly date,
        int partySize,
        DateOnly today)
    {
        if (restaurant is null)
        {
            return Result<IReadOnlyList<AvailabilitySlot>>.Failure(BookingErrorCode.UnknownRestaurant, "Restaurant was not found.");
        }

        if (partySize <= 0 || partySize > restaurant.Tables.Max(table => table.Capacity))
        {
            return Result<IReadOnlyList<AvailabilitySlot>>.Failure(BookingErrorCode.InvalidPartySize, "Party size must fit an available table.");
        }

        if (date < today)
        {
            return Result<IReadOnlyList<AvailabilitySlot>>.Failure(BookingErrorCode.InvalidDateTime, "Date cannot be in the past.");
        }

        var slots = SlotStarts(date)
            .Select(startsAt => new
            {
                StartsAt = startsAt,
                EndsAt = startsAt.Add(BookingDuration),
                AvailableCount = CountAvailableTables(restaurant, existingBookings, partySize, startsAt, startsAt.Add(BookingDuration))
            })
            .Where(slot => slot.AvailableCount > 0)
            .Select(slot => new AvailabilitySlot(slot.StartsAt, slot.EndsAt, slot.AvailableCount))
            .ToArray();

        return Result<IReadOnlyList<AvailabilitySlot>>.Success(slots);
    }

    public static bool Overlaps(DateTimeOffset leftStart, DateTimeOffset leftEnd, DateTimeOffset rightStart, DateTimeOffset rightEnd) =>
        leftStart < rightEnd && rightStart < leftEnd;

    private static Result<bool> ValidateRequest(Restaurant? restaurant, int partySize, DateTimeOffset startsAt, DateOnly today)
    {
        if (restaurant is null)
        {
            return Result<bool>.Failure(BookingErrorCode.UnknownRestaurant, "Restaurant was not found.");
        }

        if (partySize <= 0 || partySize > restaurant.Tables.Max(table => table.Capacity))
        {
            return Result<bool>.Failure(BookingErrorCode.InvalidPartySize, "Party size must fit an available table.");
        }

        var requestedDate = DateOnly.FromDateTime(startsAt.DateTime);
        var requestedTime = TimeOnly.FromDateTime(startsAt.DateTime);
        if (requestedDate < today || requestedTime < OpensAt || requestedTime > LastSlotAt || startsAt.Second != 0 || startsAt.Millisecond != 0 || startsAt.Minute % 30 != 0)
        {
            return Result<bool>.Failure(BookingErrorCode.InvalidDateTime, "Bookings must start on a valid future 30-minute slot during opening hours.");
        }

        return Result<bool>.Success(true);
    }

    private static IEnumerable<DateTimeOffset> SlotStarts(DateOnly date)
    {
        for (var time = OpensAt; time <= LastSlotAt; time = time.Add(SlotStep))
        {
            yield return new DateTimeOffset(date, time, TimeSpan.Zero);
        }
    }

    private static int CountAvailableTables(
        Restaurant restaurant,
        IReadOnlyCollection<Booking> existingBookings,
        int partySize,
        DateTimeOffset startsAt,
        DateTimeOffset endsAt) => restaurant.Tables
            .Where(table => table.Capacity >= partySize)
            .Count(table => existingBookings
                .Where(booking => booking.RestaurantId == restaurant.Id && booking.TableId == table.Id)
                .All(booking => !Overlaps(startsAt, endsAt, booking.StartsAt, booking.EndsAt)));
}
