namespace RestaurantBooking.Api.Models;

public class Booking
{
    public required Guid Id { get; init; }
    public required Guid RestaurantId { get; init; }
    public required Guid TableId { get; init; }
    public required DateOnly Date { get; init; }
    public required TimeOnly StartTime { get; init; }
    public required TimeOnly EndTime { get; init; }
    public required int PartySize { get; init; }
    public required string CustomerName { get; init; }
    public required string CustomerEmail { get; init; }
    public string? Notes { get; init; }
    public required DateTime CreatedAtUtc { get; init; }
}
