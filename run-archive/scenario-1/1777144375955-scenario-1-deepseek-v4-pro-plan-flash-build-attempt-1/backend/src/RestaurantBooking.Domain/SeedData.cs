namespace RestaurantBooking.Domain;

public static class SeedData
{
    public static List<Restaurant> CreateRestaurants()
    {
        var italianTables = new List<Table>
        {
            new(Guid.NewGuid(), "Tavolo Intimo", 2),
            new(Guid.NewGuid(), "Finestra", 4),
            new(Guid.NewGuid(), "Centrale", 4),
            new(Guid.NewGuid(), "Famiglia", 6),
            new(Guid.NewGuid(), "Balcone", 6),
        };

        var japaneseTables = new List<Table>
        {
            new(Guid.NewGuid(), "Kotatsu", 2),
            new(Guid.NewGuid(), "Sakura", 2),
            new(Guid.NewGuid(), "Zen", 4),
            new(Guid.NewGuid(), "Hana", 4),
            new(Guid.NewGuid(), "Fuji", 6),
            new(Guid.NewGuid(), "Omi", 2),
        };

        var frenchTables = new List<Table>
        {
            new(Guid.NewGuid(), "Coin Doux", 2),
            new(Guid.NewGuid(), "Jardin", 4),
            new(Guid.NewGuid(), "Cheminée", 4),
            new(Guid.NewGuid(), "Terrasse", 6),
            new(Guid.NewGuid(), "Cave", 2),
        };

        return
        [
            new(Guid.NewGuid(), "The Golden Fork", "Italian", italianTables),
            new(Guid.NewGuid(), "Sakura Blossom", "Japanese", japaneseTables),
            new(Guid.NewGuid(), "Le Petit Bistro", "French", frenchTables),
        ];
    }
}
