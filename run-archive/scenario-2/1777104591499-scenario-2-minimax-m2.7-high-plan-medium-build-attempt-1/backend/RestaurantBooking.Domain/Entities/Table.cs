namespace RestaurantBooking.Domain.Entities;

public sealed class Table
{
    public Guid Id { get; init; }
    public Guid RestaurantId { get; init; }
    public int TableNumber { get; init; }
    public int Capacity { get; init; }
}