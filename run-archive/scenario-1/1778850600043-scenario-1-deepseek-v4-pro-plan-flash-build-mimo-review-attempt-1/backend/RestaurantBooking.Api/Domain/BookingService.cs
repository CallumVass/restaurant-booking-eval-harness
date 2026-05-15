using RestaurantBooking.Api.Data;
using RestaurantBooking.Api.Dtos;
using RestaurantBooking.Api.Models;

namespace RestaurantBooking.Api.Domain;

public class BookingService(InMemoryStore store)
{
    public (Booking? Booking, BookingError? Error) CreateBooking(CreateBookingRequest request)
    {
        if (!store.Restaurants.TryGetValue(request.RestaurantId, out var restaurant))
            return (null, new BookingError.RestaurantNotFound(request.RestaurantId));

        if (request.PartySize < 1)
            return (null, new BookingError.InvalidPartySize(request.PartySize, 0));

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (request.Date < today)
            return (null, new BookingError.InvalidDate("Date cannot be in the past"));

        if (request.Date > today.AddDays(60))
            return (null, new BookingError.InvalidDate("Date cannot be more than 60 days in the future"));

        var openTime = new TimeOnly(11, 0);
        var closeTime = new TimeOnly(21, 0);
        if (request.StartTime < openTime || request.StartTime > closeTime)
            return (null, new BookingError.InvalidTime("Bookings are available from 11:00 to 21:00"));

        var endTime = request.StartTime.AddHours(1.5);
        if (endTime > new TimeOnly(22, 30))
            return (null, new BookingError.InvalidTime("Booking cannot end after 22:30"));

        // Find tables that can accommodate the party
        var suitableTables = restaurant.Tables
            .Where(t => t.Capacity >= request.PartySize)
            .OrderBy(t => t.Capacity)
            .ToList();

        if (suitableTables.Count == 0)
            return (null, new BookingError.InvalidPartySize(request.PartySize, restaurant.Tables.Max(t => t.Capacity)));

        var maxCapacity = restaurant.Tables.Max(t => t.Capacity);
        if (request.PartySize > maxCapacity)
            return (null, new BookingError.InvalidPartySize(request.PartySize, maxCapacity));

        // Check for overlapping bookings
        var existingForDate = store.Bookings
            .Where(b => b.RestaurantId == request.RestaurantId && b.Date == request.Date)
            .ToList();

        foreach (var table in suitableTables)
        {
            var overlapping = existingForDate.Any(b =>
                b.TableId == table.Id &&
                b.StartTime < endTime &&
                b.EndTime > request.StartTime);

            if (!overlapping)
            {
                var booking = new Booking
                {
                    Id = Guid.NewGuid(),
                    RestaurantId = request.RestaurantId,
                    TableId = table.Id,
                    Date = request.Date,
                    StartTime = request.StartTime,
                    EndTime = endTime,
                    PartySize = request.PartySize,
                    CustomerName = request.CustomerName,
                    CustomerEmail = request.CustomerEmail,
                    Notes = request.Notes,
                    CreatedAtUtc = DateTime.UtcNow
                };

                store.Bookings.Add(booking);
                return (booking, null);
            }
        }

        return (null, new BookingError.NoAvailableTable(request.Date, request.StartTime, request.PartySize));
    }

    public List<AvailableSlotResponse> GetAvailableSlots(Guid restaurantId, DateOnly date, int partySize)
    {
        if (!store.Restaurants.TryGetValue(restaurantId, out var restaurant))
            return [];

        if (partySize < 1) return [];

        var suitableTables = restaurant.Tables
            .Where(t => t.Capacity >= partySize)
            .OrderBy(t => t.Capacity)
            .ToList();

        if (suitableTables.Count == 0) return [];

        var existingForDate = store.Bookings
            .Where(b => b.RestaurantId == restaurantId && b.Date == date)
            .ToList();

        var openTime = new TimeOnly(11, 0);
        var closeTime = new TimeOnly(21, 0);
        var slots = new List<AvailableSlotResponse>();

        var current = openTime;
        while (current <= closeTime)
        {
            var slotEnd = current.AddHours(1.5);
            if (slotEnd > new TimeOnly(22, 30)) break;

            foreach (var table in suitableTables)
            {
                var overlapping = existingForDate.Any(b =>
                    b.TableId == table.Id &&
                    b.StartTime < slotEnd &&
                    b.EndTime > current);

                if (!overlapping)
                {
                    slots.Add(new AvailableSlotResponse(current, slotEnd, table.Capacity));
                    break; // Found a table for this slot, move to next time
                }
            }

            current = current.AddMinutes(30);
        }

        return slots;
    }

    public List<Booking> GetBookingsByEmail(string email)
    {
        return store.Bookings
            .Where(b =>
                b.CustomerEmail.Equals(email, StringComparison.OrdinalIgnoreCase))
            .OrderByDescending(b => b.Date)
            .ThenByDescending(b => b.StartTime)
            .ToList();
    }
}
