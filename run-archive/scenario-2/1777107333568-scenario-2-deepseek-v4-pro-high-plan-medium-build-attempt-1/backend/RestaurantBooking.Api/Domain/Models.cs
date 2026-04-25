// pattern: Functional Core

namespace RestaurantBooking.Api.Domain;

public sealed record Restaurant(int Id, string Name, List<Table> Tables);

public sealed record Table(int Id, int RestaurantId, int Capacity);

public sealed record Booking(
    string Id,
    int RestaurantId,
    int TableId,
    string CustomerName,
    string CustomerEmail,
    int PartySize,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    DateTime CreatedAt);

public sealed record BookingRequest(
    int RestaurantId,
    string CustomerName,
    string CustomerEmail,
    int PartySize,
    DateOnly Date,
    TimeOnly StartTime);

public sealed record BookingResult(
    string Id,
    int RestaurantId,
    int TableId,
    string CustomerName,
    int PartySize,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime);

public sealed record TimeSlot(
    TimeOnly StartTime,
    TimeOnly EndTime,
    List<int> AvailableTableIds);

public sealed record RestaurantSummary(int Id, string Name, List<int> TableCapacities);
