namespace RestaurantBooking.Domain;

public static class AvailabilityCalculator
{
    public static List<TimeSlot> GetAvailableSlots(
        DateOnly date,
        int partySize,
        List<Table> tables,
        List<Booking> existingBookings)
    {
        var suitableTables = tables
            .Where(t => t.Capacity >= partySize)
            .ToList();

        if (suitableTables.Count == 0)
            return [];

        var slots = new List<TimeSlot>();
        var openTime = new TimeOnly(11, 0);
        var closeTime = new TimeOnly(22, 0);
        var slotDuration = TimeSpan.FromMinutes(90);

        for (var time = openTime; time.Add(slotDuration) <= closeTime; time = time.Add(slotDuration))
        {
            var endTime = time.Add(slotDuration);
            var availableCount = suitableTables.Count(t =>
                !existingBookings.Exists(b =>
                    b.TableId == t.Id &&
                    b.Date == date &&
                    time < b.EndTime &&
                    endTime > b.StartTime));

            if (availableCount > 0)
            {
                slots.Add(new TimeSlot(time, endTime, availableCount));
            }
        }

        return slots;
    }
}
