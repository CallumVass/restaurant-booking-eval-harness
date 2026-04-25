using RestaurantBooking.Data;
using RestaurantBooking.Domain;

namespace RestaurantBooking.Api;

public static class RestaurantEndpoints
{
    public static IEndpointRouteBuilder MapRestaurantEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/restaurants").WithTags("Restaurants");

        group.MapGet("/", (IRestaurantRepository restaurantRepo, ITableRepository tableRepo) =>
        {
            var restaurants = restaurantRepo.GetAll();
            var allTables = tableRepo.GetAll();

            var dtos = restaurants.Select(r => new RestaurantDto(
                r.Id,
                r.Name,
                r.Description,
                allTables.Where(t => t.RestaurantId == r.Id)
                    .Select(t => new TableDto(t.Id, t.Seats)).ToList()
            )).ToList();

            return Results.Ok(dtos);
        });

        return app;
    }
}