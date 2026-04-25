// pattern: Imperative Shell

using RestaurantBooking.Api.Domain;
using RestaurantBooking.Api.Infrastructure;

namespace RestaurantBooking.Api.Features.Bookings;

public static class GetBooking
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/bookings/{id:guid}", (Guid id, IRestaurantStore restaurantStore, IBookingStore bookingStore) =>
        {
            var booking = bookingStore.GetById(id);
            if (booking is null)
                return Results.NotFound(new BookingErrorDto("BookingNotFound", $"Booking '{id}' not found."));

            var restaurant = restaurantStore.GetById(booking.RestaurantId);
            var tableName = restaurant?.Tables.FirstOrDefault(t => t.Id == booking.TableId)?.Name ?? "Unknown";

            return Results.Ok(new BookingDto(
                booking.Id,
                booking.RestaurantId,
                tableName,
                booking.StartTime,
                booking.EndTime,
                booking.PartySize,
                booking.CustomerName,
                booking.CustomerEmail
            ));
        })
        .WithName("GetBooking")
        .WithTags("Bookings")
        .Produces<BookingDto>()
        .Produces(404);
    }
}
