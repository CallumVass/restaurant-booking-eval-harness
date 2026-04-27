// pattern: Imperative Shell

using RestaurantBooking.Web.Repositories;

namespace RestaurantBooking.Web.Endpoints;

public static class RestaurantEndpoints
{
    public static void MapRestaurantEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/restaurants", GetAll)
            .WithTags("Restaurants")
            .WithName("GetRestaurants")
            .WithOpenApi(o =>
            {
                o.Summary = "List all restaurants";
                o.Description = "Returns all restaurants with their table configurations.";
                return o;
            });

        app.MapGet("/api/restaurants/{id}", GetById)
            .WithTags("Restaurants")
            .WithName("GetRestaurant")
            .WithOpenApi(o =>
            {
                o.Summary = "Get restaurant by ID";
                o.Description = "Returns a single restaurant with its table configuration.";
                return o;
            });
    }

    private static IResult GetAll(InMemoryRestaurantRepository repo)
    {
        var restaurants = repo.GetAll().Select(r => new
        {
            r.Id,
            r.Name,
            r.Cuisine,
            r.Address,
            Tables = r.Tables.Select(t => new
            {
                t.Id,
                t.Capacity,
                t.Label
            }),
            TotalCapacity = r.Tables.Sum(t => t.Capacity),
            TableCount = r.Tables.Count
        });
        return TypedResults.Ok(restaurants);
    }

    private static IResult GetById(string id, InMemoryRestaurantRepository repo)
    {
        var r = repo.GetById(id);
        if (r is null)
            return TypedResults.NotFound(new { error = "Restaurant not found." });

        return TypedResults.Ok(new
        {
            r.Id,
            r.Name,
            r.Cuisine,
            r.Address,
            Tables = r.Tables.Select(t => new
            {
                t.Id,
                t.Capacity,
                t.Label
            }),
            TotalCapacity = r.Tables.Sum(t => t.Capacity),
            TableCount = r.Tables.Count
        });
    }
}
