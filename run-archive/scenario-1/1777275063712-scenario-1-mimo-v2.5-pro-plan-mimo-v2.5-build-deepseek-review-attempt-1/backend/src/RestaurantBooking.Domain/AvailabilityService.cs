namespace RestaurantBooking.Domain;

public static class AvailabilityService
{
    public static Result<IReadOnlyList<AvailableSlot>> GetAvailableSlots(
        Restaurant restaurant,
        IReadOnlyList<Table> tables,
        IReadOnlyList<Booking> existingBookings,
        DateOnly date,
        int partySize)
    {
        if (partySize <= 0)
            return Result<IReadOnlyList<AvailableSlot>>.Failure(BookingError.InvalidPartySize);

        if (date < DateOnly.FromDateTime(DateTime.UtcNow))
            return Result<IReadOnlyList<AvailableSlot>>.Failure(BookingError.InvalidDate);

        var suitableTables = tables
            .Where(t => t.RestaurantId == restaurant.Id && t.Seats >= partySize)
            .ToList();

        if (suitableTables.Count == 0)
            return Result<IReadOnlyList<AvailableSlot>>.Failure(BookingError.NoAvailableTable);

        var dayBookings = existingBookings
            .Where(b => b.RestaurantId == restaurant.Id && b.Date == date)
            .ToList();

        var slots = new List<AvailableSlot>();
        var slotDuration = TimeSpan.FromHours(1);
        var current = restaurant.OpeningTime;
        var closing = restaurant.ClosingTime;

        while (current.ToTimeSpan() + slotDuration <= closing.ToTimeSpan())
        {
            var slotEnd = current.AddMinutes(60);

            foreach (var table in suitableTables)
            {
                bool isOccupied = dayBookings.Any(b =>
                    b.TableId == table.Id &&
                    b.StartTime < slotEnd &&
                    b.EndTime > current);

                if (!isOccupied)
                {
                    slots.Add(new AvailableSlot(
                        new TimeSlot(current, slotEnd),
                        table.Id,
                        table.Location,
                        table.Seats));
                }
            }

            current = slotEnd;
        }

        return Result<IReadOnlyList<AvailableSlot>>.Success(slots);
    }
}
