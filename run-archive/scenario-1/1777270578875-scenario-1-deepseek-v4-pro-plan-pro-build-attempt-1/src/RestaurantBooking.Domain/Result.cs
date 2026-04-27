// pattern: Functional Core

namespace RestaurantBooking.Domain;

public sealed record Result<TValue, TError>
{
    public bool IsSuccess { get; }
    public TValue? Value { get; }
    public TError? Error { get; }

    private Result(bool isSuccess, TValue? value, TError? error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public static Result<TValue, TError> Success(TValue value) => new(true, value, default);
    public static Result<TValue, TError> Failure(TError error) => new(false, default, error);

    public TResult Match<TResult>(Func<TValue, TResult> onSuccess, Func<TError, TResult> onFailure) =>
        IsSuccess ? onSuccess(Value!) : onFailure(Error!);
}

public static class Result
{
    public static Result<TValue, TError> Success<TValue, TError>(TValue value) =>
        Result<TValue, TError>.Success(value);

    public static Result<TValue, TError> Failure<TValue, TError>(TError error) =>
        Result<TValue, TError>.Failure(error);
}
