namespace RestaurantBooking.Domain;

public abstract record BookingError
{
    public sealed record UnknownRestaurant(string RestaurantId) : BookingError;
    public sealed record InvalidPartySize(int PartySize) : BookingError;
    public sealed record InvalidDate(string Reason) : BookingError;
    public sealed record InvalidTimeSlot(string Reason) : BookingError;
    public sealed record OverlappingReservation(string TableId, TimeOnly Time, DateOnly Date) : BookingError;
    public sealed record NoTablesAvailable() : BookingError;
}