// pattern: Functional Core

namespace RestaurantBooking.Api.Domain;

public static class BookingRules
{
    public static readonly TimeSpan BookingDuration = TimeSpan.FromMinutes(90);

    private static readonly TimeOnly FirstSlot = new(17, 0);
    private static readonly TimeOnly LastSlot = new(21, 0);
    private static readonly TimeSpan SlotStep = TimeSpan.FromMinutes(30);

    public static Result<IReadOnlyList<TimeSlot>> AvailableSlots(Restaurant? restaurant, DateOnly date, int partySize, IReadOnlyCollection<Booking> bookings)
    {
        var validation = ValidateAvailabilityRequest(restaurant, date, partySize);
        if (validation is not null)
        {
            return Result<IReadOnlyList<TimeSlot>>.Failure(validation);
        }

        var slots = GenerateServiceSlots()
            .Select(start =>
            {
                var availableTables = restaurant!.Tables
                    .Where(table => table.Capacity >= partySize)
                    .Count(table => !bookings.Any(booking => booking.RestaurantId == restaurant.Id
                        && booking.TableId == table.Id
                        && booking.Date == date
                        && Overlaps(start, start.Add(BookingDuration), booking.StartTime, booking.EndTime)));

                return new TimeSlot(start, start.Add(BookingDuration), availableTables);
            })
            .Where(slot => slot.AvailableTables > 0)
            .ToArray();

        return Result<IReadOnlyList<TimeSlot>>.Success(slots);
    }

    public static Result<Booking> CreateBooking(Restaurant? restaurant, IReadOnlyCollection<Booking> bookings, DateOnly date, TimeOnly startTime, int partySize, string guestName, string guestEmail)
    {
        var validation = ValidateAvailabilityRequest(restaurant, date, partySize) ?? ValidateStartTime(startTime);
        if (validation is not null)
        {
            return Result<Booking>.Failure(validation);
        }

        var endTime = startTime.Add(BookingDuration);
        var table = restaurant!.Tables
            .Where(table => table.Capacity >= partySize)
            .OrderBy(table => table.Capacity)
            .FirstOrDefault(table => !bookings.Any(booking => booking.RestaurantId == restaurant.Id
                && booking.TableId == table.Id
                && booking.Date == date
                && Overlaps(startTime, endTime, booking.StartTime, booking.EndTime)));

        if (table is null)
        {
            return Result<Booking>.Failure(new BookingError("overlapping_reservation", "No table is available for the requested time."));
        }

        var booking = new Booking(
            Id: $"BK-{date:yyyyMMdd}-{restaurant.Id.ToUpperInvariant()}-{startTime:HHmm}-{bookings.Count + 1:000}",
            RestaurantId: restaurant.Id,
            TableId: table.Id,
            Date: date,
            StartTime: startTime,
            PartySize: partySize,
            GuestName: guestName.Trim(),
            GuestEmail: guestEmail.Trim());

        return Result<Booking>.Success(booking);
    }

    private static BookingError? ValidateAvailabilityRequest(Restaurant? restaurant, DateOnly date, int partySize)
    {
        if (restaurant is null)
        {
            return new BookingError("unknown_restaurant", "Restaurant was not found.");
        }

        if (partySize is < 1 or > 12)
        {
            return new BookingError("invalid_party_size", "Party size must be between 1 and 12.");
        }

        if (date < new DateOnly(2026, 1, 1) || date > new DateOnly(2026, 12, 31))
        {
            return new BookingError("invalid_date", "Bookings are available only during the 2026 service calendar.");
        }

        if (restaurant.Tables.All(table => table.Capacity < partySize))
        {
            return new BookingError("party_too_large", "No table can seat that party size.");
        }

        return null;
    }

    private static BookingError? ValidateStartTime(TimeOnly startTime)
    {
        var valid = GenerateServiceSlots().Contains(startTime);
        return valid ? null : new BookingError("invalid_time", "Start time must match an available service slot.");
    }

    private static IEnumerable<TimeOnly> GenerateServiceSlots()
    {
        for (var slot = FirstSlot; slot <= LastSlot; slot = slot.Add(SlotStep))
        {
            yield return slot;
        }
    }

    private static bool Overlaps(TimeOnly requestedStart, TimeOnly requestedEnd, TimeOnly existingStart, TimeOnly existingEnd) =>
        requestedStart < existingEnd && requestedEnd > existingStart;
}
