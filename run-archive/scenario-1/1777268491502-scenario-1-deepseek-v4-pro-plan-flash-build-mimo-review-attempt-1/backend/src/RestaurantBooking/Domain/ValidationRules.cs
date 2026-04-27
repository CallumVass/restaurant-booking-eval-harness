// pattern: Functional Core

namespace RestaurantBooking.Domain;

public static class ValidationRules
{
    public static readonly int MinPartySize = 1;
    public static readonly int MaxPartySize = 20;
    public static readonly TimeOnly OpeningTime = new(11, 0);
    public static readonly TimeOnly LastSeatingTime = new(21, 0);
    public static readonly int BookingDurationMinutes = 90;

    public static Error? ValidatePartySize(int partySize)
    {
        if (partySize < MinPartySize)
            return new Error.InvalidPartySize($"Must be at least {MinPartySize}, got {partySize}");
        if (partySize > MaxPartySize)
            return new Error.InvalidPartySize($"Must be at most {MaxPartySize}, got {partySize}");
        return null;
    }

    public static Error? ValidateBookingDateTime(DateOnly date, TimeOnly time)
    {
        var now = DateTime.UtcNow;
        var bookingDateTime = date.ToDateTime(time, DateTimeKind.Utc);

        if (bookingDateTime < now)
            return new Error.InvalidDateTime("Booking date/time must not be in the past");

        if (time < OpeningTime)
            return new Error.InvalidDateTime($"Booking time must be at or after {OpeningTime}");

        if (time > LastSeatingTime)
            return new Error.InvalidDateTime($"Last seating is at {LastSeatingTime}");

        var minutes = time.Hour * 60 + time.Minute;
        if (minutes % 30 != 0)
            return new Error.InvalidDateTime("Booking time must be in 30-minute increments");

        return null;
    }

    public static bool IsTableSuitable(Table table, int partySize) => table.Capacity >= partySize;

    public static (TimeOnly start, TimeOnly end) GetBookingWindow(TimeOnly time) =>
        (time, time.AddMinutes(BookingDurationMinutes));
}
