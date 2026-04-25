// pattern: Imperative Shell

using RestaurantBooking.Domain;
using RestaurantBooking.Infrastructure;

namespace RestaurantBooking.Features.CreateBooking;

public static class CreateBookingEndpoint
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/bookings", Handle)
            .WithSummary("Create a new booking");
    }

    public static async Task<IResult> Handle(
        BookingRequest request,
        DataStore store,
        CancellationToken ct)
    {
        var restaurant = store.GetRestaurant(request.RestaurantId);
        if (restaurant is null)
            return TypedResults.NotFound(new { error = $"Restaurant {request.RestaurantId} not found" });

        var existingBookings = store.GetBookingsByRestaurant(request.RestaurantId);
        var result = BookingDomain.CreateBooking(restaurant, existingBookings, request, DateTime.UtcNow);

        return result.Match<IResult>(
            booking =>
            {
                store.AddBooking(booking);
                return TypedResults.Created($"/api/bookings/{booking.Id}", booking);
            },
            error =>
            {
                var message = error.Message;
                if (message.Contains("Time slot conflicts"))
                    return TypedResults.Conflict(new { error = message });

                return TypedResults.BadRequest(new { error = message });
            });
    }
}
