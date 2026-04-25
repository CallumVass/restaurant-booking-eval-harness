namespace RestaurantBooking.Domain;

public sealed record Result<T, E>(T? Value, E? Error, bool IsSuccess)
{
    public static Result<T, E> Success(T value) => new(value, default, true);
    public static Result<T, E> Failure(E error) => new(default, error, false);

    public T ValueOrThrow => IsSuccess ? Value! : throw new InvalidOperationException($"Result was failure: {Error}");
}