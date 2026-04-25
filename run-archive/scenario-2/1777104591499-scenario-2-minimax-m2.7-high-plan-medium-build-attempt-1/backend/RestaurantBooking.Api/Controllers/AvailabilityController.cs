// pattern: Imperative Shell

using Microsoft.AspNetCore.Mvc;
using RestaurantBooking.Api.DTOs;
using RestaurantBooking.Domain.Services;
using RestaurantBooking.Domain.ValueObjects;

namespace RestaurantBooking.Api.Controllers;

public sealed class AvailabilityController : ControllerBase
{
    private readonly IRestaurantRepository _restaurantRepo;
    private readonly IBookingRepository _bookingRepo;

    public AvailabilityController(IRestaurantRepository restaurantRepo, IBookingRepository bookingRepo)
    {
        _restaurantRepo = restaurantRepo;
        _bookingRepo = bookingRepo;
    }

    [HttpGet("api/restaurants/{id:guid}/availability")]
    [ProducesResponseType(typeof(List<TimeSlotDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAvailability(
        Guid id,
        [FromQuery] DateOnly date,
        [FromQuery] int partySize,
        CancellationToken ct)
    {
        var restaurant = await _restaurantRepo.GetByIdAsync(id, ct);
        if (restaurant is null)
            return NotFound(new ErrorResponse("RestaurantNotFound", $"Restaurant with ID '{id}' was not found."));

        if (partySize <= 0)
            return BadRequest(new ErrorResponse("InvalidPartySize", "Party size must be greater than 0."));

        if (!restaurant.HasTableFor(partySize))
            return BadRequest(new ErrorResponse("InvalidPartySize", $"No tables available for party size {partySize}."));

        var existingBookings = await _bookingRepo.GetByRestaurantAndDateAsync(id, date, ct);
        var slots = BookingService.GetAvailableSlots(restaurant, partySize, date, existingBookings);
        var dtos = slots.Select(s => new TimeSlotDto(s.Start, s.End)).ToList();
        return Ok(dtos);
    }
}