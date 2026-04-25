namespace RestaurantBooking.Api;

public sealed record RestaurantDto(string Id, string Name, string Description, IReadOnlyList<TableDto> Tables);
public sealed record TableDto(string Id, int Seats);
public sealed record TimeSlotDto(string Time, int DurationMinutes, string TableId);
public sealed record CreateBookingRequest(string TableId, string CustomerName, DateOnly Date, TimeOnly Time, int PartySize);
public sealed record BookingDto(string Id, string RestaurantId, string TableId, string CustomerName, DateOnly Date, TimeOnly Time, int PartySize);
public sealed record ErrorDto(string Code, string Message);