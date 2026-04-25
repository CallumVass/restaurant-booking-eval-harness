// pattern: Imperative Shell

using Microsoft.AspNetCore.Mvc;
using RestaurantBooking.Api.DTOs;
using RestaurantBooking.Domain.Services;

namespace RestaurantBooking.Api.Controllers;

public sealed class RestaurantsController : ControllerBase
{
    private readonly IRestaurantRepository _restaurantRepo;

    public RestaurantsController(IRestaurantRepository restaurantRepo)
    {
        _restaurantRepo = restaurantRepo;
    }

    [HttpGet("api/restaurants")]
    [ProducesResponseType(typeof(List<RestaurantDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var restaurants = await _restaurantRepo.GetAllAsync(ct);
        var dtos = restaurants.Select(r => new RestaurantDto(
            r.Id, r.Name, r.Description, r.Address,
            r.Tables.Select(t => new TableDto(t.Id, t.TableNumber, t.Capacity)).ToList()
        )).ToList();
        return Ok(dtos);
    }

    [HttpGet("api/restaurants/{id:guid}")]
    [ProducesResponseType(typeof(RestaurantDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var restaurant = await _restaurantRepo.GetByIdAsync(id, ct);
        if (restaurant is null)
            return NotFound(new ErrorResponse("RestaurantNotFound", $"Restaurant with ID '{id}' was not found."));

        var dto = new RestaurantDto(
            restaurant.Id, restaurant.Name, restaurant.Description, restaurant.Address,
            restaurant.Tables.Select(t => new TableDto(t.Id, t.TableNumber, t.Capacity)).ToList()
        );
        return Ok(dto);
    }

    [HttpGet("api/restaurants/{id:guid}/tables")]
    [ProducesResponseType(typeof(List<TableDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTables(Guid id, CancellationToken ct)
    {
        var restaurant = await _restaurantRepo.GetByIdAsync(id, ct);
        if (restaurant is null)
            return NotFound(new ErrorResponse("RestaurantNotFound", $"Restaurant with ID '{id}' was not found."));

        var dtos = restaurant.Tables.Select(t => new TableDto(t.Id, t.TableNumber, t.Capacity)).ToList();
        return Ok(dtos);
    }
}