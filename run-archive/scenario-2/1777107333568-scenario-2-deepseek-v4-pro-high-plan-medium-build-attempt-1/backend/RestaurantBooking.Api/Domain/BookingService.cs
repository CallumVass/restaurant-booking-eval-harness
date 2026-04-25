// pattern: Functional Core

namespace RestaurantBooking.Api.Domain;

public static class BookingService
{
    public static readonly TimeOnly OpeningTime = new(11, 0);
    public static readonly TimeOnly ClosingTime = new(22, 0);
    public static readonly int BookingDurationMinutes = 90;

    public static Result<Booking> TryBook(
        Restaurant restaurant,
        IReadOnlyCollection<Booking> existingBookings,
        BookingRequest request)
    {
        if (request.PartySize <= 0)
            return Result<Booking>.Failure("Party size must be greater than 0.");

        var maxCapacity = restaurant.Tables.Max(t => t.Capacity);
        if (request.PartySize > maxCapacity)
            return Result<Booking>.Failure($"Party size exceeds maximum table capacity of {maxCapacity}.");

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (request.Date < today)
            return Result<Booking>.Failure("Cannot book for a date in the past.");

        if (request.StartTime < OpeningTime || request.StartTime > ClosingTime)
            return Result<Booking>.Failure($"Booking time must be between {OpeningTime} and {ClosingTime}.");

        var endTime = request.StartTime.AddMinutes(BookingDurationMinutes);
        if (endTime > ClosingTime)
            return Result<Booking>.Failure($"Booking would end at {endTime}, which is past closing time ({ClosingTime}).");

        var table = FindAvailableTable(restaurant, existingBookings, request, endTime);
        if (table is null)
            return Result<Booking>.Failure("No table is available for the requested time and party size.");

        var booking = new Booking(
            Id: Guid.NewGuid().ToString("N")[..12],
            RestaurantId: request.RestaurantId,
            TableId: table.Id,
            CustomerName: request.CustomerName,
            CustomerEmail: request.CustomerEmail,
            PartySize: request.PartySize,
            Date: request.Date,
            StartTime: request.StartTime,
            EndTime: endTime,
            CreatedAt: DateTime.UtcNow);

        return Result<Booking>.Success(booking);
    }

    public static List<TimeSlot> GetAvailableTimeSlots(
        Restaurant restaurant,
        IReadOnlyCollection<Booking> existingBookings,
        DateOnly date,
        int partySize)
    {
        if (partySize <= 0)
            return [];

        var suitableTables = restaurant.Tables
            .Where(t => t.Capacity >= partySize)
            .ToList();

        if (suitableTables.Count == 0)
            return [];

        var slots = new List<(TimeOnly Start, TimeOnly End, int TableId)>();
        var current = OpeningTime;

        while (current.AddMinutes(BookingDurationMinutes) <= ClosingTime)
        {
            var slotEnd = current.AddMinutes(BookingDurationMinutes);

            foreach (var table in suitableTables)
            {
                var conflicts = existingBookings.Any(b =>
                    b.TableId == table.Id &&
                    b.Date == date &&
                    b.StartTime < slotEnd &&
                    current < b.EndTime);

                if (!conflicts)
                {
                    slots.Add((current, slotEnd, table.Id));
                }
            }

            current = current.AddMinutes(30);
        }

        return slots
            .GroupBy(s => (s.Start, s.End))
            .Select(g => new TimeSlot(
                g.Key.Start,
                g.Key.End,
                g.Select(x => x.TableId).Distinct().ToList()))
            .OrderBy(ts => ts.StartTime)
            .ToList();
    }

    private static Table? FindAvailableTable(
        Restaurant restaurant,
        IReadOnlyCollection<Booking> existingBookings,
        BookingRequest request,
        TimeOnly endTime)
    {
        var suitableTables = restaurant.Tables
            .Where(t => t.Capacity >= request.PartySize)
            .OrderBy(t => t.Capacity);

        foreach (var table in suitableTables)
        {
            var hasConflict = existingBookings.Any(b =>
                b.TableId == table.Id &&
                b.Date == request.Date &&
                b.StartTime < endTime &&
                request.StartTime < b.EndTime);

            if (!hasConflict)
                return table;
        }

        return null;
    }
}
