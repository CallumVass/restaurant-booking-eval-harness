using Backend.Data;
using Backend.Domain;

namespace Backend.Api;

public static class RestaurantsModule
{
    public static IEndpointRouteBuilder MapRestaurantsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/restaurants").WithTags("Restaurants");

        group.MapGet("/", (InMemoryStore store) =>
        {
            var restaurants = store.Restaurants.Values
                .Select(r => new
                {
                    r.Id,
                    r.Name,
                    r.Description,
                    TableCount = r.Tables.Count,
                    MaxCapacity = r.Tables.Max(t => t.Capacity),
                    MinCapacity = r.Tables.Min(t => t.Capacity),
                })
                .ToList();

            return Results.Ok(restaurants);
        })
        .WithName("GetRestaurants")
        .WithSummary("List all restaurants");

        group.MapGet("/{id:guid}", GetRestaurantById);
        group.MapGet("/{id:guid}/slots", GetAvailableSlots);

        return app;
    }

    private static IResult GetRestaurantById(Guid id, InMemoryStore store)
    {
        if (!store.Restaurants.TryGetValue(id, out var restaurant))
            return Results.NotFound(new { error = "Restaurant not found." });

        return Results.Ok(new
        {
            restaurant.Id,
            restaurant.Name,
            restaurant.Description,
            restaurant.Tables,
        });
    }

    private static IResult GetAvailableSlots(Guid id, DateOnly date, int partySize, InMemoryStore store)
    {
        if (!store.Restaurants.TryGetValue(id, out var restaurant))
            return Results.NotFound(new { error = "Restaurant not found.", code = "RESTAURANT_NOT_FOUND" });

        if (partySize is < BookingService.MinPartySize or > BookingService.MaxPartySize)
            return Results.BadRequest(new
            {
                error = $"Party size must be between {BookingService.MinPartySize} and {BookingService.MaxPartySize}.",
                code = "INVALID_PARTY_SIZE"
            });

        var bookings = store.Bookings.Values.ToList();

        var result = BookingService.FindAvailableSlots(
            restaurant.Tables,
            bookings,
            date,
            partySize);

        if (!result.IsSuccess)
            return Results.BadRequest(new { error = result.Error!.Message, code = result.Error.Code });

        var slots = result.Value!;

        return Results.Ok(new
        {
            restaurantId = id,
            date,
            partySize,
            hasAvailableSlots = slots.HasAvailableSlots,
            slots = slots.Slots,
        });
    }
}
