namespace RestaurantBooking.Domain;

public record Restaurant(Guid Id, string Name, string Address, IReadOnlyList<Table> Tables);

public record Table(Guid Id, Guid RestaurantId, int Capacity);

public record Booking(
    Guid Id,
    Guid RestaurantId,
    Guid TableId,
    string GuestName,
    string Email,
    int PartySize,
    DateTime StartTime,
    DateTime EndTime);

public record BookingRequest(
    Guid RestaurantId,
    string GuestName,
    string Email,
    int PartySize,
    DateTime StartTime);

public record TimeSlot(DateTime Start, DateTime End, bool IsAvailable);

public record BookingError(string Message)
{
    public static BookingError InvalidPartySize(string msg) => new(msg);
    public static BookingError InvalidDateTime(string msg) => new(msg);
    public static BookingError RestaurantNotFound(Guid id) => new($"Restaurant {id} not found");
    public static BookingError NoTableAvailable(int partySize) => new($"No table available for party of {partySize}");
    public static BookingError TimeSlotConflict(Booking existing) => new($"Time slot conflicts with existing booking {existing.Id}");
}

public readonly struct Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public BookingError? Error { get; }

    private Result(bool isSuccess, T? value, BookingError? error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public static Result<T> Ok(T value) => new(true, value, null);
    public static Result<T> Fail(BookingError error) => new(false, default, error);

    public TResult Match<TResult>(Func<T, TResult> onSuccess, Func<BookingError, TResult> onError) =>
        IsSuccess ? onSuccess(Value!) : onError(Error!);
}
