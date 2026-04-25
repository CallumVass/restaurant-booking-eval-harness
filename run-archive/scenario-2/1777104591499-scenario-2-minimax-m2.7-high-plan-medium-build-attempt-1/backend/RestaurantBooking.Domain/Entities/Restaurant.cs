namespace RestaurantBooking.Domain.Entities;

public sealed class Restaurant
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
    public List<Table> Tables { get; init; } = [];

    public bool HasTableFor(int partySize) => Tables.Any(t => t.Capacity >= partySize);
    public IEnumerable<Table> TablesFor(int partySize) => Tables.Where(t => t.Capacity >= partySize);
}