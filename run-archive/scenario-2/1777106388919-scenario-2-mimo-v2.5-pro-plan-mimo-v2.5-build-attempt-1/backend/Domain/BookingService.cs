namespace RestaurantBooking.Domain;

public static class BookingService
{
    public static readonly IReadOnlyList<TimeOnly> AvailableSlots =
    [
        new(12, 0), new(13, 0), new(14, 0),
        new(18, 0), new(19, 0), new(20, 0)
    ];

    public static Result<Booking> CreateBooking(
        IReadOnlyList<Restaurant> restaurants,
        IReadOnlyList<Booking> existingBookings,
        BookingRequest request)
    {
        if (request.PartySize <= 0)
            return Result<Booking>.Failure("Party size must be at least 1.", "INVALID_PARTY_SIZE");

        if (request.PartySize > 20)
            return Result<Booking>.Failure("Party size cannot exceed 20.", "INVALID_PARTY_SIZE");

        var restaurant = restaurants.FirstOrDefault(r => r.Id == request.RestaurantId);
        if (restaurant is null)
            return Result<Booking>.Failure($"Restaurant '{request.RestaurantId}' not found.", "RESTAURANT_NOT_FOUND");

        if (request.Date < DateOnly.FromDateTime(DateTime.UtcNow))
            return Result<Booking>.Failure("Cannot book a date in the past.", "INVALID_DATE");

        if (!AvailableSlots.Contains(request.StartTime))
            return Result<Booking>.Failure(
                $"Invalid time slot. Available slots: {string.Join(", ", AvailableSlots.Select(s => s.ToString("HH:mm")))}",
                "INVALID_TIME_SLOT");

        var endTime = request.StartTime.AddHours(1);

        var suitableTable = FindSuitableTable(restaurant.Tables, existingBookings, request.Date, request.StartTime, endTime, request.PartySize);
        if (suitableTable is null)
            return Result<Booking>.Failure(
                $"No table available for {request.PartySize} guests at {request.StartTime:HH:mm} on {request.Date:yyyy-MM-dd}.",
                "NO_TABLE_AVAILABLE");

        var booking = new Booking
        {
            Id = Guid.NewGuid().ToString("N")[..8],
            RestaurantId = request.RestaurantId,
            TableId = suitableTable.Id,
            CustomerName = request.CustomerName,
            PartySize = request.PartySize,
            Date = request.Date,
            StartTime = request.StartTime,
            EndTime = endTime,
            Status = "Confirmed"
        };

        return Result<Booking>.Success(booking);
    }

    public static IReadOnlyList<TimeSlot> GetAvailableSlots(
        IReadOnlyList<Restaurant> restaurants,
        IReadOnlyList<Booking> existingBookings,
        SlotAvailabilityRequest request)
    {
        var restaurant = restaurants.FirstOrDefault(r => r.Id == request.RestaurantId);
        if (restaurant is null)
            return [];

        if (request.PartySize <= 0)
            return [];

        if (request.Date < DateOnly.FromDateTime(DateTime.UtcNow))
            return [];

        return AvailableSlots.Select(slot =>
        {
            var end = slot.AddHours(1);
            var table = FindSuitableTable(restaurant.Tables, existingBookings, request.Date, slot, end, request.PartySize);
            return new TimeSlot
            {
                Start = slot,
                End = end,
                IsAvailable = table is not null
            };
        }).ToList();
    }

    private static Table? FindSuitableTable(
        IReadOnlyList<Table> tables,
        IReadOnlyList<Booking> existingBookings,
        DateOnly date,
        TimeOnly start,
        TimeOnly end,
        int partySize)
    {
        return tables
            .Where(t => t.Seats >= partySize)
            .OrderBy(t => t.Seats)
            .FirstOrDefault(t =>
                !existingBookings.Any(b =>
                    b.TableId == t.Id &&
                    b.Date == date &&
                    b.StartTime < end &&
                    b.EndTime > start));
    }
}
