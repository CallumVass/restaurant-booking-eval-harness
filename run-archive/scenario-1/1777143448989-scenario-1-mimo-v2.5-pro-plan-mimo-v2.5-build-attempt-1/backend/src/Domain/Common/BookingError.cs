namespace RestaurantBooking.Domain.Common;

public enum BookingError
{
    InvalidPartySize,
    InvalidDate,
    InvalidTime,
    RestaurantNotFound,
    NoAvailableTable,
    OverlappingReservation,
    TableNotFound
}
