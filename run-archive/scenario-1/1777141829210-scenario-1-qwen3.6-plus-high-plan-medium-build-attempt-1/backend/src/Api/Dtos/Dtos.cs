namespace Api.Dtos;

public record CreateBookingRequest(
    string RestaurantId,
    string GuestName,
    string GuestEmail,
    int PartySize,
    DateTime DateTime);

public record BookingResponse(
    string Id,
    string RestaurantId,
    string GuestName,
    string GuestEmail,
    int PartySize,
    DateTime DateTime,
    int DurationMinutes);

public record RestaurantResponse(
    string Id,
    string Name,
    string Description,
    string Cuisine,
    int MaxCapacity);

public record TimeSlotResponse(
    DateTime Time,
    bool IsAvailable);

public record ErrorResponse(
    string Error,
    string Code);
