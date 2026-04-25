using System;
using System.Collections.Generic;
using System.Linq;

namespace RestaurantBooking.Domain;

public static class AvailabilityService
{
    public static List<TimeOnly> FindAvailableSlots(
        Restaurant restaurant,
        IEnumerable<Table> tables,
        IEnumerable<Booking> bookings,
        DateOnly date,
        int partySize)
    {
        if (partySize <= 0)
            return [];

        var relevantTables = tables
            .Where(t => t.RestaurantId == restaurant.Id && t.Capacity >= partySize)
            .ToList();

        if (relevantTables.Count == 0)
            return [];

        var slots = new List<TimeOnly>();
        var current = restaurant.OpeningTime;
        while (current < restaurant.ClosingTime)
        {
            var end = current.AddHours(1);
            if (end > restaurant.ClosingTime)
                break;

            bool available = relevantTables.Any(table =>
                !bookings.Any(b =>
                    b.RestaurantId == restaurant.Id
                    && b.TableId == table.Id
                    && b.Date == date
                    && b.StartTime < end
                    && b.EndTime > current));

            if (available)
                slots.Add(current);

            current = end;
        }

        return slots;
    }

    public static Result<Table> TryBook(
        Restaurant? restaurant,
        IEnumerable<Table> tables,
        IEnumerable<Booking> bookings,
        DateOnly date,
        TimeOnly startTime,
        int partySize)
    {
        if (restaurant is null)
            return Result<Table>.Failure(BookingError.UnknownRestaurant);

        if (partySize <= 0)
            return Result<Table>.Failure(BookingError.InvalidPartySize);

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (date < today)
            return Result<Table>.Failure(BookingError.InvalidDateTime);

        if (startTime < restaurant.OpeningTime || startTime >= restaurant.ClosingTime)
            return Result<Table>.Failure(BookingError.InvalidDateTime);

        var endTime = startTime.AddHours(1);
        if (endTime > restaurant.ClosingTime)
            return Result<Table>.Failure(BookingError.InvalidDateTime);

        var candidateTables = tables
            .Where(t => t.RestaurantId == restaurant.Id && t.Capacity >= partySize)
            .OrderBy(t => t.Capacity)
            .ToList();

        if (candidateTables.Count == 0)
            return Result<Table>.Failure(BookingError.NoAvailableTable);

        foreach (var table in candidateTables)
        {
            bool overlaps = bookings.Any(b =>
                b.RestaurantId == restaurant.Id
                && b.TableId == table.Id
                && b.Date == date
                && b.StartTime < endTime
                && b.EndTime > startTime);

            if (!overlaps)
                return Result<Table>.Success(table);
        }

        return Result<Table>.Failure(BookingError.OverlappingReservation);
    }
}
