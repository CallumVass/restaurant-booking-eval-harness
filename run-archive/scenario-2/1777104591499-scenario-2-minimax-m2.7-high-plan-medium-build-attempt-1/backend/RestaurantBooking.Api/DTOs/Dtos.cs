namespace RestaurantBooking.Api.DTOs;

public sealed record RestaurantDto(
    Guid Id,
    string Name,
    string Description,
    string Address,
    List<TableDto> Tables);

public sealed record TableDto(
    Guid Id,
    int TableNumber,
    int Capacity);

public sealed record CreateBookingRequest(
    Guid RestaurantId,
    Guid? TableId,
    string CustomerName,
    string CustomerEmail,
    string CustomerPhone,
    int PartySize,
    DateTime StartTime);

public sealed record BookingDto(
    Guid Id,
    Guid RestaurantId,
    Guid TableId,
    string CustomerName,
    string CustomerEmail,
    string CustomerPhone,
    int PartySize,
    DateTime StartTime,
    DateTime EndTime,
    DateTime CreatedAt);

public sealed record AvailabilityRequest(
    DateOnly Date,
    int PartySize);

public sealed record TimeSlotDto(
    DateTime Start,
    DateTime End);

public sealed record ErrorResponse(
    string Code,
    string Message);