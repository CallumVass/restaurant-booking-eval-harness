namespace RestaurantBooking.Domain;

public record Restaurant(
    string Id,
    string Name,
    string Address,
    string CuisineType,
    TimeOnly OpeningTime,
    TimeOnly ClosingTime);

public record Table(
    string Id,
    string RestaurantId,
    int Seats,
    string Location);

public record Booking(
    string Id,
    string RestaurantId,
    string TableId,
    string CustomerName,
    int PartySize,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    DateTime CreatedAt);

public record TimeSlot(TimeOnly StartTime, TimeOnly EndTime);

public record AvailableSlot(
    TimeSlot Slot,
    string TableId,
    string TableLocation,
    int TableSeats);

public enum BookingError
{
    InvalidPartySize,
    InvalidDate,
    InvalidTimeSlot,
    RestaurantNotFound,
    NoAvailableTable,
    OverlappingReservation
}

public record Result<T>
{
    public bool IsSuccess { get; init; }
    public T? Value { get; init; }
    public BookingError? Error { get; init; }

    public static Result<T> Success(T value) => new() { IsSuccess = true, Value = value };
    public static Result<T> Failure(BookingError error) => new() { IsSuccess = false, Error = error };
}

public record BookingRequest(
    string RestaurantId,
    string CustomerName,
    int PartySize,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime);
