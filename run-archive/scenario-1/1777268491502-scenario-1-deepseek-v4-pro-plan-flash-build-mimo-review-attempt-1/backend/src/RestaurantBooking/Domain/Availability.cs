// pattern: Functional Core

namespace RestaurantBooking.Domain;

public static class Availability
{
    public static List<TimeSlot> GetAvailableSlots(Restaurant restaurant, DateOnly date, int partySize, IEnumerable<Booking> existingBookings)
    {
        var slots = new List<TimeSlot>();
        var suitableTables = restaurant.Tables
            .Where(t => ValidationRules.IsTableSuitable(t, partySize))
            .OrderBy(t => t.Capacity)
            .ToList();

        var time = ValidationRules.OpeningTime;
        while (time <= ValidationRules.LastSeatingTime)
        {
            foreach (var table in suitableTables)
            {
                var (start, end) = ValidationRules.GetBookingWindow(time);
                var isConflict = BookingConflict.HasOverlap(start, end, existingBookings, table.Id, date);

                slots.Add(new TimeSlot(time, table.Id, table.Capacity, !isConflict, table.Capacity));
            }

            time = time.AddMinutes(30);
        }

        return slots;
    }
}
