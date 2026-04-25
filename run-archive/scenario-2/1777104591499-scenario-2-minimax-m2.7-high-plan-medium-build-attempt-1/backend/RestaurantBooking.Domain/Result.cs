namespace RestaurantBooking.Domain;

public struct Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public Errors.BookingError? Error { get; }

    private Result(bool isSuccess, T? value, Errors.BookingError? error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public static Result<T> Success(T value) => new(true, value, null);
    public static Result<T> Failure(Errors.BookingError error) => new(false, default, error);
}