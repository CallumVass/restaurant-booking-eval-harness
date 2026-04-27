namespace RestaurantBooking.Domain;

public sealed record Table(Guid Id, Guid RestaurantId, int Capacity);
