// pattern: Functional Core

namespace RestaurantBooking.Domain;

public abstract record Error(string Code, string Message)
{
    public sealed record InvalidPartySize(string Details)
        : Error("INVALID_PARTY_SIZE", $"Invalid party size: {Details}");

    public sealed record InvalidDateTime(string Details)
        : Error("INVALID_DATE_TIME", $"Invalid date/time: {Details}");

    public sealed record RestaurantNotFound(Guid Id)
        : Error("RESTAURANT_NOT_FOUND", $"Restaurant not found: {Id}");

    public sealed record TableNotFound(Guid RestaurantId, int PartySize)
        : Error("TABLE_NOT_FOUND", $"No suitable table for {PartySize} guests at restaurant {RestaurantId}");

    public sealed record BookingConflict(string Details)
        : Error("BOOKING_CONFLICT", $"Booking conflict: {Details}");

    public sealed record Unknown(string Details)
        : Error("UNKNOWN", Details);
}

public abstract record Result<T>
{
    public sealed record Success(T Value) : Result<T>;
    public sealed record Failure(Error Error) : Result<T>;

    public static implicit operator Result<T>(T value) => new Success(value);
    public static implicit operator Result<T>(Error error) => new Failure(error);
}
