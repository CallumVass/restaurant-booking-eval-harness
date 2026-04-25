namespace RestaurantBooking.Domain;

public sealed record Booking(
    string Id,
    string RestaurantId,
    string TableId,
    string CustomerName,
    DateOnly Date,
    TimeOnly Time,
    int PartySize);