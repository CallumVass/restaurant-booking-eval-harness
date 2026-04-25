namespace RestaurantBooking.Domain.Tables;

public sealed class Table
{
    public Guid Id { get; init; }
    public Guid RestaurantId { get; init; }
    public int Seats { get; init; }
}
