namespace RestaurantBooking.Domain.Errors;

public enum BookingErrorCode
{
    RestaurantNotFound,
    TableNotFound,
    InvalidPartySize,
    InvalidDateTime,
    SlotNotAvailable,
    OverlappingReservation,
    TableTooSmall
}

public sealed class BookingError
{
    public BookingErrorCode Code { get; }
    public string Message { get; }

    private BookingError(BookingErrorCode code, string message)
    {
        Code = code;
        Message = message;
    }

    public static BookingError RestaurantNotFound(Guid id) =>
        new(BookingErrorCode.RestaurantNotFound, $"Restaurant with ID '{id}' was not found.");

    public static BookingError TableNotFound(Guid id) =>
        new(BookingErrorCode.TableNotFound, $"Table with ID '{id}' was not found.");

    public static BookingError InvalidPartySize(int partySize, int maxCapacity) =>
        new(BookingErrorCode.InvalidPartySize, $"Party size {partySize} exceeds table capacity {maxCapacity}.");

    public static BookingError InvalidDateTime(string reason) =>
        new(BookingErrorCode.InvalidDateTime, $"Invalid date/time: {reason}.");

    public static BookingError SlotNotAvailable(DateTime dateTime) =>
        new(BookingErrorCode.SlotNotAvailable, $"No tables available for the requested time slot at {dateTime:g}.");

    public static BookingError OverlappingReservation(Guid existingBookingId, DateTime existingStart, DateTime existingEnd) =>
        new(BookingErrorCode.OverlappingReservation, $"Time slot overlaps with existing booking '{existingBookingId}' ({existingStart:g} - {existingEnd:g}).");

    public static BookingError TableTooSmall(int partySize, int tableCapacity) =>
        new(BookingErrorCode.TableTooSmall, $"Table capacity {tableCapacity} is too small for party size {partySize}.");
}