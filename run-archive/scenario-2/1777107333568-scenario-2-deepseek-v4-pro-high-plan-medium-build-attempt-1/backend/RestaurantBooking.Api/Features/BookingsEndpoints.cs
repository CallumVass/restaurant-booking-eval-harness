// pattern: Imperative Shell

using RestaurantBooking.Api.Domain;
using RestaurantBooking.Api.Infrastructure;

namespace RestaurantBooking.Api.Features;

public static class BookingsEndpoints
{
    public static void Map(WebApplication app)
    {
        app.MapPost("/api/bookings", CreateBooking)
            .WithTags("Bookings")
            .Produces<BookingResult>(201)
            .ProducesProblem(400)
            .ProducesProblem(409);

        app.MapGet("/api/bookings", GetBookings)
            .WithTags("Bookings")
            .Produces<BookingResult[]>(200);

        app.MapGet("/api/timeslots", GetTimeSlots)
            .WithTags("Bookings")
            .Produces<TimeSlot[]>(200)
            .ProducesProblem(400);
    }

    private static IResult CreateBooking(BookingRequest request, InMemoryStore store)
    {
        if (!store.Restaurants.TryGetValue(request.RestaurantId, out var restaurant))
            return TypedResults.BadRequest(new { error = $"Restaurant with ID {request.RestaurantId} not found." });

        var existing = store.Bookings.Values
            .Where(b => b.RestaurantId == request.RestaurantId)
            .ToList();

        var result = BookingService.TryBook(restaurant, existing, request);

        if (!result.IsSuccess)
        {
            var statusCode = result.Error!.Contains("No table") ? 409 : 400;
            return TypedResults.Problem(detail: result.Error, statusCode: statusCode);
        }

        var booking = result.Value!;
        store.Bookings[booking.Id] = booking;

        var bookingResult = new BookingResult(
            booking.Id,
            booking.RestaurantId,
            booking.TableId,
            booking.CustomerName,
            booking.PartySize,
            booking.Date,
            booking.StartTime,
            booking.EndTime);

        return TypedResults.Created($"/api/bookings/{booking.Id}", bookingResult);
    }

    private static List<BookingResult> GetBookings(int? restaurantId, DateOnly? date, InMemoryStore store)
    {
        var bookings = store.Bookings.Values.AsEnumerable();

        if (restaurantId.HasValue)
            bookings = bookings.Where(b => b.RestaurantId == restaurantId.Value);

        if (date.HasValue)
            bookings = bookings.Where(b => b.Date == date.Value);

        return bookings
            .OrderBy(b => b.Date)
            .ThenBy(b => b.StartTime)
            .Select(b => new BookingResult(
                b.Id,
                b.RestaurantId,
                b.TableId,
                b.CustomerName,
                b.PartySize,
                b.Date,
                b.StartTime,
                b.EndTime))
            .ToList();
    }

    private static IResult GetTimeSlots(int restaurantId, DateOnly date, int partySize, InMemoryStore store)
    {
        if (!store.Restaurants.TryGetValue(restaurantId, out var restaurant))
            return TypedResults.BadRequest(new { error = $"Restaurant with ID {restaurantId} not found." });

        var existing = store.Bookings.Values
            .Where(b => b.RestaurantId == restaurantId)
            .ToList();

        var slots = BookingService.GetAvailableTimeSlots(restaurant, existing, date, partySize);
        return TypedResults.Ok(slots);
    }
}
