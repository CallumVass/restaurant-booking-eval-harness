// pattern: Imperative Shell

using RestaurantBooking.Domain;
using RestaurantBooking.Infrastructure;

namespace RestaurantBooking.Features.ListRestaurants;

public static class ListRestaurantsEndpoint
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/restaurants", Handle)
            .WithSummary("List all restaurants");
    }

    public static IResult Handle(DataStore store)
    {
        var restaurants = store.GetAllRestaurants();
        return TypedResults.Ok(restaurants);
    }
}
