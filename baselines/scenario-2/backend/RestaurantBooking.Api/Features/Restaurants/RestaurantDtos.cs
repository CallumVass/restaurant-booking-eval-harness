using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Api.Features.Restaurants;

public sealed record RestaurantResponse(string Id, string Name, string Cuisine, string Neighborhood, string Description, IReadOnlyList<TableResponse> Tables)
{
    public static RestaurantResponse From(Restaurant restaurant) => new(
        restaurant.Id,
        restaurant.Name,
        restaurant.Cuisine,
        restaurant.Neighborhood,
        restaurant.Description,
        restaurant.Tables.Select(table => new TableResponse(table.Id, table.Capacity)).ToArray());
}

public sealed record TableResponse(string Id, int Capacity);
