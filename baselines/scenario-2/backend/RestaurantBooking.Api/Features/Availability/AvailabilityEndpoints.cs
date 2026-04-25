// pattern: Imperative Shell

using RestaurantBooking.Api.Domain;
using RestaurantBooking.Api.Infrastructure;

namespace RestaurantBooking.Api.Features.Availability;

public static class AvailabilityEndpoints
{
    public static IEndpointRouteBuilder MapAvailability(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/restaurants/{restaurantId}/availability", (string restaurantId, DateOnly date, int partySize, IBookingStore store) =>
        {
            var restaurant = store.Restaurants.SingleOrDefault(candidate => candidate.Id == restaurantId);
            var result = BookingRules.AvailableSlots(restaurant, date, partySize, store.Bookings);
            return result.IsSuccess
                ? Results.Ok(result.Value!.Select(SlotResponse.From).ToArray())
                : ProblemMapper.ToProblem(result.Error!);
        })
        .WithName("ListAvailability")
        .WithTags("Availability");

        return app;
    }
}
