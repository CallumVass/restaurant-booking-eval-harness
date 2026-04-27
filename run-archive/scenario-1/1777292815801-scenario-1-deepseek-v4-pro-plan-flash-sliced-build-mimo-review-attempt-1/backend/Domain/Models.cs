namespace Backend.Domain;

public record Restaurant(string Id, string Name, string Cuisine, string Address);

public record Table(string Id, string RestaurantId, int Capacity, string Label);

public record Booking(string Id, string RestaurantId, string TableId, string GuestName, string GuestEmail, int PartySize, DateTime DateTime, TimeSpan Duration);

public record CreateBookingRequest(string GuestName, string GuestEmail, int PartySize, DateTime DateTime);

public static class SeedData
{
    public static readonly Restaurant[] Restaurants =
    [
        new("rest-1", "Bella Italia",  "Italian",  "123 Main St"),
        new("rest-2", "Sakura Sushi",  "Japanese", "456 Oak Ave"),
        new("rest-3", "El Rancho",     "Mexican",  "789 Pine Rd"),
    ];

    public static readonly Table[] Tables =
    [
        new("table-1",  "rest-1", 2, "Table 1 (2 seats)"),
        new("table-2",  "rest-1", 4, "Table 2 (4 seats)"),
        new("table-3",  "rest-1", 6, "Table 3 (6 seats)"),
        new("table-4",  "rest-2", 2, "Table 1 (2 seats)"),
        new("table-5",  "rest-2", 4, "Table 2 (4 seats)"),
        new("table-6",  "rest-2", 8, "Table 3 (8 seats)"),
        new("table-7",  "rest-3", 2, "Table 1 (2 seats)"),
        new("table-8",  "rest-3", 4, "Table 2 (4 seats)"),
        new("table-9",  "rest-3", 6, "Table 3 (6 seats)"),
        new("table-10", "rest-3", 8, "Table 4 (8 seats)"),
    ];
}
