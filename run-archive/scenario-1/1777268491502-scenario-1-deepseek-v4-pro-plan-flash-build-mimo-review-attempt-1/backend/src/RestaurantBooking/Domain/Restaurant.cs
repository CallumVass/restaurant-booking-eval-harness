// pattern: Functional Core

namespace RestaurantBooking.Domain;

public class Restaurant
{
    public Guid Id { get; }
    public string Name { get; }
    public string Description { get; }
    public string Cuisine { get; }
    public List<Table> Tables { get; }

    public Restaurant(Guid id, string name, string description, string cuisine, List<Table> tables)
    {
        Id = id;
        Name = name;
        Description = description;
        Cuisine = cuisine;
        Tables = tables;
    }
}
