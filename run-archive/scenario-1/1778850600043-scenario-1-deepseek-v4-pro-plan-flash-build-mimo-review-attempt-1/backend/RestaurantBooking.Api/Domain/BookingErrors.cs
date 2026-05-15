namespace RestaurantBooking.Api.Domain;

public abstract record BookingError
{
    private BookingError() { }

    public sealed record RestaurantNotFound(Guid RestaurantId) : BookingError;
    public sealed record InvalidPartySize(int Requested, int MaxCapacity) : BookingError;
    public sealed record InvalidDate(string Reason) : BookingError;
    public sealed record InvalidTime(string Reason) : BookingError;
    public sealed record NoAvailableTable(DateOnly Date, TimeOnly StartTime, int PartySize) : BookingError;
    public sealed record OverlappingBooking : BookingError;
}
