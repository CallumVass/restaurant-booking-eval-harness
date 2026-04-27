namespace RestaurantBooking.Domain;

public static class BookingService
{
    public static Result<Booking> CreateBooking(
        IReadOnlyList<Booking> existingBookings,
        IReadOnlyList<Table> tables,
        Restaurant restaurant,
        BookingRequest request)
    {
        if (request.PartySize <= 0)
            return Result<Booking>.Failure(BookingError.InvalidPartySize);

        if (request.Date < DateOnly.FromDateTime(DateTime.UtcNow))
            return Result<Booking>.Failure(BookingError.InvalidDate);

        if (request.StartTime >= request.EndTime)
            return Result<Booking>.Failure(BookingError.InvalidTimeSlot);

        if (request.StartTime < restaurant.OpeningTime || request.EndTime > restaurant.ClosingTime)
            return Result<Booking>.Failure(BookingError.InvalidTimeSlot);

        var suitableTables = tables
            .Where(t => t.RestaurantId == restaurant.Id && t.Seats >= request.PartySize)
            .ToList();

        if (suitableTables.Count == 0)
            return Result<Booking>.Failure(BookingError.NoAvailableTable);

        var dayBookings = existingBookings
            .Where(b => b.RestaurantId == request.RestaurantId && b.Date == request.Date)
            .ToList();

        foreach (var table in suitableTables)
        {
            bool hasOverlap = dayBookings.Any(b =>
                b.TableId == table.Id &&
                b.StartTime < request.EndTime &&
                b.EndTime > request.StartTime);

            if (!hasOverlap)
            {
                var booking = new Booking(
                    Id: Guid.NewGuid().ToString("N"),
                    RestaurantId: request.RestaurantId,
                    TableId: table.Id,
                    CustomerName: request.CustomerName,
                    PartySize: request.PartySize,
                    Date: request.Date,
                    StartTime: request.StartTime,
                    EndTime: request.EndTime,
                    CreatedAt: DateTime.UtcNow);

                return Result<Booking>.Success(booking);
            }
        }

        return Result<Booking>.Failure(BookingError.OverlappingReservation);
    }
}
