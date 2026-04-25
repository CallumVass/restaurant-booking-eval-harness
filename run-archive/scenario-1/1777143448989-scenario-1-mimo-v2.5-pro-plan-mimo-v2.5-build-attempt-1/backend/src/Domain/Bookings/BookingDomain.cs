using RestaurantBooking.Domain.Common;

namespace RestaurantBooking.Domain.Bookings;

public static class BookingDomain
{
    public static readonly TimeOnly ServiceStart = new(11, 0);
    public static readonly TimeOnly ServiceEnd = new(22, 0);
    public static readonly int SlotDurationMinutes = 60;

    public static Result<IReadOnlyList<TimeSlot>> GetAvailableSlots(
        DateOnly slotDate,
        int partySize,
        IReadOnlyList<Tables.Table> tables,
        IReadOnlyList<Booking> existingBookings,
        int maxPartySize)
    {
        if (partySize <= 0)
            return Result<IReadOnlyList<TimeSlot>>.Failure(BookingError.InvalidPartySize);

        if (partySize > maxPartySize)
            return Result<IReadOnlyList<TimeSlot>>.Failure(BookingError.InvalidPartySize);

        if (slotDate < DateOnly.FromDateTime(DateTime.UtcNow))
            return Result<IReadOnlyList<TimeSlot>>.Failure(BookingError.InvalidDate);

        var suitableTables = tables.Where(t => t.Seats >= partySize).ToList();
        if (suitableTables.Count == 0)
            return Result<IReadOnlyList<TimeSlot>>.Failure(BookingError.NoAvailableTable);

        var slots = new List<TimeSlot>();
        var current = ServiceStart;

        while (current.AddMinutes(SlotDurationMinutes) <= ServiceEnd)
        {
            var endTime = current.AddMinutes(SlotDurationMinutes);

            var hasConflict = existingBookings.Any(b =>
                b.Date == slotDate &&
                suitableTables.Any(t => t.Id == b.TableId) &&
                b.StartTime < endTime &&
                b.EndTime > current);

            if (!hasConflict)
                slots.Add(new TimeSlot(current, endTime));

            current = current.AddMinutes(SlotDurationMinutes);
        }

        return Result<IReadOnlyList<TimeSlot>>.Success(slots);
    }

    public static Result<Booking> CreateBooking(
        CreateBookingRequest request,
        Restaurants.Restaurant restaurant,
        IReadOnlyList<Tables.Table> tables,
        IReadOnlyList<Booking> existingBookings)
    {
        if (request.PartySize <= 0)
            return Result<Booking>.Failure(BookingError.InvalidPartySize);

        if (request.PartySize > restaurant.MaxPartySize)
            return Result<Booking>.Failure(BookingError.InvalidPartySize);

        if (request.Date < DateOnly.FromDateTime(DateTime.UtcNow))
            return Result<Booking>.Failure(BookingError.InvalidDate);

        if (request.StartTime < ServiceStart || request.StartTime > ServiceEnd.AddMinutes(-SlotDurationMinutes))
            return Result<Booking>.Failure(BookingError.InvalidTime);

        var suitableTables = tables.Where(t => t.Seats >= request.PartySize).ToList();
        if (suitableTables.Count == 0)
            return Result<Booking>.Failure(BookingError.NoAvailableTable);

        var endTime = request.StartTime.AddMinutes(SlotDurationMinutes);

        foreach (var table in suitableTables.OrderBy(t => t.Seats))
        {
            var hasOverlap = existingBookings.Any(b =>
                b.TableId == table.Id &&
                b.Date == request.Date &&
                b.StartTime < endTime &&
                b.EndTime > request.StartTime);

            if (!hasOverlap)
            {
                return Result<Booking>.Success(new Booking
                {
                    Id = Guid.NewGuid(),
                    RestaurantId = restaurant.Id,
                    TableId = table.Id,
                    CustomerName = request.CustomerName,
                    CustomerEmail = request.CustomerEmail,
                    PartySize = request.PartySize,
                    Date = request.Date,
                    StartTime = request.StartTime,
                    EndTime = endTime
                });
            }
        }

        return Result<Booking>.Failure(BookingError.OverlappingReservation);
    }
}

public sealed record TimeSlot(TimeOnly StartTime, TimeOnly EndTime);

public sealed record CreateBookingRequest(
    string CustomerName,
    string CustomerEmail,
    int PartySize,
    DateOnly Date,
    TimeOnly StartTime);
