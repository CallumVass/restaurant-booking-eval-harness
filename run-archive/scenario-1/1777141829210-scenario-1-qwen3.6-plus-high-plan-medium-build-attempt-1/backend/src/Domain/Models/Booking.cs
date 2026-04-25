namespace Domain.Models;

public record Booking(
    string Id,
    string RestaurantId,
    string TableId,
    string GuestName,
    string GuestEmail,
    int PartySize,
    DateTime DateTime,
    int DurationMinutes);
