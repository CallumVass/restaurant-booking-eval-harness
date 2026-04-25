using System;

namespace RestaurantBooking.Domain;

public sealed class Table
{
    public Guid Id { get; init; }
    public Guid RestaurantId { get; init; }
    public int Capacity { get; init; }
}
