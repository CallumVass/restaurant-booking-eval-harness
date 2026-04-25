namespace RestaurantBooking.Domain;

public sealed record Error(string Code, string Message);

public sealed record Result<T>
{
    private readonly T? _value;
    private readonly Error? _error;

    private Result(T value) { _value = value; }
    private Result(Error error) { _error = error; }

    public bool IsSuccess => _error is null;
    public bool IsFailure => _error is not null;

    public T Value => IsSuccess ? _value! : throw new InvalidOperationException("Cannot access value of a failed result.");
    public Error Error => IsFailure ? _error! : throw new InvalidOperationException("Cannot access error of a successful result.");

    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(Error error) => new(error);
}
