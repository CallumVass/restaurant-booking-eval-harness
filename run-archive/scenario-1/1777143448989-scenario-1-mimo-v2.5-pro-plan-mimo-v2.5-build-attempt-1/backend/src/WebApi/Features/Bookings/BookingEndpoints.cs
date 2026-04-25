using Microsoft.AspNetCore.Mvc;
using RestaurantBooking.Domain.Bookings;
using RestaurantBooking.Domain.Common;
using RestaurantBooking.Domain.Restaurants;
using RestaurantBooking.Domain.Tables;

namespace RestaurantBooking.WebApi.Features.Bookings;

public static class BookingEndpoints
{
    public static void MapBookingEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/restaurants/{restaurantId:guid}/bookings").WithTags("Bookings");

        group.MapPost("/", CreateBooking);
        group.MapGet("/", GetBookings);
    }

    private static async Task<IResult> CreateBooking(
        Guid restaurantId,
        [FromBody] CreateBookingApiRequest request,
        [FromServices] IRestaurantRepository restaurantRepo,
        [FromServices] ITableRepository tableRepo,
        [FromServices] IBookingRepository bookingRepo)
    {
        var restaurant = await restaurantRepo.GetByIdAsync(restaurantId);
        if (restaurant is null)
            return Results.NotFound(new BookingsErrorResponse("RestaurantNotFound"));

        var tables = await tableRepo.GetByRestaurantAsync(restaurantId);
        var existingBookings = await bookingRepo.GetByRestaurantAsync(restaurantId, request.Date);

        var domainRequest = new CreateBookingRequest(
            request.CustomerName,
            request.CustomerEmail,
            request.PartySize,
            request.Date,
            request.StartTime);

        var result = BookingDomain.CreateBooking(domainRequest, restaurant, tables, existingBookings);

        if (!result.IsSuccess)
        {
            var (statusCode, errorCode) = result.Error switch
            {
                BookingError.InvalidPartySize => (400, result.Error.ToString()),
                BookingError.InvalidDate => (400, result.Error.ToString()),
                BookingError.InvalidTime => (400, result.Error.ToString()),
                BookingError.NoAvailableTable => (409, result.Error.ToString()),
                BookingError.OverlappingReservation => (409, result.Error.ToString()),
                _ => (400, result.Error.ToString())
            };

            return Results.Json(
                new BookingsErrorResponse(errorCode!),
                statusCode: statusCode);
        }

        var booking = result.Value!;
        await bookingRepo.AddAsync(booking);
        return Results.Created($"/api/restaurants/{restaurantId}/bookings/{booking.Id}",
            new BookingResponse(
                booking.Id,
                booking.RestaurantId,
                booking.TableId,
                booking.CustomerName,
                booking.CustomerEmail,
                booking.PartySize,
                booking.Date,
                booking.StartTime,
                booking.EndTime));
    }

    private static async Task<IResult> GetBookings(
        Guid restaurantId,
        [FromQuery] DateOnly? filterDate,
        [FromServices] IRestaurantRepository restaurantRepo,
        [FromServices] IBookingRepository bookingRepo)
    {
        var restaurant = await restaurantRepo.GetByIdAsync(restaurantId);
        if (restaurant is null)
            return Results.NotFound();

        var bookings = await bookingRepo.GetByRestaurantAsync(restaurantId, filterDate);
        return Results.Ok(bookings.Select(b => new BookingResponse(
            b.Id, b.RestaurantId, b.TableId,
            b.CustomerName, b.CustomerEmail, b.PartySize,
            b.Date, b.StartTime, b.EndTime)));
    }
}

public sealed record CreateBookingApiRequest(
    string CustomerName,
    string CustomerEmail,
    int PartySize,
    DateOnly Date,
    TimeOnly StartTime);

public sealed record BookingResponse(
    Guid Id,
    Guid RestaurantId,
    Guid TableId,
    string CustomerName,
    string CustomerEmail,
    int PartySize,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime);

public sealed record BookingsErrorResponse(string Error);
