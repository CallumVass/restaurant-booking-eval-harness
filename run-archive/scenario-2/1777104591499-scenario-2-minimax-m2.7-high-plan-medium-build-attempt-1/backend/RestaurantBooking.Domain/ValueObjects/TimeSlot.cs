namespace RestaurantBooking.Domain.ValueObjects;

public sealed record TimeSlot(DateTime Start, DateTime End)
{
    public static TimeSlot FromDateTime(DateTime start, int durationMinutes = 90)
    {
        return new TimeSlot(start, start.AddMinutes(durationMinutes));
    }

    public bool Overlaps(TimeSlot other) =>
        Start < other.End && End > other.Start;
}