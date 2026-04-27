using Microsoft.AspNetCore.Http.HttpResults;
using RestaurantBooking.Domain;
using RestaurantBooking.Infrastructure;

namespace RestaurantBooking.Features.Restaurants.GetSlots;

public static class GetSlotsEndpoint
{
    public static Results<Ok<List<string>>, NotFound<string>, BadRequest<string>> Handle(
        Guid id,
        DateOnly date,
        int partySize,
        InMemoryStore store)
    {
        if (partySize <= 0)
            return TypedResults.BadRequest<string>("Party size must be greater than 0.");

        var restaurant = store.GetRestaurant(id);
        if (restaurant is null)
            return TypedResults.NotFound<string>("Restaurant not found.");

        var tables = store.GetTables(id);
        var bookings = store.GetAllBookings();

        var availableSlots = SlotCalculator.FindAvailableSlots(restaurant, tables, bookings, date, partySize);

        var distinctSlots = availableSlots
            .Select(s => date.ToDateTime(TimeOnly.FromTimeSpan(s.Time), DateTimeKind.Local))
            .Distinct()
            .OrderBy(t => t)
            .Select(t => t.ToString("o"))
            .ToList();

        return TypedResults.Ok(distinctSlots);
    }
}
