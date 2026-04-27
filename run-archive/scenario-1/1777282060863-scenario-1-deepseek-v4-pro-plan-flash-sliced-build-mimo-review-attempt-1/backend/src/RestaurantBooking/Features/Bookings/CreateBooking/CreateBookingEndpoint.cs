using Microsoft.AspNetCore.Http.HttpResults;
using RestaurantBooking.Domain;
using RestaurantBooking.Infrastructure;

namespace RestaurantBooking.Features.Bookings.CreateBooking;

public static class CreateBookingEndpoint
{
    public static Results<Created<BookingResponse>, BadRequest<string>, NotFound<string>, Conflict<string>> Handle(
        CreateBookingRequest request,
        InMemoryStore store)
    {
        if (string.IsNullOrWhiteSpace(request.CustomerName))
            return TypedResults.BadRequest<string>("Customer name is required.");

        if (string.IsNullOrWhiteSpace(request.CustomerEmail))
            return TypedResults.BadRequest<string>("Customer email is required.");

        var restaurant = store.GetRestaurant(request.RestaurantId);
        var tables = store.GetTables(request.RestaurantId);
        var bookings = store.GetAllBookings();

        var result = SlotCalculator.ValidateBooking(request, restaurant, tables, bookings);

        if (!result.IsSuccess)
        {
            return result.Error switch
            {
                BookingError.InvalidPartySize => TypedResults.BadRequest<string>("Party size must be greater than 0."),
                BookingError.InvalidDateTime => TypedResults.BadRequest<string>("Booking date/time must be in the future."),
                BookingError.RestaurantNotFound => TypedResults.NotFound<string>("Restaurant not found."),
                BookingError.OverlapConflict => TypedResults.Conflict<string>("The requested time slot conflicts with an existing booking."),
                _ => TypedResults.BadRequest<string>("Invalid booking request."),
            };
        }

        store.AddBooking(result.Value!);

        var response = new BookingResponse(
            result.Value!.Id,
            result.Value.RestaurantId,
            result.Value.TableId,
            result.Value.DateTime,
            result.Value.Duration,
            result.Value.PartySize,
            result.Value.CustomerName,
            result.Value.CustomerEmail,
            restaurant!.Name);

        return TypedResults.Created($"/bookings/{result.Value.Id}", response);
    }
}
