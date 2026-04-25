// pattern: Imperative Shell
using Microsoft.AspNetCore.Http.HttpResults;

namespace RestaurantBooking.Api.Bookings;

public static class BookingEndpoints
{
    public static IEndpointRouteBuilder MapBookingEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api");

        group.MapGet("/restaurants", (BookingStore store) => TypedResults.Ok(store.ListRestaurants()))
            .WithName("ListRestaurants");

        group.MapGet("/bookings", (BookingStore store) => TypedResults.Ok(store.ListBookings()))
            .WithName("ListBookings");

        group.MapGet("/restaurants/{restaurantId:guid}/availability", GetAvailability)
            .WithName("GetAvailability");

        group.MapPost("/bookings", CreateBooking)
            .WithName("CreateBooking");

        return app;
    }

    private static Results<Ok<IReadOnlyList<AvailabilitySlot>>, BadRequest<BookingError>, NotFound<BookingError>> GetAvailability(
        Guid restaurantId,
        string date,
        int partySize,
        BookingStore store)
    {
        if (!DateOnly.TryParse(date, out var parsedDate))
        {
            return TypedResults.BadRequest(new BookingError(BookingErrorCode.InvalidDateTime, "Date must use YYYY-MM-DD format."));
        }

        var result = store.GetAvailability(restaurantId, parsedDate, partySize, Today());
        return ToReadResult(result);
    }

    private static Results<Created<BookingConfirmation>, BadRequest<BookingError>, NotFound<BookingError>, Conflict<BookingError>> CreateBooking(
        BookingRequest request,
        BookingStore store)
    {
        var result = store.CreateBooking(request, Today());
        if (result.IsSuccess)
        {
            return TypedResults.Created($"/api/bookings/{result.Value!.Id}", result.Value);
        }

        return result.Error!.Code switch
        {
            BookingErrorCode.UnknownRestaurant => TypedResults.NotFound(result.Error),
            BookingErrorCode.OverlappingReservation => TypedResults.Conflict(result.Error),
            _ => TypedResults.BadRequest(result.Error)
        };
    }

    private static Results<Ok<IReadOnlyList<AvailabilitySlot>>, BadRequest<BookingError>, NotFound<BookingError>> ToReadResult(Result<IReadOnlyList<AvailabilitySlot>> result)
    {
        if (result.IsSuccess)
        {
            return TypedResults.Ok(result.Value!);
        }

        return result.Error!.Code == BookingErrorCode.UnknownRestaurant
            ? TypedResults.NotFound(result.Error)
            : TypedResults.BadRequest(result.Error);
    }

    private static DateOnly Today() => DateOnly.FromDateTime(DateTimeOffset.UtcNow.UtcDateTime);
}
