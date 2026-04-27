using Backend.Domain;

namespace Backend.UseCases;

public static class BookingService
{
    public const double BookingDurationHours = 1.5;
    public static readonly TimeOnly OpenTime = new(11, 0);
    public static readonly TimeOnly LastSeatingTime = new(20, 30);

    public static List<TimeOnly> GetAvailableSlots(
        string restaurantId,
        DateOnly date,
        int partySize,
        Table[] allTables,
        Booking[] allBookings)
    {
        if (partySize <= 0)
            return [];

        var restaurantTables = allTables.Where(t => t.RestaurantId == restaurantId).ToArray();
        if (restaurantTables.Length == 0)
            return [];

        var restaurantBookings = allBookings
            .Where(b => b.RestaurantId == restaurantId && DateOnly.FromDateTime(b.DateTime) == date)
            .ToArray();

        var slots = new List<TimeOnly>();
        var time = OpenTime;

        while (time <= LastSeatingTime)
        {
            var slotStart = date.ToDateTime(time);
            var slotEnd = slotStart.AddHours(BookingDurationHours);

            var tableAvailable = restaurantTables
                .Where(t => t.Capacity >= partySize)
                .OrderBy(t => t.Capacity)
                .Any(table => !restaurantBookings.Any(b =>
                    b.TableId == table.Id &&
                    b.DateTime < slotEnd &&
                    slotStart < b.DateTime.Add(b.Duration)));

            if (tableAvailable)
                slots.Add(time);

            time = time.AddMinutes(30);
        }

        return slots;
    }

    public static Result<Booking> CreateBooking(
        string restaurantId,
        CreateBookingRequest request,
        Table[] allTables,
        Booking[] allBookings,
        DateTime now)
    {
        if (request.PartySize <= 0)
            return Result<Booking>.Failure("Party size must be at least 1");

        var restaurantTables = allTables.Where(t => t.RestaurantId == restaurantId).ToArray();
        if (restaurantTables.Length == 0)
            return Result<Booking>.Failure("Restaurant not found");

        if (request.DateTime <= now)
            return Result<Booking>.Failure("Booking must be in the future");

        var timeOnly = TimeOnly.FromDateTime(request.DateTime);
        if (timeOnly < OpenTime || timeOnly > LastSeatingTime)
            return Result<Booking>.Failure("Booking time must be between 11:00 and 20:30");

        var suitableTables = restaurantTables
            .Where(t => t.Capacity >= request.PartySize)
            .OrderBy(t => t.Capacity)
            .ToArray();

        var bookingStart = request.DateTime;
        var bookingEnd = bookingStart.AddHours(BookingDurationHours);

        foreach (var table in suitableTables)
        {
            var conflict = allBookings.Any(b =>
                b.RestaurantId == restaurantId &&
                b.TableId == table.Id &&
                b.DateTime < bookingEnd &&
                bookingStart < b.DateTime.Add(b.Duration));

            if (!conflict)
            {
                var booking = new Booking(
                    Guid.NewGuid().ToString(),
                    restaurantId,
                    table.Id,
                    request.GuestName,
                    request.GuestEmail,
                    request.PartySize,
                    request.DateTime,
                    TimeSpan.FromHours(BookingDurationHours));

                return Result<Booking>.Success(booking);
            }
        }

        return Result<Booking>.Failure("No table available for the requested party size and time");
    }
}
