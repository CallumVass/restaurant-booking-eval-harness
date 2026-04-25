using Api.Dtos;
using Api.Infrastructure;
using Domain.Errors;
using Domain.Models;
using Domain.Services;
using Domain.Store;

namespace Api.Endpoints;

public static class BookingEndpoints
{
    public static void MapBookingEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/bookings")
            .WithTags("Bookings");

        group.MapPost("/", async (
            CreateBookingRequest request,
            IBookingStore store,
            CancellationToken ct) =>
        {
            var result = BookingService.BookRestaurant(
                store,
                request.RestaurantId,
                request.GuestName,
                request.GuestEmail,
                request.PartySize,
                request.DateTime);

            if (!result.IsSuccess)
            {
                var errorResponse = MapError(result.Error!);
                return errorResponse;
            }

            var booking = result.Value!;
            store.AddBooking(booking);

            var response = new BookingResponse(
                booking.Id,
                booking.RestaurantId,
                booking.GuestName,
                booking.GuestEmail,
                booking.PartySize,
                booking.DateTime,
                booking.DurationMinutes);

            return TypedResults.Created($"/api/bookings/{response.Id}", response);
        })
        .WithName("CreateBooking");

        group.MapGet("/", (IBookingStore store) =>
        {
            var bookings = store.GetBookings()
                .Select(b => new BookingResponse(
                    b.Id,
                    b.RestaurantId,
                    b.GuestName,
                    b.GuestEmail,
                    b.PartySize,
                    b.DateTime,
                    b.DurationMinutes))
                .ToList();

            return TypedResults.Ok(bookings);
        })
        .WithName("GetBookings");
    }

    private static IResult MapError(BookingError error) => error switch
    {
        BookingError.InvalidPartySize e => TypedResults.BadRequest(new ErrorResponse(e.Message, "INVALID_PARTY_SIZE")),
        BookingError.InvalidDateTime e => TypedResults.BadRequest(new ErrorResponse(e.Message, "INVALID_DATE_TIME")),
        BookingError.RestaurantNotFound e => TypedResults.NotFound(new ErrorResponse(e.Message, "RESTAURANT_NOT_FOUND")),
        BookingError.NoTableAvailable e => TypedResults.BadRequest(new ErrorResponse(e.Message, "NO_TABLE_AVAILABLE")),
        BookingError.BookingConflict e => TypedResults.Conflict(new ErrorResponse(e.Message, "BOOKING_CONFLICT")),
        _ => TypedResults.BadRequest(new ErrorResponse("An unknown error occurred.", "UNKNOWN_ERROR"))
    };
}
