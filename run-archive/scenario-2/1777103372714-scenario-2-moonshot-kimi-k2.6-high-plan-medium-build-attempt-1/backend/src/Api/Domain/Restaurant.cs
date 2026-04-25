// pattern: Functional Core

namespace RestaurantBooking.Api.Domain;

public record Restaurant(
    Guid Id,
    string Name,
    string Description,
    IReadOnlyList<Table> Tables
);

public record Table(
    Guid Id,
    string Name,
    int Capacity
);

public record Booking(
    Guid Id,
    Guid RestaurantId,
    Guid TableId,
    DateTime StartTime,
    DateTime EndTime,
    int PartySize,
    string CustomerName,
    string CustomerEmail
);
