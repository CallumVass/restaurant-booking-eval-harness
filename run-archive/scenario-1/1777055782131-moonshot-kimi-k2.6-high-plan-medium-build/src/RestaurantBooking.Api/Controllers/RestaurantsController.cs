namespace RestaurantBooking.Api.Controllers;

using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RestaurantBooking.Api.Data;
using RestaurantBooking.Api.Dtos;
using RestaurantBooking.Domain;

[ApiController]
[Route("api/[controller]")]
public class RestaurantsController : ControllerBase
{
    private readonly DataStore _store;

    public RestaurantsController(DataStore store)
    {
        _store = store;
    }

    [HttpGet]
    public ActionResult<IReadOnlyList<RestaurantDto>> GetAll()
    {
        var dtos = _store.GetRestaurants()
            .Select(r => new RestaurantDto(
                r.Id,
                r.Name,
                r.OpeningTime.ToString("HH:mm"),
                r.ClosingTime.ToString("HH:mm")))
            .ToList();

        return Ok(dtos);
    }

    [HttpGet("{id:guid}/slots")]
    public ActionResult<List<string>> GetAvailableSlots(
        Guid id,
        [FromQuery] DateOnly date,
        [FromQuery] int partySize)
    {
        var restaurant = _store.GetRestaurant(id);
        if (restaurant is null)
            return NotFound();

        var tables = _store.GetTablesForRestaurant(id);
        var bookings = _store.GetBookings();

        var slots = AvailabilityService.FindAvailableSlots(
            restaurant, tables, bookings, date, partySize);

        return Ok(slots.Select(s => s.ToString("HH:mm")).ToList());
    }
}
