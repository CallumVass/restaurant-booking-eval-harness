namespace RestaurantBooking.Api.Models;

public class Restaurant
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required string Cuisine { get; init; }
    public required string Address { get; init; }
    public required List<Table> Tables { get; init; } = [];
}
