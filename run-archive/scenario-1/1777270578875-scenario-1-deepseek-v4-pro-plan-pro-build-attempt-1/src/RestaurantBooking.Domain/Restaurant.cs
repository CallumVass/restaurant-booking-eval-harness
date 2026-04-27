// pattern: Functional Core

namespace RestaurantBooking.Domain;

public sealed class Restaurant
{
    public string Id { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Cuisine { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
    public List<Table> Tables { get; init; } = [];
}
