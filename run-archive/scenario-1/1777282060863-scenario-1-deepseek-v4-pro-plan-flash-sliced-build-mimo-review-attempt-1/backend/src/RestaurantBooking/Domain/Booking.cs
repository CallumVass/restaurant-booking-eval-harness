namespace RestaurantBooking.Domain;

public sealed record Booking(
    Guid Id,
    Guid RestaurantId,
    Guid TableId,
    DateTimeOffset DateTime,
    TimeSpan Duration,
    int PartySize,
    string CustomerName,
    string CustomerEmail
);
