namespace RestaurantBooking.Domain.Entities;

public sealed class Booking
{
    public Guid Id { get; init; }
    public Guid RestaurantId { get; init; }
    public Guid TableId { get; init; }
    public string CustomerName { get; init; } = string.Empty;
    public string CustomerEmail { get; init; } = string.Empty;
    public string CustomerPhone { get; init; } = string.Empty;
    public int PartySize { get; init; }
    public DateTime StartTime { get; init; }
    public DateTime EndTime { get; init; }
    public DateTime CreatedAt { get; init; }
}