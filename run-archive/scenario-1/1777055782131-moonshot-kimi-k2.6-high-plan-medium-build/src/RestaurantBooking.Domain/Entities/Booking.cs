using System;

namespace RestaurantBooking.Domain;

public sealed class Booking
{
    public Guid Id { get; init; }
    public Guid RestaurantId { get; init; }
    public Guid TableId { get; init; }
    public DateOnly Date { get; init; }
    public TimeOnly StartTime { get; init; }
    public TimeOnly EndTime { get; init; }
    public int PartySize { get; init; }
    public string CustomerName { get; init; } = string.Empty;
}
