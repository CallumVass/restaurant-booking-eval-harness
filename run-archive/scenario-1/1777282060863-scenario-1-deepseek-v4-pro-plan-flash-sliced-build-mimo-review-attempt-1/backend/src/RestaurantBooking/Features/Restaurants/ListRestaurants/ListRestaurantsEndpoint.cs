using Microsoft.AspNetCore.Http.HttpResults;
using RestaurantBooking.Infrastructure;

namespace RestaurantBooking.Features.Restaurants.ListRestaurants;

public static class ListRestaurantsEndpoint
{
    public static Ok<List<RestaurantResponse>> Handle(InMemoryStore store)
    {
        var restaurants = store.GetAllRestaurants();
        var result = restaurants.Select(r =>
        {
            var tables = store.GetTables(r.Id);
            return new RestaurantResponse(
                r.Id,
                r.Name,
                tables.Select(t => new TableResponse(t.Id, t.Capacity)).ToList());
        }).ToList();

        return TypedResults.Ok(result);
    }
}
