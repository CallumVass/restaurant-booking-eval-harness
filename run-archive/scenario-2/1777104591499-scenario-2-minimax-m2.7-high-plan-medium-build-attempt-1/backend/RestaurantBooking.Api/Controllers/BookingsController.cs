// pattern: Imperative Shell

using Microsoft.AspNetCore.Mvc;
using RestaurantBooking.Api.DTOs;
using RestaurantBooking.Domain.Entities;
using RestaurantBooking.Domain.Services;

namespace RestaurantBooking.Api.Controllers;

public sealed class BookingsController : ControllerBase
{
    private readonly IRestaurantRepository _restaurantRepo;
    private readonly IBookingRepository _bookingRepo;

    public BookingsController(IRestaurantRepository restaurantRepo, IBookingRepository bookingRepo)
    {
        _restaurantRepo = restaurantRepo;
        _bookingRepo = bookingRepo;
    }

    [HttpPost("api/bookings")]
    [ProducesResponseType(typeof(BookingDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequest request, CancellationToken ct)
    {
        var restaurant = await _restaurantRepo.GetByIdAsync(request.RestaurantId, ct);
        if (restaurant is null)
            return NotFound(new ErrorResponse("RestaurantNotFound", $"Restaurant with ID '{request.RestaurantId}' was not found."));

        Table? table;
        if (request.TableId.HasValue)
        {
            table = restaurant.Tables.FirstOrDefault(t => t.Id == request.TableId.Value);
            if (table is null)
                return NotFound(new ErrorResponse("TableNotFound", $"Table with ID '{request.TableId}' was not found."));
        }
        else
        {
            var suitableTables = restaurant.TablesFor(request.PartySize).ToList();
            if (!suitableTables.Any())
                return BadRequest(new ErrorResponse("InvalidPartySize", $"No tables available for party size {request.PartySize}."));

            var existingBookings = await _bookingRepo.GetByRestaurantAndDateAsync(
                request.RestaurantId,
                DateOnly.FromDateTime(request.StartTime),
                ct);

            var matchedTable = (Domain.Entities.Table?)null;
            foreach (var t in suitableTables)
            {
                if (BookingService.IsSlotAvailable(t, request.StartTime, existingBookings))
                {
                    matchedTable = t;
                    break;
                }
            }

            if (matchedTable is null)
                return BadRequest(new ErrorResponse("SlotNotAvailable", "No tables available for the requested time slot."));

            table = matchedTable;
        }

        var existingForTable = await _bookingRepo.GetByTableAndDateRangeAsync(
            table.Id,
            request.StartTime.AddHours(-1),
            request.StartTime.AddHours(2),
            ct);

        var result = BookingService.CreateBooking(
            restaurant,
            table,
            request.CustomerName,
            request.CustomerEmail,
            request.CustomerPhone,
            request.PartySize,
            request.StartTime,
            existingForTable);

        if (!result.IsSuccess)
        {
            var (code, message) = (result.Error!.Code, result.Error!.Message);
            return code switch
            {
                Domain.Errors.BookingErrorCode.OverlappingReservation =>
                    BadRequest(new ErrorResponse("OverlappingReservation", message)),
                Domain.Errors.BookingErrorCode.InvalidPartySize =>
                    BadRequest(new ErrorResponse("InvalidPartySize", message)),
                Domain.Errors.BookingErrorCode.InvalidDateTime =>
                    BadRequest(new ErrorResponse("InvalidDateTime", message)),
                _ => BadRequest(new ErrorResponse(code.ToString(), message))
            };
        }

        var saved = await _bookingRepo.AddAsync(result.Value!, ct);
        var dto = new BookingDto(
            saved.Id, saved.RestaurantId, saved.TableId,
            saved.CustomerName, saved.CustomerEmail, saved.CustomerPhone,
            saved.PartySize, saved.StartTime, saved.EndTime, saved.CreatedAt);

        return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
    }

    [HttpGet("api/bookings/{id:guid}")]
    [ProducesResponseType(typeof(BookingDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var booking = await _bookingRepo.GetByIdAsync(id, ct);
        if (booking is null)
            return NotFound(new ErrorResponse("BookingNotFound", $"Booking with ID '{id}' was not found."));

        var dto = new BookingDto(
            booking.Id, booking.RestaurantId, booking.TableId,
            booking.CustomerName, booking.CustomerEmail, booking.CustomerPhone,
            booking.PartySize, booking.StartTime, booking.EndTime, booking.CreatedAt);
        return Ok(dto);
    }

    [HttpGet("api/bookings")]
    [ProducesResponseType(typeof(List<BookingDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetBookings(
        [FromQuery] Guid? restaurantId,
        [FromQuery] DateOnly? date,
        CancellationToken ct)
    {
        IReadOnlyList<Domain.Entities.Booking> bookings;

        if (restaurantId.HasValue && date.HasValue)
        {
            bookings = await _bookingRepo.GetByRestaurantAndDateAsync(restaurantId.Value, date.Value, ct);
        }
        else if (restaurantId.HasValue)
        {
            var allBookings = new List<Domain.Entities.Booking>();
            for (var d = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-7)); d <= DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)); d = d.AddDays(1))
            {
                var dayBookings = await _bookingRepo.GetByRestaurantAndDateAsync(restaurantId.Value, d, ct);
                allBookings.AddRange(dayBookings);
            }
            bookings = allBookings;
        }
        else
        {
            bookings = [];
        }

        var dtos = bookings.Select(b => new BookingDto(
            b.Id, b.RestaurantId, b.TableId,
            b.CustomerName, b.CustomerEmail, b.CustomerPhone,
            b.PartySize, b.StartTime, b.EndTime, b.CreatedAt)).ToList();
        return Ok(dtos);
    }
}