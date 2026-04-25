namespace RestaurantBooking.Api.Bookings;

public sealed record Restaurant(Guid Id, string Name, string Description, IReadOnlyList<RestaurantTable> Tables);

public sealed record RestaurantTable(Guid Id, string Name, int Capacity);

public sealed record Booking(
    Guid Id,
    Guid RestaurantId,
    Guid TableId,
    string GuestName,
    int PartySize,
    DateTimeOffset StartsAt,
    DateTimeOffset EndsAt);

public sealed record RestaurantSummary(Guid Id, string Name, string Description, int MinPartySize, int MaxPartySize);

public sealed record BookingRequest(Guid RestaurantId, string GuestName, int PartySize, DateTimeOffset StartsAt);

public sealed record BookingConfirmation(
    Guid Id,
    Guid RestaurantId,
    Guid TableId,
    string GuestName,
    int PartySize,
    DateTimeOffset StartsAt,
    DateTimeOffset EndsAt);

public sealed record AvailabilitySlot(DateTimeOffset StartsAt, DateTimeOffset EndsAt, int AvailableTableCount);

public enum BookingErrorCode
{
    UnknownRestaurant,
    InvalidPartySize,
    InvalidDateTime,
    NoAvailability,
    OverlappingReservation
}

public sealed record BookingError(BookingErrorCode Code, string Message);

public sealed record Result<T>(T? Value, BookingError? Error)
{
    public bool IsSuccess => Error is null;

    public static Result<T> Success(T value) => new(value, null);

    public static Result<T> Failure(BookingErrorCode code, string message) => new(default, new BookingError(code, message));
}
