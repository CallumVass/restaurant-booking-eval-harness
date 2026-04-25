// pattern: Functional Core

using RestaurantBooking.Domain.Entities;
using RestaurantBooking.Domain.Errors;
using RestaurantBooking.Domain.ValueObjects;

namespace RestaurantBooking.Domain.Services;

public sealed class BookingService
{
    private const int DefaultSlotDurationMinutes = 90;

    public static Result<Booking> CreateBooking(
        Restaurant restaurant,
        Table table,
        string customerName,
        string customerEmail,
        string customerPhone,
        int partySize,
        DateTime startTime,
        IEnumerable<Booking> existingBookings)
    {
        if (restaurant.Id != table.RestaurantId)
            return Result<Booking>.Failure(BookingError.TableNotFound(table.Id));

        if (partySize > table.Capacity)
            return Result<Booking>.Failure(BookingError.InvalidPartySize(partySize, table.Capacity));

        if (startTime < DateTime.UtcNow)
            return Result<Booking>.Failure(BookingError.InvalidDateTime("Cannot book in the past."));

        if (startTime.Minute != 0 && startTime.Minute != 30)
            return Result<Booking>.Failure(BookingError.InvalidDateTime("Reservations must start on the hour or half-hour."));

        var slot = TimeSlot.FromDateTime(startTime, DefaultSlotDurationMinutes);

        foreach (var existing in existingBookings)
        {
            if (existing.TableId != table.Id)
                continue;

            var existingSlot = new TimeSlot(existing.StartTime, existing.EndTime);
            if (slot.Overlaps(existingSlot))
                return Result<Booking>.Failure(BookingError.OverlappingReservation(
                    existing.Id, existing.StartTime, existing.EndTime));
        }

        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            RestaurantId = restaurant.Id,
            TableId = table.Id,
            CustomerName = customerName,
            CustomerEmail = customerEmail,
            CustomerPhone = customerPhone,
            PartySize = partySize,
            StartTime = slot.Start,
            EndTime = slot.End,
            CreatedAt = DateTime.UtcNow
        };

        return Result<Booking>.Success(booking);
    }

    public static bool IsSlotAvailable(
        Table table,
        DateTime requestedStart,
        IEnumerable<Booking> existingBookings)
    {
        var slot = TimeSlot.FromDateTime(requestedStart, DefaultSlotDurationMinutes);
        foreach (var existing in existingBookings)
        {
            if (existing.TableId != table.Id)
                continue;

            var existingSlot = new TimeSlot(existing.StartTime, existing.EndTime);
            if (slot.Overlaps(existingSlot))
                return false;
        }
        return true;
    }

    public static IReadOnlyList<TimeSlot> GetAvailableSlots(
        Restaurant restaurant,
        int partySize,
        DateOnly date,
        IEnumerable<Booking> existingBookings,
        int slotDurationMinutes = 90,
        int openingHour = 11,
        int closingHour = 22)
    {
        var slots = new List<TimeSlot>();
        var startOfDay = date.ToDateTime(TimeOnly.FromTimeSpan(TimeSpan.FromHours(openingHour)));

        for (var time = startOfDay; time.Hour < closingHour; time = time.AddMinutes(slotDurationMinutes))
        {
            var slot = TimeSlot.FromDateTime(time, slotDurationMinutes);
            if (time < DateTime.UtcNow)
                continue;

            foreach (var table in restaurant.TablesFor(partySize))
            {
                if (IsSlotAvailable(table, time, existingBookings))
                {
                    slots.Add(slot);
                    break;
                }
            }
        }

        return slots;
    }
}