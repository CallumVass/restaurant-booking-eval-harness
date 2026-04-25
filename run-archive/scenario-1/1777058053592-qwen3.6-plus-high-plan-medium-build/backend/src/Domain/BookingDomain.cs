// pattern: Functional Core

using RestaurantBooking.Domain;

namespace RestaurantBooking.Domain;

public static class BookingDomain
{
    private static readonly TimeSpan SlotDuration = TimeSpan.FromMinutes(30);
    private static readonly TimeOnly OperatingHoursStart = TimeOnly.FromTimeSpan(TimeSpan.FromHours(10));
    private static readonly TimeOnly OperatingHoursEnd = TimeOnly.FromTimeSpan(TimeSpan.FromHours(22));

    public static Result<Booking> CreateBooking(
        Restaurant restaurant,
        IReadOnlyList<Booking> existingBookings,
        BookingRequest request,
        DateTime now)
    {
        var partySizeError = ValidatePartySize(request.PartySize, restaurant.Tables);
        if (partySizeError is not null)
            return Result<Booking>.Fail(partySizeError);

        var dateTimeError = ValidateDateTime(request.StartTime, now);
        if (dateTimeError is not null)
            return Result<Booking>.Fail(dateTimeError);

        var table = FindSmallestFitTable(restaurant.Tables, request.PartySize);
        if (table is null)
            return Result<Booking>.Fail(BookingError.NoTableAvailable(request.PartySize));

        var endTime = request.StartTime.Add(SlotDuration);
        var conflictError = DetectConflict(table.Id, request.StartTime, endTime, existingBookings);
        if (conflictError is not null)
            return Result<Booking>.Fail(conflictError);

        var booking = new Booking(
            Guid.NewGuid(),
            restaurant.Id,
            table.Id,
            request.GuestName,
            request.Email,
            request.PartySize,
            request.StartTime,
            endTime);

        return Result<Booking>.Ok(booking);
    }

    public static BookingError? ValidatePartySize(int partySize, IReadOnlyList<Table> tables)
    {
        if (partySize < 1)
            return BookingError.InvalidPartySize("Party size must be at least 1");

        var maxCapacity = tables.Max(t => t.Capacity);
        if (partySize > maxCapacity)
            return BookingError.InvalidPartySize($"Party size {partySize} exceeds maximum capacity {maxCapacity}");

        return null;
    }

    public static BookingError? ValidateDateTime(DateTime startTime, DateTime now)
    {
        if (startTime < now.AddMinutes(-1))
            return BookingError.InvalidDateTime("Booking time is in the past");

        var time = TimeOnly.FromDateTime(startTime);
        if (time < OperatingHoursStart || time >= OperatingHoursEnd)
            return BookingError.InvalidDateTime($"Booking must be within operating hours {OperatingHoursStart:HH:mm}-{OperatingHoursEnd:HH:mm}");

        if (startTime.Minute % 30 != 0 || startTime.Second != 0)
            return BookingError.InvalidDateTime("Booking must start on a 30-minute boundary");

        return null;
    }

    public static BookingError? DetectConflict(
        Guid tableId,
        DateTime startTime,
        DateTime endTime,
        IReadOnlyList<Booking> existingBookings)
    {
        var conflict = existingBookings.FirstOrDefault(b =>
            b.TableId == tableId &&
            startTime < b.EndTime &&
            endTime > b.StartTime);

        if (conflict is not null)
            return BookingError.TimeSlotConflict(conflict);

        return null;
    }

    public static Table? FindSmallestFitTable(IReadOnlyList<Table> tables, int partySize) =>
        tables.Where(t => t.Capacity >= partySize).OrderBy(t => t.Capacity).FirstOrDefault();

    public static Result<IReadOnlyList<TimeSlot>> GetAvailableSlots(
        Restaurant restaurant,
        IReadOnlyList<Booking> existingBookings,
        DateTime date,
        int partySize)
    {
        var partySizeError = ValidatePartySize(partySize, restaurant.Tables);
        if (partySizeError is not null)
            return Result<IReadOnlyList<TimeSlot>>.Fail(partySizeError);

        var dateTimeError = ValidateDateTime(date, DateTime.UtcNow);
        if (dateTimeError is not null)
            return Result<IReadOnlyList<TimeSlot>>.Fail(dateTimeError);

        var slots = new List<TimeSlot>();
        var current = date.Date.Add(OperatingHoursStart.ToTimeSpan());
        var end = date.Date.Add(OperatingHoursEnd.ToTimeSpan());

        while (current < end)
        {
            var slotEnd = current.Add(SlotDuration);
            var isAvailable = IsSlotAvailable(restaurant.Tables, partySize, current, slotEnd, existingBookings);
            slots.Add(new TimeSlot(current, slotEnd, isAvailable));
            current = slotEnd;
        }

        return Result<IReadOnlyList<TimeSlot>>.Ok(slots);
    }

    private static bool IsSlotAvailable(
        IReadOnlyList<Table> tables,
        int partySize,
        DateTime slotStart,
        DateTime slotEnd,
        IReadOnlyList<Booking> existingBookings)
    {
        var table = FindSmallestFitTable(tables, partySize);
        if (table is null)
            return false;

        return !existingBookings.Any(b =>
            b.TableId == table.Id &&
            slotStart < b.EndTime &&
            slotEnd > b.StartTime);
    }
}
