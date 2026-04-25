// pattern: Imperative Shell

using RestaurantBooking.Api.Domain;
using RestaurantBooking.Api.Infrastructure;

namespace RestaurantBooking.Api.Features.Bookings;

public static class CreateBooking
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/bookings", (
            CreateBookingRequest request,
            IRestaurantStore restaurantStore,
            IBookingStore bookingStore,
            TimeProvider timeProvider) =>
        {
            var restaurant = restaurantStore.GetById(request.RestaurantId);
            if (restaurant is null)
                return Results.BadRequest(new BookingErrorDto("UnknownRestaurant", $"Restaurant '{request.RestaurantId}' not found."));

            var now = timeProvider.GetUtcNow().DateTime;
            var timeError = BookingValidator.ValidateBookingTime(request.StartTime, now);
            if (timeError is not null)
                return Results.BadRequest(new BookingErrorDto(timeError.Type.ToString(), timeError.Message));

            if (request.PartySize <= 0)
                return Results.BadRequest(new BookingErrorDto("InvalidPartySize", "Party size must be greater than 0."));

            var existingBookings = bookingStore.GetByRestaurant(request.RestaurantId);
            var endTime = request.StartTime.AddMinutes(BookingValidator.BookingDurationMinutes);

            var table = SlotFinder.FindAvailableTable(restaurant, request.PartySize, existingBookings, request.StartTime, endTime);
            if (table is null)
                return Results.Conflict(new BookingErrorDto("NoTableAvailable", "No table available for the requested party size and time."));

            var booking = new Booking(
                Guid.NewGuid(),
                request.RestaurantId,
                table.Id,
                request.StartTime,
                endTime,
                request.PartySize,
                request.CustomerName,
                request.CustomerEmail
            );

            bookingStore.Add(booking);

            return Results.Created($"/api/bookings/{booking.Id}", new BookingDto(
                booking.Id,
                booking.RestaurantId,
                table.Name,
                booking.StartTime,
                booking.EndTime,
                booking.PartySize,
                booking.CustomerName,
                booking.CustomerEmail
            ));
        })
        .WithName("CreateBooking")
        .WithTags("Bookings")
        .Produces<BookingDto>(201)
        .Produces(400)
        .Produces(409);
    }
}

public record CreateBookingRequest(
    Guid RestaurantId,
    DateTime StartTime,
    int PartySize,
    string CustomerName,
    string CustomerEmail
);

public record BookingDto(
    Guid Id,
    Guid RestaurantId,
    string TableName,
    DateTime StartTime,
    DateTime EndTime,
    int PartySize,
    string CustomerName,
    string CustomerEmail
);

public record BookingErrorDto(string ErrorType, string Message);
