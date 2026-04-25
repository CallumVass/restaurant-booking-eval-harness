namespace RestaurantBooking.Domain;

public static class BookingValidator
{
    public static Result<Booking> Validate(
        Guid bookingId,
        Guid restaurantId,
        Guid tableId,
        string customerName,
        string customerEmail,
        DateOnly date,
        TimeOnly startTime,
        int partySize,
        Restaurant restaurant,
        List<Table> tables,
        List<Booking> existingBookings)
    {
        if (string.IsNullOrWhiteSpace(customerName))
            return Result<Booking>.Failure(BookingErrors.CustomerNameRequired);

        if (string.IsNullOrWhiteSpace(customerEmail))
            return Result<Booking>.Failure(BookingErrors.CustomerEmailRequired);

        if (partySize < 1)
            return Result<Booking>.Failure(BookingErrors.ZeroPartySize);

        var maxCapacity = tables.Count > 0 ? tables.Max(t => t.Capacity) : 0;
        if (partySize > maxCapacity)
            return Result<Booking>.Failure(BookingErrors.InvalidPartySize(maxCapacity));

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (date <= today)
            return Result<Booking>.Failure(BookingErrors.DateInPast);

        if (startTime < new TimeOnly(11, 0) || startTime >= new TimeOnly(22, 0))
            return Result<Booking>.Failure(BookingErrors.OutsideOperatingHours);

        var endTime = startTime.AddHours(1.5);
        if (endTime > new TimeOnly(22, 0))
            return Result<Booking>.Failure(BookingErrors.OutsideOperatingHours);

        var conflict = ConflictDetector.HasConflict(tableId, date, startTime, endTime, existingBookings);
        if (conflict)
            return Result<Booking>.Failure(BookingErrors.ConflictDetected);

        var booking = new Booking(
            bookingId, restaurantId, tableId,
            customerName.Trim(), customerEmail.Trim(),
            date, startTime, endTime, partySize,
            DateTime.UtcNow);

        return Result<Booking>.Success(booking);
    }
}
