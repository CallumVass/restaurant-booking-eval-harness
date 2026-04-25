// pattern: Imperative Shell

using RestaurantBooking.Api.Domain;
using RestaurantBooking.Api.Infrastructure;

namespace RestaurantBooking.Api.Features;

public static class RestaurantsEndpoints
{
    public static void Map(WebApplication app)
    {
        app.MapGet("/api/restaurants", GetRestaurants)
            .WithTags("Restaurants")
            .Produces<RestaurantSummary[]>(200);
    }

    private static List<RestaurantSummary> GetRestaurants(InMemoryStore store)
    {
        return store.Restaurants.Values
            .Select(r => new RestaurantSummary(
                r.Id,
                r.Name,
                r.Tables.Select(t => t.Capacity).OrderBy(c => c).ToList()))
            .OrderBy(r => r.Id)
            .ToList();
    }
}
