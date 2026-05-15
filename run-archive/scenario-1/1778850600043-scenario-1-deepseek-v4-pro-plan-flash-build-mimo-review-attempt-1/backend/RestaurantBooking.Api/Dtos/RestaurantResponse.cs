namespace RestaurantBooking.Api.Dtos;

public record RestaurantResponse(
    Guid Id,
    string Name,
    string Description,
    string Cuisine,
    string Address,
    int TableCount,
    int MinCapacity,
    int MaxCapacity
);

public record AvailableSlotResponse(
    TimeOnly StartTime,
    TimeOnly EndTime,
    int TableCapacity
);

public record CreateBookingRequest(
    Guid RestaurantId,
    DateOnly Date,
    TimeOnly StartTime,
    int PartySize,
    string CustomerName,
    string CustomerEmail,
    string? Notes
);

public record BookingResponse(
    Guid Id,
    Guid RestaurantId,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    int PartySize,
    string CustomerName,
    string CustomerEmail,
    string? Notes,
    DateTime CreatedAtUtc
);

public record BookingErrorResponse(
    string Code,
    string Message
);
