// pattern: Imperative Shell

using RestaurantBooking.Api.Domain;
using RestaurantBooking.Api.Infrastructure;

namespace RestaurantBooking.Api.Features.Bookings;

public static class BookingsEndpoints
{
    public static IEndpointRouteBuilder MapBookings(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/bookings", (IBookingStore store) =>
            TypedResults.Ok(store.Bookings.Select(BookingResponse.From).ToArray()))
            .WithName("ListBookings")
            .WithTags("Bookings");

        app.MapPost("/api/bookings", (CreateBookingRequest request, IBookingStore store) =>
        {
            if (!TimeOnly.TryParse(request.StartTime, out var startTime))
            {
                return Results.Problem(title: "Start time must use HH:mm format.", statusCode: StatusCodes.Status400BadRequest, extensions: new Dictionary<string, object?> { ["code"] = "invalid_time" });
            }

            var restaurant = store.Restaurants.SingleOrDefault(candidate => candidate.Id == request.RestaurantId);
            var result = BookingRules.CreateBooking(restaurant, store.Bookings, request.Date, startTime, request.PartySize, request.GuestName, request.GuestEmail);
            if (!result.IsSuccess)
            {
                return ProblemMapper.ToProblem(result.Error!);
            }

            var booking = store.Add(result.Value!);
            return Results.Created($"/api/bookings/{booking.Id}", BookingResponse.From(booking));
        })
        .WithName("CreateBooking")
        .WithTags("Bookings");

        return app;
    }
}
