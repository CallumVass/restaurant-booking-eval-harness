namespace RestaurantBooking.Features.Bookings;

public sealed record BookingResponse(
    Guid Id,
    Guid RestaurantId,
    Guid TableId,
    DateTimeOffset DateTime,
    TimeSpan Duration,
    int PartySize,
    string CustomerName,
    string CustomerEmail,
    string RestaurantName);
