// pattern: Functional Core

namespace RestaurantBooking.Domain;

public static class BookingConflict
{
    public static bool HasOverlap(TimeOnly newStart, TimeOnly newEnd, IEnumerable<Booking> existingBookings, Guid tableId, DateOnly date)
    {
        var relevant = existingBookings.Where(b =>
            b.TableId == tableId &&
            b.Date == date);

        foreach (var booking in relevant)
        {
            var existingStart = booking.Time;
            var existingEnd = booking.Time.AddMinutes(ValidationRules.BookingDurationMinutes);
            if (newStart < existingEnd && newEnd > existingStart)
                return true;
        }

        return false;
    }
}
