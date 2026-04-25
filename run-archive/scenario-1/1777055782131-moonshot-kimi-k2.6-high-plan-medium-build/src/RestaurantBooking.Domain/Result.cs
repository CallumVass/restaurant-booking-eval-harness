namespace RestaurantBooking.Domain;

public readonly struct Result<T>
{
    public bool IsSuccess { get; }
    public T Value { get; }
    public BookingError Error { get; }

    private Result(bool isSuccess, T value, BookingError error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public static Result<T> Success(T value) => new(true, value, default);
    public static Result<T> Failure(BookingError error) => new(false, default!, error);
}
