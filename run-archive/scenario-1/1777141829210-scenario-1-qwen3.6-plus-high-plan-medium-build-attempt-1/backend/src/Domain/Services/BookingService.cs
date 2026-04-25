using Domain.Errors;
using Domain.Models;
using Domain.Store;

namespace Domain.Services;

// pattern: Functional Core

public static class BookingService
{
    private const int DefaultDurationMinutes = 60;
    private const int SlotMinutes = 30;
    private const int OpeningHour = 11;
    private const int ClosingHour = 22;

    public static Result<Booking> BookRestaurant(
        IBookingStore store,
        string restaurantId,
        string guestName,
        string guestEmail,
        int partySize,
        DateTime dateTime)
    {
        if (partySize <= 0)
            return Result<Booking>.Failure(
                new BookingError.InvalidPartySize("Party size must be greater than 0."));

        if (dateTime <= DateTime.UtcNow)
            return Result<Booking>.Failure(
                new BookingError.InvalidDateTime("Booking date must be in the future."));

        if (dateTime.Hour < OpeningHour || dateTime.Hour >= ClosingHour)
            return Result<Booking>.Failure(
                new BookingError.InvalidDateTime(
                    $"Restaurant is only open between {OpeningHour}:00 and {ClosingHour}:00."));

        var restaurant = store.GetRestaurant(restaurantId);
        if (restaurant == null)
            return Result<Booking>.Failure(
                new BookingError.RestaurantNotFound($"Restaurant '{restaurantId}' not found."));

        var suitableTables = restaurant.Tables
            .Where(t => t.Capacity >= partySize)
            .OrderBy(t => t.Capacity)
            .ToList();

        if (suitableTables.Count == 0)
            return Result<Booking>.Failure(
                new BookingError.NoTableAvailable(
                    $"No table available for party of {partySize}."));

        var existingBookings = store.GetBookings();

        foreach (var table in suitableTables)
        {
            var hasConflict = existingBookings
                .Where(b => b.RestaurantId == restaurantId && b.TableId == table.Id)
                .Any(b => IsOverlapping(b.DateTime, b.DurationMinutes, dateTime, DefaultDurationMinutes));

            if (!hasConflict)
            {
                var booking = new Booking(
                    Guid.NewGuid().ToString("N"),
                    restaurantId,
                    table.Id,
                    guestName,
                    guestEmail,
                    partySize,
                    dateTime,
                    DefaultDurationMinutes);

                return Result<Booking>.Success(booking);
            }
        }

        return Result<Booking>.Failure(
            new BookingError.BookingConflict(
                "No available table at the requested time. All suitable tables have overlapping reservations."));
    }

    public static IReadOnlyList<TimeSlot> GetAvailableSlots(
        IBookingStore store,
        string restaurantId,
        DateOnly date,
        int partySize)
    {
        var restaurant = store.GetRestaurant(restaurantId);
        if (restaurant == null)
            return Array.Empty<TimeSlot>();

        var suitableTables = restaurant.Tables
            .Where(t => t.Capacity >= partySize)
            .Select(t => t.Id)
            .ToHashSet();

        if (suitableTables.Count == 0)
            return Array.Empty<TimeSlot>();

        var slots = new List<TimeSlot>();
        var existingBookings = store.GetBookings();

        for (int hour = OpeningHour; hour < ClosingHour; hour++)
        {
            for (int minute = 0; minute < 60; minute += SlotMinutes)
            {
                var slotTime = new DateTime(date.Year, date.Month, date.Day, hour, minute, 0, DateTimeKind.Utc);

                if (slotTime <= DateTime.UtcNow)
                    continue;

                bool anyTableAvailable = suitableTables.Any(tableId =>
                    !existingBookings
                        .Where(b => b.RestaurantId == restaurantId && b.TableId == tableId)
                        .Any(b => IsOverlapping(b.DateTime, b.DurationMinutes, slotTime, DefaultDurationMinutes)));

                if (anyTableAvailable)
                {
                    slots.Add(new TimeSlot(slotTime, true));
                }
            }
        }

        return slots;
    }

    public static bool IsOverlapping(
        DateTime existingStart, int existingDuration,
        DateTime newStart, int newDuration)
    {
        var existingEnd = existingStart.AddMinutes(existingDuration);
        var newEnd = newStart.AddMinutes(newDuration);
        return newStart < existingEnd && newEnd > existingStart;
    }
}

public record TimeSlot(DateTime Time, bool IsAvailable);
