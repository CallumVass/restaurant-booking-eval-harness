namespace Backend.Domain;

public record Booking(
    Guid Id,
    Guid RestaurantId,
    Guid TableId,
    DateOnly Date,
    TimeOnly StartTime,
    int PartySize,
    string GuestName,
    DateTime CreatedAt
);
