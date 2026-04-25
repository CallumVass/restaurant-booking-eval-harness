using Api.Dtos;
using Api.Infrastructure;
using Domain.Errors;
using Domain.Models;
using Domain.Services;
using Domain.Store;

namespace Api.Endpoints;

public static class RestaurantEndpoints
{
    public static void MapRestaurantEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/restaurants")
            .WithTags("Restaurants");

        group.MapGet("/", (IBookingStore store) =>
        {
            var restaurants = store.GetRestaurants()
                .Select(r => new RestaurantResponse(
                    r.Id,
                    r.Name,
                    r.Description,
                    r.Cuisine,
                    r.Tables.Max(t => t.Capacity)))
                .ToList();

            return TypedResults.Ok(restaurants);
        })
        .WithName("GetRestaurants");

        group.MapGet("/{id}/slots", (string id, DateOnly date, int partySize, IBookingStore store) =>
        {
            var slots = BookingService.GetAvailableSlots(store, id, date, partySize);

            var response = slots
                .Select(s => new TimeSlotResponse(s.Time, s.IsAvailable))
                .ToList();

            return TypedResults.Ok(response);
        })
        .WithName("GetAvailableSlots");
    }
}
