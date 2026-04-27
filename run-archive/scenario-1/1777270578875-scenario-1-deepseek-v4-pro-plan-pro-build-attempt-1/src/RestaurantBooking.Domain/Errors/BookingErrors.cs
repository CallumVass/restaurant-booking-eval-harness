// pattern: Functional Core

namespace RestaurantBooking.Domain.Errors;

public sealed record BookingError(string Code, string Message);

public static class BookingErrors
{
    public static BookingError InvalidPartySize(int size, int? maxCapacity = null) =>
        new(
            "InvalidPartySize",
            size < 1
                ? "Party size must be at least 1."
                : $"Party size {size} exceeds table capacity of {maxCapacity}.");

    public static BookingError InvalidDateTime(string reason) =>
        new("InvalidDateTime", reason);

    public static BookingError RestaurantNotFound(string restaurantId) =>
        new("RestaurantNotFound", $"Restaurant '{restaurantId}' not found.");

    public static BookingError TableNotFound(string tableId) =>
        new("TableNotFound", $"Table '{tableId}' not found.");

    public static BookingError TimeConflict(string tableId, DateTime existingStart, DateTime existingEnd) =>
        new("TimeConflict",
            $"The requested time conflicts with an existing reservation on table {tableId} " +
            $"({existingStart:HH:mm} - {existingEnd:HH:mm}).");

    public static BookingError BookingNotFound(string id) =>
        new("BookingNotFound", $"Booking '{id}' not found.");
}
