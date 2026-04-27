// pattern: Imperative Shell

using RestaurantBooking.Domain;
using RestaurantBooking.Infrastructure;

namespace RestaurantBooking.Features.Bookings;

public static class ListBookings
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/bookings", async Task<IResult> (HttpContext httpContext) =>
        {
            var restaurantStore = httpContext.RequestServices.GetRequiredService<IRestaurantStore>();
            var bookingStore = httpContext.RequestServices.GetRequiredService<IBookingStore>();

            var restaurants = restaurantStore.GetAll().ToDictionary(r => r.Id);
            var bookings = bookingStore.GetAll();
            var result = bookings.Select(b => new BookingResponse
            (
                b.Id, b.RestaurantId,
                restaurants.TryGetValue(b.RestaurantId, out var r) ? r.Name : "Unknown",
                b.TableId, 0, b.Date, b.Time, b.PartySize,
                b.GuestName, b.GuestEmail, b.CreatedAt
            ));
            return TypedResults.Ok(result);
        })
        .WithName("ListBookings")
        .WithTags("Bookings")
        .Produces<IEnumerable<BookingResponse>>();

        app.MapGet("/api/bookings/by-restaurant/{restaurantId:guid}", async Task<IResult> (Guid restaurantId, HttpContext httpContext) =>
        {
            var restaurantStore = httpContext.RequestServices.GetRequiredService<IRestaurantStore>();
            var bookingStore = httpContext.RequestServices.GetRequiredService<IBookingStore>();

            var restaurant = restaurantStore.GetById(restaurantId);
            if (restaurant is null)
                return TypedResults.NotFound(new ProblemResponse("Restaurant not found"));

            var bookings = bookingStore.GetByRestaurant(restaurantId);
            var result = bookings.Select(b => new BookingResponse
            (
                b.Id, b.RestaurantId, restaurant.Name,
                b.TableId, 0, b.Date, b.Time, b.PartySize,
                b.GuestName, b.GuestEmail, b.CreatedAt
            ));
            return TypedResults.Ok(result);
        })
        .WithName("ListBookingsByRestaurant")
        .WithTags("Bookings")
        .Produces<IEnumerable<BookingResponse>>()
        .Produces<ProblemResponse>(StatusCodes.Status404NotFound);
    }
}
