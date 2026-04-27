// pattern: Imperative Shell

using RestaurantBooking.Domain;
using RestaurantBooking.Web.Repositories;

namespace RestaurantBooking.Web.Endpoints;

public static class AvailabilityEndpoints
{
    public static void MapAvailabilityEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/restaurants/{id}/availability", GetAvailability)
            .WithTags("Availability")
            .WithName("GetAvailability")
            .WithOpenApi(o =>
            {
                o.Summary = "Get available time slots";
                o.Description = "Returns available 30-minute time slots for a restaurant on a given date for a given party size.";
                return o;
            });
    }

    private static IResult GetAvailability(
        string id,
        DateOnly? date,
        int? partySize,
        InMemoryRestaurantRepository restaurantRepo,
        InMemoryBookingRepository bookingRepo)
    {
        var restaurant = restaurantRepo.GetById(id);
        if (restaurant is null)
            return TypedResults.NotFound(new { error = "RestaurantNotFound", message = $"Restaurant '{id}' not found." });

        var queryDate = date ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var queryPartySize = partySize ?? 2;

        var bookings = bookingRepo.GetByRestaurant(id);

        var slots = BookingService.GetAvailableSlots(restaurant, bookings, queryDate, queryPartySize);

        var result = slots.Select(s => new
        {
            time = s.Time.ToString("HH:mm"),
            tableId = s.TableId,
            tableLabel = s.TableLabel,
            capacity = s.Capacity
        });

        return TypedResults.Ok(result);
    }
}
