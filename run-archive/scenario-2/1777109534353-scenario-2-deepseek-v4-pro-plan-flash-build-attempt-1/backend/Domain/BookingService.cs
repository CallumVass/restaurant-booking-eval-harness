namespace Backend.Domain;

public static class BookingService
{
    public const int MinPartySize = 1;
    public const int MaxPartySize = 20;
    public const int SlotIntervalMinutes = 30;
    public const int BookingDurationMinutes = 90;
    public static readonly TimeOnly OpenTime = new(10, 0);
    public static readonly TimeOnly CloseTime = new(22, 0);

    public static Result<SlotResult> FindAvailableSlots(
        List<Table> tables,
        List<Booking> existingBookings,
        DateOnly date,
        int partySize)
    {
        if (partySize is < MinPartySize or > MaxPartySize)
            return Result<SlotResult>.Fail(new Error("INVALID_PARTY_SIZE",
                $"Party size must be between {MinPartySize} and {MaxPartySize}."));

        if (date < DateOnly.FromDateTime(DateTime.UtcNow))
            return Result<SlotResult>.Fail(new Error("INVALID_DATE",
                "Date cannot be in the past."));

        var dateBookings = existingBookings
            .Where(b => b.Date == date)
            .ToList();

        var capableTables = tables
            .Where(t => t.Capacity >= partySize)
            .ToList();

        if (capableTables.Count == 0)
            return Result<SlotResult>.Fail(new Error("NO_TABLES_AVAILABLE",
                $"No tables found that can accommodate {partySize} guests."));

        var slots = new List<Slot>();
        var current = OpenTime;

        while (current.AddMinutes(BookingDurationMinutes) <= CloseTime)
        {
            foreach (var table in capableTables)
            {
                var overlapping = dateBookings.Any(b =>
                    b.TableId == table.Id &&
                    b.StartTime < current.AddMinutes(BookingDurationMinutes) &&
                    b.StartTime.AddMinutes(BookingDurationMinutes) > current);

                var remaining = overlapping ? 0 : table.Capacity - partySize;

                slots.Add(new Slot(
                    current,
                    table.Id,
                    table.Capacity,
                    !overlapping,
                    remaining));
            }

            current = current.AddMinutes(SlotIntervalMinutes);
        }

        var available = slots.Any(s => s.IsAvailable);

        return Result<SlotResult>.Ok(new SlotResult(slots, available));
    }

    public static Result<Booking> TryBook(
        List<Table> tables,
        List<Booking> existingBookings,
        Guid restaurantId,
        Guid tableId,
        DateOnly date,
        TimeOnly startTime,
        int partySize,
        string guestName)
    {
        if (partySize is < MinPartySize or > MaxPartySize)
            return Result<Booking>.Fail(new Error("INVALID_PARTY_SIZE",
                $"Party size must be between {MinPartySize} and {MaxPartySize}."));

        if (date < DateOnly.FromDateTime(DateTime.UtcNow))
            return Result<Booking>.Fail(new Error("INVALID_DATE",
                "Date cannot be in the past."));

        if (startTime < OpenTime || startTime.AddMinutes(BookingDurationMinutes) > CloseTime)
            return Result<Booking>.Fail(new Error("INVALID_TIME",
                $"Booking time must be between {OpenTime} and {CloseTime.AddMinutes(-BookingDurationMinutes)}."));

        var table = tables.FirstOrDefault(t => t.Id == tableId && t.RestaurantId == restaurantId);
        if (table is null)
            return Result<Booking>.Fail(new Error("TABLE_NOT_FOUND",
                "Table not found in the specified restaurant."));

        if (table.Capacity < partySize)
            return Result<Booking>.Fail(new Error("TABLE_TOO_SMALL",
                $"Table capacity {table.Capacity} is less than party size {partySize}."));

        var overlapping = existingBookings.Any(b =>
            b.TableId == tableId &&
            b.Date == date &&
            b.StartTime < startTime.AddMinutes(BookingDurationMinutes) &&
            b.StartTime.AddMinutes(BookingDurationMinutes) > startTime);

        if (overlapping)
            return Result<Booking>.Fail(new Error("OVERLAPPING_BOOKING",
                "This table is already booked for the requested time slot."));

        var booking = new Booking(
            Guid.NewGuid(),
            restaurantId,
            tableId,
            date,
            startTime,
            partySize,
            guestName,
            DateTime.UtcNow);

        return Result<Booking>.Ok(booking);
    }

    public static List<TimeOnly> GenerateTimeSlots()
    {
        var slots = new List<TimeOnly>();
        var current = OpenTime;

        while (current.AddMinutes(BookingDurationMinutes) <= CloseTime)
        {
            slots.Add(current);
            current = current.AddMinutes(SlotIntervalMinutes);
        }

        return slots;
    }
}

public record SlotResult(List<Slot> Slots, bool HasAvailableSlots);
