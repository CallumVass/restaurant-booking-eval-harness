// pattern: Imperative Shell

using RestaurantBooking.Domain;
using RestaurantBooking.Infrastructure;

namespace RestaurantBooking.Features.Availability;

public static class GetAvailability
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/restaurants/{restaurantId:guid}/availability", async Task<IResult> (Guid restaurantId, DateOnly date, int partySize, HttpContext httpContext) =>
        {
            var restaurantStore = httpContext.RequestServices.GetRequiredService<IRestaurantStore>();
            var bookingStore = httpContext.RequestServices.GetRequiredService<IBookingStore>();

            var restaurant = restaurantStore.GetById(restaurantId);
            if (restaurant is null)
                return TypedResults.NotFound(new ProblemResponse("Restaurant not found"));

            var partySizeError = ValidationRules.ValidatePartySize(partySize);
            if (partySizeError is not null)
                return TypedResults.BadRequest(new ProblemResponse(partySizeError.Message));

            var existingBookings = bookingStore.GetByRestaurantAndDate(restaurantId, date);
            var slots = Domain.Availability.GetAvailableSlots(restaurant, date, partySize, existingBookings);

            var grouped = slots
                .GroupBy(s => s.Time)
                .Select(g =>
                {
                    var availableTables = g.Where(s => s.Available)
                        .Select(s => new TableSlot(s.TableId, s.Capacity, s.AvailableCapacity)).ToList();
                    return new TimeSlotResponse(g.Key, availableTables, availableTables.Count > 0);
                })
                .OrderBy(t => t.Time)
                .ToList();

            var result = new AvailabilityResponse(restaurant.Name, date, partySize, grouped);
            return TypedResults.Ok(result);
        })
        .WithName("GetAvailability")
        .WithTags("Availability")
        .Produces<AvailabilityResponse>()
        .Produces<ProblemResponse>(StatusCodes.Status400BadRequest)
        .Produces<ProblemResponse>(StatusCodes.Status404NotFound);
    }
}

public record AvailabilityResponse(string RestaurantName, DateOnly Date, int PartySize, List<TimeSlotResponse> Slots);
public record TimeSlotResponse(TimeOnly Time, List<TableSlot> Tables, bool Available);
public record TableSlot(Guid TableId, int Capacity, int AvailableCapacity);
