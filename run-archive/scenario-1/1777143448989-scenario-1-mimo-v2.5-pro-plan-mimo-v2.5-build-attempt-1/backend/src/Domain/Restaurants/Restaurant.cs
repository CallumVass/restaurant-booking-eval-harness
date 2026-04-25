namespace RestaurantBooking.Domain.Restaurants;

public sealed class Restaurant
{
    public Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Address { get; init; }
    public int MaxPartySize { get; init; }
}
