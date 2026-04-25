// pattern: Functional Core

namespace RestaurantBooking.Api.Domain;

public enum BookingErrorType
{
    UnknownRestaurant,
    UnknownTable,
    InvalidPartySize,
    InvalidDateTime,
    NoTableAvailable,
    OverlappingReservation,
    BookingNotFound
}

public record BookingError(BookingErrorType Type, string Message);

public static class BookingErrors
{
    public static BookingError UnknownRestaurant(Guid id) =>
        new(BookingErrorType.UnknownRestaurant, $"Restaurant '{id}' not found.");

    public static BookingError UnknownTable(Guid id) =>
        new(BookingErrorType.UnknownTable, $"Table '{id}' not found.");

    public static BookingError InvalidPartySize(string reason) =>
        new(BookingErrorType.InvalidPartySize, reason);

    public static BookingError InvalidDateTime(string reason) =>
        new(BookingErrorType.InvalidDateTime, reason);

    public static BookingError NoTableAvailable() =>
        new(BookingErrorType.NoTableAvailable, "No table available for the requested party size and time.");

    public static BookingError OverlappingReservation() =>
        new(BookingErrorType.OverlappingReservation, "The requested time slot overlaps with an existing reservation.");

    public static BookingError BookingNotFound(Guid id) =>
        new(BookingErrorType.BookingNotFound, $"Booking '{id}' not found.");
}
