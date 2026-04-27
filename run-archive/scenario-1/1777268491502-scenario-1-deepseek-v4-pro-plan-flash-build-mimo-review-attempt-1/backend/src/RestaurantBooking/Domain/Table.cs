// pattern: Functional Core

namespace RestaurantBooking.Domain;

public class Table
{
    public Guid Id { get; }
    public int Capacity { get; }

    public Table(Guid id, int capacity)
    {
        Id = id;
        Capacity = capacity;
    }
}
