namespace RestaurantBooking.Domain;

public static class SlotCalculator
{
    public static List<TimeSpan> GenerateTimeSlots(TimeSpan openingTime, TimeSpan closingTime, TimeSpan interval)
    {
        var slots = new List<TimeSpan>();
        var current = openingTime;

        while (current + interval <= closingTime)
        {
            slots.Add(current);
            current = current.Add(interval);
        }

        return slots;
    }

    public static bool HasOverlap(Booking a, Booking b)
    {
        if (a.TableId != b.TableId)
            return false;

        if (a.DateTime.Date != b.DateTime.Date)
            return false;

        var aStart = a.DateTime;
        var aEnd = aStart.Add(a.Duration);
        var bStart = b.DateTime;
        var bEnd = bStart.Add(b.Duration);

        return aStart < bEnd && bStart < aEnd;
    }

    public static List<AvailableSlot> FindAvailableSlots(
        Restaurant restaurant,
        List<Table> tables,
        List<Booking> bookings,
        DateOnly date,
        int partySize)
    {
        var slots = GenerateTimeSlots(restaurant.OpeningTime, restaurant.ClosingTime, TimeSpan.FromMinutes(30));
        var available = new List<AvailableSlot>();

        var suitableTables = tables
            .Where(t => t.RestaurantId == restaurant.Id && t.Capacity >= partySize)
            .ToList();

        if (suitableTables.Count == 0)
            return available;

        var bookingsOnDate = bookings
            .Where(b => b.RestaurantId == restaurant.Id && DateOnly.FromDateTime(b.DateTime.Date) == date)
            .ToList();

        foreach (var slot in slots)
        {
            foreach (var table in suitableTables)
            {
                var slotBooking = new Booking(
                    Guid.Empty,
                    restaurant.Id,
                    table.Id,
                    date.ToDateTime(TimeOnly.FromTimeSpan(slot), DateTimeKind.Local),
                    TimeSpan.FromMinutes(90),
                    partySize,
                    string.Empty,
                    string.Empty);

                var isBooked = bookingsOnDate.Any(b => HasOverlap(b, slotBooking));

                if (!isBooked)
                {
                    available.Add(new AvailableSlot(slot, table.Id));
                }
            }
        }

        return available;
    }

    public static Result<Booking, BookingError> ValidateBooking(
        CreateBookingRequest request,
        Restaurant? restaurant,
        List<Table> tables,
        List<Booking> bookings)
    {
        if (request.PartySize <= 0)
            return Result<Booking, BookingError>.Failure(BookingError.InvalidPartySize);

        if (restaurant is null)
            return Result<Booking, BookingError>.Failure(BookingError.RestaurantNotFound);

        if (request.DateTime <= DateTimeOffset.UtcNow)
            return Result<Booking, BookingError>.Failure(BookingError.InvalidDateTime);

        var suitableTables = tables
            .Where(t => t.RestaurantId == restaurant.Id && t.Capacity >= request.PartySize)
            .ToList();

        if (suitableTables.Count == 0)
            return Result<Booking, BookingError>.Failure(BookingError.InvalidPartySize);

        foreach (var table in suitableTables)
        {
            var candidateBooking = new Booking(
                Guid.NewGuid(),
                restaurant.Id,
                table.Id,
                request.DateTime,
                TimeSpan.FromMinutes(90),
                request.PartySize,
                request.CustomerName,
                request.CustomerEmail);

            var hasConflict = bookings.Any(b => HasOverlap(b, candidateBooking));

            if (!hasConflict)
            {
                return Result<Booking, BookingError>.Success(candidateBooking);
            }
        }

        return Result<Booking, BookingError>.Failure(BookingError.OverlapConflict);
    }
}
