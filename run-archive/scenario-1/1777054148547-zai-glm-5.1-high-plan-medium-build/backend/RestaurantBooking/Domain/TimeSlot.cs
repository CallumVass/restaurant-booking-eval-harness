namespace RestaurantBooking.Domain;

public sealed record TimeSlot(TimeOnly Time, int DurationMinutes, string TableId);