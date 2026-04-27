// pattern: Functional Core

namespace RestaurantBooking.Domain;

public class TimeSlot
{
    public TimeOnly Time { get; }
    public Guid TableId { get; }
    public int Capacity { get; }
    public bool Available { get; }
    public int AvailableCapacity { get; }

    public TimeSlot(TimeOnly time, Guid tableId, int capacity, bool available, int availableCapacity)
    {
        Time = time;
        TableId = tableId;
        Capacity = capacity;
        Available = available;
        AvailableCapacity = availableCapacity;
    }
}
