// pattern: Imperative Shell

using RestaurantBooking.Domain;
using RestaurantBooking.Infrastructure;

namespace RestaurantBooking.Features.Restaurants;

public static class ListRestaurants
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/restaurants", async Task<IResult> (HttpContext httpContext) =>
        {
            var store = httpContext.RequestServices.GetRequiredService<IRestaurantStore>();
            var restaurants = store.GetAll();
            var result = restaurants.Select(r => new RestaurantResponse
            (
                r.Id,
                r.Name,
                r.Description,
                r.Cuisine,
                r.Tables.Count,
                r.Tables.Min(t => t.Capacity),
                r.Tables.Max(t => t.Capacity)
            ));
            return TypedResults.Ok(result);
        })
        .WithName("ListRestaurants")
        .WithTags("Restaurants")
        .Produces<IEnumerable<RestaurantResponse>>();
    }
}

public record RestaurantResponse(Guid Id, string Name, string Description, string Cuisine,
    int TableCount, int MinCapacity, int MaxCapacity);
