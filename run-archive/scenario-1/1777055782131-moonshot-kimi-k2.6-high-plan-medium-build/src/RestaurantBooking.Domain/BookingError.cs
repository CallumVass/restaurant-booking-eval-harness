namespace RestaurantBooking.Domain;

public enum BookingError
{
    UnknownRestaurant,
    InvalidPartySize,
    InvalidDateTime,
    NoAvailableTable,
    OverlappingReservation,
}
