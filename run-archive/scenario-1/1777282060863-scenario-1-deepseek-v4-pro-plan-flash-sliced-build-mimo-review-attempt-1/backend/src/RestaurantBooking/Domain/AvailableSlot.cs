namespace RestaurantBooking.Domain;

public sealed record AvailableSlot(TimeSpan Time, Guid TableId);
