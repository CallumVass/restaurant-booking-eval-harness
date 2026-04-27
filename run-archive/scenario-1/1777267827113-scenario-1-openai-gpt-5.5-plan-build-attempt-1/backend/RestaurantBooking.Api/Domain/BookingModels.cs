namespace RestaurantBooking.Api.Domain;

public sealed record Restaurant(string Id, string Name, string Cuisine, string Neighborhood, string Description, IReadOnlyList<Table> Tables);

public sealed record Table(string Id, int Capacity);

public sealed record Booking(string Id, string RestaurantId, string TableId, string GuestName, string GuestEmail, int PartySize, DateOnly Date, TimeOnly StartTime, TimeOnly EndTime);

public sealed record RestaurantDto(string Id, string Name, string Cuisine, string Neighborhood, string Description, int LargestTable, int TableCount);

public sealed record BookingDto(string Id, string RestaurantId, string RestaurantName, string TableId, string GuestName, string GuestEmail, int PartySize, DateOnly Date, TimeOnly StartTime, TimeOnly EndTime);

public sealed record AvailableSlotDto(DateOnly Date, TimeOnly StartTime, TimeOnly EndTime, int TableCapacity);

public sealed record CreateBookingRequest(string RestaurantId, string GuestName, string GuestEmail, int PartySize, DateOnly Date, TimeOnly StartTime);

public enum BookingErrorCode
{
    UnknownRestaurant,
    InvalidPartySize,
    InvalidDate,
    InvalidTime,
    NoCapacity,
    OverlappingReservation,
}

public sealed record BookingError(BookingErrorCode Code, string Message);

public readonly record struct BookingResult<T>(T? Value, BookingError Error, bool IsSuccess)
{
    public static BookingResult<T> Success(T value) => new(value, new BookingError(default, string.Empty), true);

    public static BookingResult<T> Failure(BookingErrorCode code, string message) => new(default, new BookingError(code, message), false);
}
