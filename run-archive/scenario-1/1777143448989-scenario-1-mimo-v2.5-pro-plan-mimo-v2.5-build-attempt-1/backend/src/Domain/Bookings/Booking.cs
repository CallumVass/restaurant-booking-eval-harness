namespace RestaurantBooking.Domain.Bookings;

public sealed class Booking
{
    public Guid Id { get; init; }
    public Guid RestaurantId { get; init; }
    public Guid TableId { get; init; }
    public required string CustomerName { get; init; }
    public required string CustomerEmail { get; init; }
    public int PartySize { get; init; }
    public DateOnly Date { get; init; }
    public TimeOnly StartTime { get; init; }
    public TimeOnly EndTime { get; init; }
}
