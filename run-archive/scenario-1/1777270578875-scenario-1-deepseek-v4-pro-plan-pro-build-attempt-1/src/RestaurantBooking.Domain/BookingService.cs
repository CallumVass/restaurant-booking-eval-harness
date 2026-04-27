// pattern: Functional Core

using RestaurantBooking.Domain.Errors;

namespace RestaurantBooking.Domain;

public sealed record BookingRequest(
    string RestaurantId,
    string TableId,
    string CustomerName,
    string CustomerEmail,
    int PartySize,
    DateTime ReservationTime,
    int DurationMinutes = 90);

public static class BookingService
{
    public static readonly TimeOnly OperatingStart = new(11, 0);
    public static readonly TimeOnly OperatingEnd = new(22, 0);

    public static Result<Booking, BookingError> TryBook(
        Restaurant restaurant,
        IReadOnlyList<Booking> existingBookings,
        BookingRequest request)
    {
        if (restaurant.Id != request.RestaurantId)
            return Result.Failure<Booking, BookingError>(
                BookingErrors.RestaurantNotFound(request.RestaurantId));

        var table = restaurant.Tables.FirstOrDefault(t => t.Id == request.TableId);
        if (table is null)
            return Result.Failure<Booking, BookingError>(
                BookingErrors.TableNotFound(request.TableId));

        if (request.PartySize < 1)
            return Result.Failure<Booking, BookingError>(
                BookingErrors.InvalidPartySize(request.PartySize));

        if (request.PartySize > table.Capacity)
            return Result.Failure<Booking, BookingError>(
                BookingErrors.InvalidPartySize(request.PartySize, table.Capacity));

        var time = TimeOnly.FromDateTime(request.ReservationTime);
        if (time < OperatingStart || time >= OperatingEnd)
            return Result.Failure<Booking, BookingError>(
                BookingErrors.InvalidDateTime(
                    $"Reservation time must be between {OperatingStart:HH\\:mm} and {OperatingEnd:HH\\:mm}."));

        if (request.ReservationTime <= DateTime.UtcNow)
            return Result.Failure<Booking, BookingError>(
                BookingErrors.InvalidDateTime("Reservation time cannot be in the past."));

        var newStart = request.ReservationTime;
        var newEnd = request.ReservationTime.AddMinutes(request.DurationMinutes);

        foreach (var existing in existingBookings.Where(b =>
            b.TableId == request.TableId && b.RestaurantId == request.RestaurantId))
        {
            var existingEnd = existing.EndTime;
            if (newStart < existingEnd && newEnd > existing.ReservationTime)
            {
                return Result.Failure<Booking, BookingError>(
                    BookingErrors.TimeConflict(table.Id, existing.ReservationTime, existingEnd));
            }
        }

        var booking = new Booking
        {
            Id = Guid.NewGuid().ToString(),
            RestaurantId = request.RestaurantId,
            TableId = request.TableId,
            CustomerName = request.CustomerName,
            CustomerEmail = request.CustomerEmail,
            PartySize = request.PartySize,
            ReservationTime = request.ReservationTime,
            DurationMinutes = request.DurationMinutes
        };

        return Result.Success<Booking, BookingError>(booking);
    }

    public static List<TimeSlot> GetAvailableSlots(
        Restaurant restaurant,
        IReadOnlyList<Booking> bookings,
        DateOnly date,
        int partySize)
    {
        if (partySize < 1)
            return [];

        var slots = new List<TimeSlot>();
        var current = OperatingStart;

        while (current < OperatingEnd)
        {
            var slotStart = date.ToDateTime(current);
            var slotEnd = slotStart.AddMinutes(90);

            var suitableTable = restaurant.Tables
                .Where(t => t.Capacity >= partySize)
                .FirstOrDefault(t =>
                    !bookings.Any(b =>
                        b.TableId == t.Id &&
                        b.RestaurantId == restaurant.Id &&
                        b.ReservationTime.Date == date.ToDateTime(TimeOnly.MinValue).Date &&
                        slotStart < b.EndTime &&
                        slotEnd > b.ReservationTime));

            if (suitableTable is not null)
            {
                slots.Add(new TimeSlot
                {
                    Time = current,
                    TableId = suitableTable.Id,
                    TableLabel = suitableTable.Label ?? $"Table {suitableTable.Id}",
                    Capacity = suitableTable.Capacity
                });
            }

            current = current.AddMinutes(30);
        }

        return slots;
    }
}
