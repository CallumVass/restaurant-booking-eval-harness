// pattern: Functional Core

namespace RestaurantBooking.Domain;

public sealed class Table
{
    public string Id { get; init; } = string.Empty;
    public int Capacity { get; init; }
    public string? Label { get; init; }
}
