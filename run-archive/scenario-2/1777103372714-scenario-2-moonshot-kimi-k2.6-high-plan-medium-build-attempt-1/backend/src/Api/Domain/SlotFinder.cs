// pattern: Functional Core

namespace RestaurantBooking.Api.Domain;

public record TimeSlot(
    DateTime StartTime,
    DateTime EndTime
);

public static class SlotFinder
{
    public static List<TimeSlot> FindAvailableSlots(
        Restaurant restaurant,
        DateOnly date,
        int partySize,
        IReadOnlyList<Booking> existingBookings)
    {
        var slots = new List<TimeSlot>();

        var start = date.ToDateTime(BookingValidator.OpeningTime);
        var end = date.ToDateTime(BookingValidator.ClosingTime);

        for (var current = start; current < end; current = current.AddHours(1))
        {
            var slotEnd = current.AddMinutes(BookingValidator.BookingDurationMinutes);
            if (slotEnd > end)
                break;

            var table = FindAvailableTable(restaurant, partySize, existingBookings, current, slotEnd);
            if (table is not null)
                slots.Add(new TimeSlot(current, slotEnd));
        }

        return slots;
    }

    public static Table? FindAvailableTable(
        Restaurant restaurant,
        int partySize,
        IReadOnlyList<Booking> existingBookings,
        DateTime start,
        DateTime end)
    {
        foreach (var table in restaurant.Tables)
        {
            if (table.Capacity < partySize)
                continue;

            var hasOverlap = existingBookings.Any(b =>
                b.TableId == table.Id && BookingValidator.Overlaps(b, start, end));

            if (!hasOverlap)
                return table;
        }

        return null;
    }
}
