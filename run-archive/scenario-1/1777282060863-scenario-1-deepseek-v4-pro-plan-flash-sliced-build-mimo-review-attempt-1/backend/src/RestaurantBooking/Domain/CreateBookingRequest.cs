namespace RestaurantBooking.Domain;

public sealed record CreateBookingRequest(
    Guid RestaurantId,
    DateTimeOffset DateTime,
    int PartySize,
    string CustomerName,
    string CustomerEmail
);
