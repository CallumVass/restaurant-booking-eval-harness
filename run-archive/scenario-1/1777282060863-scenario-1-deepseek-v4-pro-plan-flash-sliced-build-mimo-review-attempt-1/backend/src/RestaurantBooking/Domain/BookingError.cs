namespace RestaurantBooking.Domain;

public enum BookingError
{
    InvalidPartySize,
    InvalidDateTime,
    RestaurantNotFound,
    OverlapConflict
}
