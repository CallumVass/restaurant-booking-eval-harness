// pattern: Imperative Shell

using RestaurantBooking.Api.Domain;
using RestaurantBooking.Api.Infrastructure;

namespace RestaurantBooking.Api.Features.Restaurants;

public static class GetAvailableSlots
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/restaurants/{id:guid}/available-slots", (
            Guid id,
            DateOnly date,
            int partySize,
            IRestaurantStore restaurantStore,
            IBookingStore bookingStore) =>
        {
            var restaurant = restaurantStore.GetById(id);
            if (restaurant is null)
                return Results.NotFound(new { error = $"Restaurant '{id}' not found." });

            if (partySize <= 0)
                return Results.BadRequest(new { error = "Party size must be greater than 0." });

            var bookings = bookingStore.GetByRestaurant(id);
            var slots = SlotFinder.FindAvailableSlots(restaurant, date, partySize, bookings);

            return Results.Ok(slots.Select(s => new AvailableSlotDto(s.StartTime, s.EndTime)));
        })
        .WithName("GetAvailableSlots")
        .WithTags("Restaurants")
        .Produces<List<AvailableSlotDto>>()
        .Produces(404)
        .Produces(400);
    }
}

public record AvailableSlotDto(DateTime StartTime, DateTime EndTime);
