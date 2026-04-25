namespace Domain.Errors;

public abstract record BookingError(string Message)
{
    public sealed record InvalidPartySize(string Message) : BookingError(Message);
    public sealed record InvalidDateTime(string Message) : BookingError(Message);
    public sealed record RestaurantNotFound(string Message) : BookingError(Message);
    public sealed record NoTableAvailable(string Message) : BookingError(Message);
    public sealed record BookingConflict(string Message) : BookingError(Message);
}
