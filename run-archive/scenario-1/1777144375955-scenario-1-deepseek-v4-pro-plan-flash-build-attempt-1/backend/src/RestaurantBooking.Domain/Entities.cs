namespace RestaurantBooking.Domain;

public sealed record Restaurant(Guid Id, string Name, string Cuisine, List<Table> Tables);

public sealed record Table(Guid Id, string Label, int Capacity);

public sealed record Booking(
    Guid Id,
    Guid RestaurantId,
    Guid TableId,
    string CustomerName,
    string CustomerEmail,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    int PartySize,
    DateTime CreatedAtUtc);

public sealed record TimeSlot(TimeOnly StartTime, TimeOnly EndTime, int AvailableCapacity);
