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
public class BookingsController : ControllerBase
{
    private readonly DataStore _store;

    public BookingsController(DataStore store)
    {
        _store = store;
    }

    [HttpGet]
    public ActionResult<IReadOnlyList<BookingDto>> GetAll()
    {
        var restaurants = _store.GetRestaurants().ToDictionary(r => r.Id, r => r.Name);
        var dtos = _store.GetBookings()
            .Select(b => new BookingDto(
                b.Id,
                b.RestaurantId,
                restaurants.GetValueOrDefault(b.RestaurantId, "Unknown"),
                b.Date,
                b.StartTime.ToString("HH:mm"),
                b.EndTime.ToString("HH:mm"),
                b.PartySize,
                b.CustomerName))
            .ToList();

        return Ok(dtos);
    }

    [HttpPost]
    public ActionResult<BookingDto> Create(CreateBookingRequest request)
    {
        var restaurant = _store.GetRestaurant(request.RestaurantId);
        var tables = _store.GetTables();
        var bookings = _store.GetBookings();

        var result = AvailabilityService.TryBook(
            restaurant,
            tables,
            bookings,
            request.Date,
            request.StartTime,
            request.PartySize);

        if (!result.IsSuccess)
        {
            return result.Error switch
            {
                BookingError.UnknownRestaurant => Problem(
                    title: "Unknown restaurant",
                    statusCode: StatusCodes.Status400BadRequest),
                BookingError.InvalidPartySize => Problem(
                    title: "Invalid party size",
                    statusCode: StatusCodes.Status400BadRequest),
                BookingError.InvalidDateTime => Problem(
                    title: "Invalid date or time",
                    statusCode: StatusCodes.Status400BadRequest),
                BookingError.NoAvailableTable => Problem(
                    title: "No table available",
                    statusCode: StatusCodes.Status400BadRequest),
                BookingError.OverlappingReservation => Problem(
                    title: "Overlapping reservation",
                    statusCode: StatusCodes.Status409Conflict),
                _ => Problem(
                    title: "Booking failed",
                    statusCode: StatusCodes.Status400BadRequest),
            };
        }

        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            RestaurantId = request.RestaurantId,
            TableId = result.Value.Id,
            Date = request.Date,
            StartTime = request.StartTime,
            EndTime = request.StartTime.AddHours(1),
            PartySize = request.PartySize,
            CustomerName = request.CustomerName,
        };

        _store.AddBooking(booking);

        var restaurantName = restaurant?.Name ?? "Unknown";

        var dto = new BookingDto(
            booking.Id,
            booking.RestaurantId,
            restaurantName,
            booking.Date,
            booking.StartTime.ToString("HH:mm"),
            booking.EndTime.ToString("HH:mm"),
            booking.PartySize,
            booking.CustomerName);

        return CreatedAtAction(nameof(GetAll), dto);
    }
}
