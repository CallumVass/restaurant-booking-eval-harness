using RestaurantBooking.Domain;

namespace RestaurantBooking.Data;

public sealed class InMemoryTableRepository : ITableRepository
{
    private readonly IReadOnlyList<Table> _tables;

    public InMemoryTableRepository(IReadOnlyList<Table> tables) =>
        _tables = tables;

    public IReadOnlyList<Table> GetByRestaurantId(string restaurantId) =>
        _tables.Where(t => t.RestaurantId == restaurantId).ToList();

    public Table? GetById(string id) =>
        _tables.FirstOrDefault(t => t.Id == id);

    public IReadOnlyList<Table> GetAll() => _tables;
}