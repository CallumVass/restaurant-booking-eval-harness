using BookingError = RestaurantBooking.Domain.BookingError;

namespace RestaurantBooking.Domain;

public static class BookingDomain
{
    private static readonly TimeOnly OpenTime = new(17, 0);
    private static readonly TimeOnly CloseTime = new(22, 0);
    private const int SlotDurationMinutes = 60;

    public static Result<IReadOnlyList<TimeSlot>, BookingError> GetAvailableSlots(
        IReadOnlyList<Restaurant> restaurants,
        IReadOnlyList<Table> tables,
        IReadOnlyList<Booking> bookings,
        string restaurantId,
        DateOnly date,
        int partySize)
    {
        var restaurant = restaurants.FirstOrDefault(r => r.Id == restaurantId);
        if (restaurant is null)
            return Result<IReadOnlyList<TimeSlot>, BookingError>.Failure(new BookingError.UnknownRestaurant(restaurantId));

        if (partySize <= 0)
            return Result<IReadOnlyList<TimeSlot>, BookingError>.Failure(new BookingError.InvalidPartySize(partySize));

        var restaurantTables = tables.Where(t => t.RestaurantId == restaurantId).ToList();
        if (restaurantTables.Count == 0)
            return Result<IReadOnlyList<TimeSlot>, BookingError>.Failure(new BookingError.NoTablesAvailable());

        var maxCapacity = restaurantTables.Max(t => t.Seats);
        if (partySize > maxCapacity)
            return Result<IReadOnlyList<TimeSlot>, BookingError>.Failure(new BookingError.InvalidPartySize(partySize));

        if (date < DateOnly.FromDateTime(DateTime.UtcNow))
            return Result<IReadOnlyList<TimeSlot>, BookingError>.Failure(new BookingError.InvalidDate("Date is in the past"));

        var suitableTables = restaurantTables
            .Where(t => t.Seats >= partySize)
            .ToList();

        if (suitableTables.Count == 0)
            return Result<IReadOnlyList<TimeSlot>, BookingError>.Success([]);

        var slots = new List<TimeSlot>();
        var current = OpenTime;
        while (current < CloseTime)
        {
            foreach (var table in suitableTables)
            {
                var hasOverlap = bookings.Any(b =>
                    b.TableId == table.Id &&
                    b.Date == date &&
                    b.Time == current);

                if (!hasOverlap)
                    slots.Add(new TimeSlot(current, SlotDurationMinutes, table.Id));
            }

            current = current.AddMinutes(SlotDurationMinutes);
        }

        return Result<IReadOnlyList<TimeSlot>, BookingError>.Success(slots);
    }

    public static Result<Booking, BookingError> TryBook(
        IReadOnlyList<Restaurant> restaurants,
        IReadOnlyList<Table> tables,
        IReadOnlyList<Booking> bookings,
        string restaurantId,
        string tableId,
        string customerName,
        DateOnly date,
        TimeOnly time,
        int partySize)
    {
        var restaurant = restaurants.FirstOrDefault(r => r.Id == restaurantId);
        if (restaurant is null)
            return Result<Booking, BookingError>.Failure(new BookingError.UnknownRestaurant(restaurantId));

        if (partySize <= 0)
            return Result<Booking, BookingError>.Failure(new BookingError.InvalidPartySize(partySize));

        if (string.IsNullOrWhiteSpace(customerName))
            return Result<Booking, BookingError>.Failure(new BookingError.InvalidPartySize(0));

        var table = tables.FirstOrDefault(t => t.Id == tableId && t.RestaurantId == restaurantId);
        if (table is null)
            return Result<Booking, BookingError>.Failure(new BookingError.InvalidTimeSlot("Table not found"));

        if (partySize > table.Seats)
            return Result<Booking, BookingError>.Failure(new BookingError.InvalidPartySize(partySize));

        if (date < DateOnly.FromDateTime(DateTime.UtcNow))
            return Result<Booking, BookingError>.Failure(new BookingError.InvalidDate("Date is in the past"));

        if (time < OpenTime || time >= CloseTime)
            return Result<Booking, BookingError>.Failure(new BookingError.InvalidTimeSlot($"Time must be between {OpenTime:HH:mm} and {CloseTime:HH:mm}"));

        if (time.Minute != 0)
            return Result<Booking, BookingError>.Failure(new BookingError.InvalidTimeSlot("Time must be on the hour"));

        var hasOverlap = bookings.Any(b =>
            b.TableId == tableId &&
            b.Date == date &&
            b.Time == time);

        if (hasOverlap)
            return Result<Booking, BookingError>.Failure(new BookingError.OverlappingReservation(tableId, time, date));

        var booking = new Booking(
            Id: Guid.NewGuid().ToString(),
            RestaurantId: restaurantId,
            TableId: tableId,
            CustomerName: customerName,
            Date: date,
            Time: time,
            PartySize: partySize);

        return Result<Booking, BookingError>.Success(booking);
    }
}