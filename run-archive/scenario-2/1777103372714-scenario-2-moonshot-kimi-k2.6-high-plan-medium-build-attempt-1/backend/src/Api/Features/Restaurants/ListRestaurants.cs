// pattern: Imperative Shell

using Microsoft.AspNetCore.Mvc;
using RestaurantBooking.Api.Domain;
using RestaurantBooking.Api.Infrastructure;

namespace RestaurantBooking.Api.Features.Restaurants;

public static class ListRestaurants
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/restaurants", (IRestaurantStore store) =>
        {
            var restaurants = store.GetAll();
            return Results.Ok(restaurants.Select(r => new RestaurantDto(
                r.Id,
                r.Name,
                r.Description,
                r.Tables.Select(t => new TableDto(t.Id, t.Name, t.Capacity)).ToList()
            )));
        })
        .WithName("ListRestaurants")
        .WithTags("Restaurants")
        .Produces<List<RestaurantDto>>();
    }
}

public record RestaurantDto(Guid Id, string Name, string Description, List<TableDto> Tables);
public record TableDto(Guid Id, string Name, int Capacity);
