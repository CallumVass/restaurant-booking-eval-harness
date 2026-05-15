namespace RestaurantBooking.Api.Models;

public class Table
{
    public required Guid Id { get; init; }
    public required Guid RestaurantId { get; init; }
    public required int Capacity { get; init; }
    public required string Label { get; init; }
}
