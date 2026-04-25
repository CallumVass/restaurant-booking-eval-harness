using Backend.Data;
using Backend.Domain;

namespace Backend.Api;

public record CreateBookingRequest(
    Guid RestaurantId,
    Guid TableId,
    DateOnly Date,
    TimeOnly StartTime,
    int PartySize,
    string GuestName
);

public static class BookingsModule
{
    public static IEndpointRouteBuilder MapBookingsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/bookings").WithTags("Bookings");

        group.MapGet("/", GetBookings);
        group.MapGet("/{id:guid}", GetBookingById);
        group.MapPost("/", CreateBooking);

        return app;
    }

    private static IResult GetBookings(InMemoryStore store, DateOnly? date)
    {
        var bookings = store.Bookings.Values
            .Where(b => date is null || b.Date == date)
            .Select(b =>
            {
                store.Restaurants.TryGetValue(b.RestaurantId, out var restaurant);
                return new
                {
                    b.Id,
                    b.RestaurantId,
                    RestaurantName = restaurant?.Name ?? "Unknown",
                    b.TableId,
                    b.Date,
                    b.StartTime,
                    b.PartySize,
                    b.GuestName,
                    b.CreatedAt,
                };
            })
            .OrderBy(b => b.Date)
            .ThenBy(b => b.StartTime)
            .ToList();

        return Results.Ok(bookings);
    }

    private static IResult GetBookingById(Guid id, InMemoryStore store)
    {
        if (!store.Bookings.TryGetValue(id, out var booking))
            return Results.NotFound(new { error = "Booking not found." });

        store.Restaurants.TryGetValue(booking.RestaurantId, out var restaurant);

        return Results.Ok(new
        {
            booking.Id,
            booking.RestaurantId,
            RestaurantName = restaurant?.Name ?? "Unknown",
            booking.TableId,
            booking.Date,
            booking.StartTime,
            booking.PartySize,
            booking.GuestName,
            booking.CreatedAt,
        });
    }

    private static IResult CreateBooking(CreateBookingRequest request, InMemoryStore store)
    {
        if (!store.Restaurants.TryGetValue(request.RestaurantId, out var restaurant))
            return Results.BadRequest(new
            {
                error = "Restaurant not found.",
                code = "RESTAURANT_NOT_FOUND"
            });

        var bookings = store.Bookings.Values.ToList();

        var result = BookingService.TryBook(
            restaurant.Tables,
            bookings,
            request.RestaurantId,
            request.TableId,
            request.Date,
            request.StartTime,
            request.PartySize,
            request.GuestName);

        if (!result.IsSuccess)
            return Results.BadRequest(new { error = result.Error!.Message, code = result.Error.Code });

        var booking = result.Value!;
        store.Bookings[booking.Id] = booking;

        return Results.Created($"/api/bookings/{booking.Id}", new
        {
            booking.Id,
            booking.RestaurantId,
            RestaurantName = restaurant.Name,
            booking.TableId,
            booking.Date,
            booking.StartTime,
            booking.PartySize,
            booking.GuestName,
            booking.CreatedAt,
        });
    }
}
