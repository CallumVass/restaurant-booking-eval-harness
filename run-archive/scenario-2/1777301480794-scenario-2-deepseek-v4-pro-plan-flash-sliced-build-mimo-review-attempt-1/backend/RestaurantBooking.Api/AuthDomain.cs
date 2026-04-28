// pattern: Functional Core

namespace RestaurantBooking.Api;

public sealed record AuthUser(string Id, string Email, string DisplayName, string PasswordHash);

public sealed record UserInfo(string Id, string Email, string DisplayName);

public enum AuthError
{
    DuplicateEmail,
    InvalidCredentials,
}

public sealed record AuthResult<T>(T? Value, AuthError? Error, string? Message)
{
    public bool IsSuccess => Error is null;

    public static AuthResult<T> Success(T value) => new(value, null, null);

    public static AuthResult<T> Failure(AuthError error, string message) => new(default, error, message);
}
