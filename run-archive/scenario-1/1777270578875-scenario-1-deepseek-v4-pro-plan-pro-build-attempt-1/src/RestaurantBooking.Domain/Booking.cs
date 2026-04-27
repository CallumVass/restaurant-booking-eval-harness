// pattern: Functional Core

namespace RestaurantBooking.Domain;

public sealed class Booking
{
    public string Id { get; init; } = string.Empty;
    public string RestaurantId { get; init; } = string.Empty;
    public string TableId { get; init; } = string.Empty;
    public string CustomerName { get; init; } = string.Empty;
    public string CustomerEmail { get; init; } = string.Empty;
    public int PartySize { get; init; }
    public DateTime ReservationTime { get; init; }
    public int DurationMinutes { get; init; } = 90;

    public DateTime EndTime => ReservationTime.AddMinutes(DurationMinutes);
}
