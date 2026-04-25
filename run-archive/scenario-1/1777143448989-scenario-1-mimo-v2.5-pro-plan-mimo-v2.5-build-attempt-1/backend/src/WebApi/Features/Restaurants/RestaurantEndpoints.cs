using Microsoft.AspNetCore.Mvc;
using RestaurantBooking.Domain.Bookings;
using RestaurantBooking.Domain.Common;
using RestaurantBooking.Domain.Restaurants;
using RestaurantBooking.Domain.Tables;

namespace RestaurantBooking.WebApi.Features.Restaurants;

public static class RestaurantEndpoints
{
    public static void MapRestaurantEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/restaurants").WithTags("Restaurants");

        group.MapGet("/", async (IRestaurantRepository repo) =>
        {
            var restaurants = await repo.GetAllAsync();
            return Results.Ok(restaurants.Select(r => new RestaurantResponse(r.Id, r.Name, r.Address, r.MaxPartySize)));
        })
        .WithName("GetRestaurants")
        .WithSummary("List all restaurants")
        .Produces<IReadOnlyList<RestaurantResponse>>();

        group.MapGet("/{id:guid}", async ([FromRoute] Guid id, IRestaurantRepository repo) =>
        {
            var restaurant = await repo.GetByIdAsync(id);
            return restaurant is not null
                ? Results.Ok(new RestaurantResponse(restaurant.Id, restaurant.Name, restaurant.Address, restaurant.MaxPartySize))
                : Results.NotFound();
        })
        .WithName("GetRestaurantById")
        .WithSummary("Get a restaurant by ID")
        .Produces<RestaurantResponse>()
        .Produces(404);

        group.MapGet("/{id:guid}/available-slots", async (
            [FromRoute] Guid id,
            [FromQuery] DateOnly date,
            [FromQuery] int partySize,
            IRestaurantRepository restaurantRepo,
            ITableRepository tableRepo,
            IBookingRepository bookingRepo) =>
        {
            var restaurant = await restaurantRepo.GetByIdAsync(id);
            if (restaurant is null)
                return Results.NotFound();

            var tables = await tableRepo.GetByRestaurantAsync(id);
            var bookings = await bookingRepo.GetByRestaurantAsync(id, date);

            var result = BookingDomain.GetAvailableSlots(
                date, partySize, tables, bookings, restaurant.MaxPartySize);

            return result.Match(
                slots => Results.Ok(slots.Select(s => new SlotResponse(s.StartTime, s.EndTime)).ToList()),
                error => Results.BadRequest(new ErrorResponse(error.ToString())));
        })
        .WithName("GetAvailableSlots")
        .WithSummary("Get available time slots for a restaurant")
        .Produces<List<SlotResponse>>()
        .Produces<ErrorResponse>(400)
        .Produces(404);
    }
}

public sealed record RestaurantResponse(Guid Id, string Name, string Address, int MaxPartySize);
public sealed record SlotResponse(TimeOnly StartTime, TimeOnly EndTime);
public sealed record ErrorResponse(string Error);
