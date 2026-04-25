using System;

namespace RestaurantBooking.Domain;

public sealed class Restaurant
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public TimeOnly OpeningTime { get; init; }
    public TimeOnly ClosingTime { get; init; }
}
