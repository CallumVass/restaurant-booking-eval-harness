// pattern: Imperative Shell

using RestaurantBooking.Infrastructure;

namespace RestaurantBooking.Features.ListBookings;

public static class ListBookingsEndpoint
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/bookings", Handle)
            .WithSummary("List all bookings");
    }

    public static IResult Handle(DataStore store)
    {
        var bookings = store.GetAllBookings();
        return TypedResults.Ok(bookings);
    }
}
