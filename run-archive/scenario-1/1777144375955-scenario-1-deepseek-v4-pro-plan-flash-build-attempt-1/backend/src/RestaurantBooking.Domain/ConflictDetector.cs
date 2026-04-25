namespace RestaurantBooking.Domain;

public static class ConflictDetector
{
    public static bool HasConflict(
        Guid tableId,
        DateOnly date,
        TimeOnly newStart,
        TimeOnly newEnd,
        List<Booking> existingBookings)
    {
        return existingBookings.Exists(b =>
            b.TableId == tableId &&
            b.Date == date &&
            newStart < b.EndTime &&
            newEnd > b.StartTime);
    }
}
