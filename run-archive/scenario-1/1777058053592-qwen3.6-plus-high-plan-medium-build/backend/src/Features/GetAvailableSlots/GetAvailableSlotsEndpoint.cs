// pattern: Imperative Shell

using RestaurantBooking.Domain;
using RestaurantBooking.Infrastructure;

namespace RestaurantBooking.Features.GetAvailableSlots;

public static class GetAvailableSlotsEndpoint
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/restaurants/{restaurantId:guid}/slots", Handle)
            .WithSummary("Get available time slots for a restaurant");
    }

    public static IResult Handle(
        Guid restaurantId,
        DateOnly date,
        int partySize,
        DataStore store)
    {
        var restaurant = store.GetRestaurant(restaurantId);
        if (restaurant is null)
            return TypedResults.NotFound(new { error = $"Restaurant {restaurantId} not found" });

        var existingBookings = store.GetBookingsByRestaurant(restaurantId);
        var dateTime = date.ToDateTime(TimeOnly.FromTimeSpan(TimeSpan.FromHours(10)));
        var result = BookingDomain.GetAvailableSlots(restaurant, existingBookings, dateTime, partySize);

        return result.Match<IResult>(
            slots => TypedResults.Ok(slots),
            error => TypedResults.BadRequest(new { error = error.Message }));
    }
}
