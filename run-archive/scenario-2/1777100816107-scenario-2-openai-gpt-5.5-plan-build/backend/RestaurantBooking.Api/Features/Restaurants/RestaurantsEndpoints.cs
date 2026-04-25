// pattern: Imperative Shell

using RestaurantBooking.Api.Infrastructure;

namespace RestaurantBooking.Api.Features.Restaurants;

public static class RestaurantsEndpoints
{
    public static IEndpointRouteBuilder MapRestaurants(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/restaurants", (IBookingStore store) =>
            TypedResults.Ok(store.Restaurants.Select(RestaurantResponse.From).ToArray()))
            .WithName("ListRestaurants")
            .WithTags("Restaurants");

        return app;
    }
}
