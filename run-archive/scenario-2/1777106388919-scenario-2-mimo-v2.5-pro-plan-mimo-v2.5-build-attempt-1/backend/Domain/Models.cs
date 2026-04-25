namespace RestaurantBooking.Domain;

public sealed record Restaurant
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public required string Address { get; init; }
    public required IReadOnlyList<Table> Tables { get; init; }
}

public sealed record Table
{
    public required string Id { get; init; }
    public required string RestaurantId { get; init; }
    public required int Seats { get; init; }
}

public sealed record Booking
{
    public required string Id { get; init; }
    public required string RestaurantId { get; init; }
    public required string TableId { get; init; }
    public required string CustomerName { get; init; }
    public required int PartySize { get; init; }
    public required DateOnly Date { get; init; }
    public required TimeOnly StartTime { get; init; }
    public required TimeOnly EndTime { get; init; }
    public required string Status { get; init; }
}

public sealed record TimeSlot
{
    public required TimeOnly Start { get; init; }
    public required TimeOnly End { get; init; }
    public required bool IsAvailable { get; init; }
}

public sealed record RestaurantDto
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public required string Address { get; init; }
    public required IReadOnlyList<TableDto> Tables { get; init; }
}

public sealed record TableDto
{
    public required string Id { get; init; }
    public required int Seats { get; init; }
}

public sealed record BookingRequest
{
    public required string RestaurantId { get; init; }
    public required string CustomerName { get; init; }
    public required int PartySize { get; init; }
    public required DateOnly Date { get; init; }
    public required TimeOnly StartTime { get; init; }
}

public sealed record BookingDto
{
    public required string Id { get; init; }
    public required string RestaurantId { get; init; }
    public required string TableId { get; init; }
    public required string CustomerName { get; init; }
    public required int PartySize { get; init; }
    public required DateOnly Date { get; init; }
    public required TimeOnly StartTime { get; init; }
    public required TimeOnly EndTime { get; init; }
    public required string Status { get; init; }
}

public sealed record ErrorResponse
{
    public required string Error { get; init; }
    public required string Code { get; init; }
}

public sealed record SlotAvailabilityRequest
{
    public required string RestaurantId { get; init; }
    public required DateOnly Date { get; init; }
    public required int PartySize { get; init; }
}
