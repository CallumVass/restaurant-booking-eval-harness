namespace RestaurantBooking.Api;

public sealed record RestaurantResponse(Guid Id, string Name, string Cuisine, List<TableResponse> Tables);

public sealed record TableResponse(Guid Id, string Label, int Capacity);

public sealed record AvailabilityResponse(List<TimeSlotResponse> Slots);

public sealed record TimeSlotResponse(string StartTime, string EndTime, int AvailableCapacity);

public sealed record CreateBookingRequest(
    Guid RestaurantId,
    string CustomerName,
    string CustomerEmail,
    string Date,
    string Time,
    int PartySize);

public sealed record BookingResponse(
    Guid Id,
    Guid RestaurantId,
    string RestaurantName,
    string CustomerName,
    string CustomerEmail,
    string Date,
    string StartTime,
    string EndTime,
    int PartySize);

public sealed record ErrorResponse(string Code, string Message);
