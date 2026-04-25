namespace RestaurantBooking.Domain.Common;

public sealed class Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public BookingError Error { get; }

    private Result(T value)
    {
        IsSuccess = true;
        Value = value;
        Error = default;
    }

    private Result(BookingError error)
    {
        IsSuccess = false;
        Value = default;
        Error = error;
    }

    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(BookingError error) => new(error);

    public TResult Match<TResult>(Func<T, TResult> onSuccess, Func<BookingError, TResult> onFailure) =>
        IsSuccess ? onSuccess(Value!) : onFailure(Error);
}
