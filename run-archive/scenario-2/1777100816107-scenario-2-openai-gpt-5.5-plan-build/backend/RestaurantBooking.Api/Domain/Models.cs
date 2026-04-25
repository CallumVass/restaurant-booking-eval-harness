namespace RestaurantBooking.Api.Domain;

public sealed record Restaurant(string Id, string Name, string Cuisine, string Neighborhood, string Description, IReadOnlyList<Table> Tables);

public sealed record Table(string Id, int Capacity);

public sealed record Booking(string Id, string RestaurantId, string TableId, DateOnly Date, TimeOnly StartTime, int PartySize, string GuestName, string GuestEmail)
{
    public TimeOnly EndTime => StartTime.Add(BookingRules.BookingDuration);
}

public sealed record TimeSlot(TimeOnly StartTime, TimeOnly EndTime, int AvailableTables);

public sealed record Result<T>(T? Value, BookingError? Error)
{
    public bool IsSuccess => Error is null;

    public static Result<T> Success(T value) => new(value, null);

    public static Result<T> Failure(BookingError error) => new(default, error);
}

public sealed record BookingError(string Code, string Message);
