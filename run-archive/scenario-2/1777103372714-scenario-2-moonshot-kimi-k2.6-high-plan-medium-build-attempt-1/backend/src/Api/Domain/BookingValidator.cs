// pattern: Functional Core

namespace RestaurantBooking.Api.Domain;

public static class BookingValidator
{
    public const int BookingDurationMinutes = 120;
    public static readonly TimeOnly OpeningTime = new(11, 0);
    public static readonly TimeOnly ClosingTime = new(22, 0);

    public static BookingError? ValidatePartySize(int partySize, int tableCapacity)
    {
        if (partySize <= 0)
            return BookingErrors.InvalidPartySize("Party size must be greater than 0.");

        if (partySize > tableCapacity)
            return BookingErrors.InvalidPartySize($"Party size ({partySize}) exceeds table capacity ({tableCapacity}).");

        return null;
    }

    public static BookingError? ValidateBookingTime(DateTime startTime, DateTime now)
    {
        if (startTime.Date < now.Date)
            return BookingErrors.InvalidDateTime("Booking date cannot be in the past.");

        var time = TimeOnly.FromDateTime(startTime);
        if (time < OpeningTime || time >= ClosingTime)
            return BookingErrors.InvalidDateTime($"Booking time must be between {OpeningTime:HH:mm} and {ClosingTime:HH:mm}.");

        if (startTime.Minute != 0 || startTime.Second != 0)
            return BookingErrors.InvalidDateTime("Booking time must be on the hour.");

        return null;
    }

    public static bool Overlaps(Booking existing, DateTime start, DateTime end)
    {
        return start < existing.EndTime && end > existing.StartTime;
    }
}
