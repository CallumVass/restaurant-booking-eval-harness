namespace RestaurantBooking.Api.Dtos;

public sealed record RestaurantDto(
    System.Guid Id,
    string Name,
    string OpeningTime,
    string ClosingTime);

public sealed record BookingDto(
    System.Guid Id,
    System.Guid RestaurantId,
    string RestaurantName,
    System.DateOnly Date,
    string StartTime,
    string EndTime,
    int PartySize,
    string CustomerName);

public sealed record CreateBookingRequest(
    System.Guid RestaurantId,
    System.DateOnly Date,
    System.TimeOnly StartTime,
    int PartySize,
    string CustomerName);
