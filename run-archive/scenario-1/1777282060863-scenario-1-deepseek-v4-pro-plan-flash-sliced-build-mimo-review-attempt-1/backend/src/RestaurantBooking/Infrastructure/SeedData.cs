using RestaurantBooking.Domain;

namespace RestaurantBooking.Infrastructure;

public static class SeedData
{
    public static void Seed(InMemoryStore store)
    {
        var italianId = Guid.NewGuid();
        var italian = new Restaurant(italianId, "Italian", TimeSpan.FromHours(11), TimeSpan.FromHours(22));
        var italianTables = new List<Table>
        {
            new(Guid.NewGuid(), italianId, 2),
            new(Guid.NewGuid(), italianId, 4),
            new(Guid.NewGuid(), italianId, 4),
            new(Guid.NewGuid(), italianId, 6),
        };
        store.AddRestaurant(italian, italianTables);

        var japaneseId = Guid.NewGuid();
        var japanese = new Restaurant(japaneseId, "Japanese", TimeSpan.FromHours(11), TimeSpan.FromHours(22));
        var japaneseTables = new List<Table>
        {
            new(Guid.NewGuid(), japaneseId, 2),
            new(Guid.NewGuid(), japaneseId, 2),
            new(Guid.NewGuid(), japaneseId, 4),
            new(Guid.NewGuid(), japaneseId, 6),
        };
        store.AddRestaurant(japanese, japaneseTables);

        var mexicanId = Guid.NewGuid();
        var mexican = new Restaurant(mexicanId, "Mexican", TimeSpan.FromHours(11), TimeSpan.FromHours(22));
        var mexicanTables = new List<Table>
        {
            new(Guid.NewGuid(), mexicanId, 2),
            new(Guid.NewGuid(), mexicanId, 4),
            new(Guid.NewGuid(), mexicanId, 6),
        };
        store.AddRestaurant(mexican, mexicanTables);
    }
}
