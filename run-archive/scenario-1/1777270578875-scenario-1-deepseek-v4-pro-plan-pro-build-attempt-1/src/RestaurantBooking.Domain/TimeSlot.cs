// pattern: Functional Core

namespace RestaurantBooking.Domain;

public sealed record TimeSlot
{
    public TimeOnly Time { get; init; }
    public string TableId { get; init; } = string.Empty;
    public string TableLabel { get; init; } = string.Empty;
    public int Capacity { get; init; }
}
