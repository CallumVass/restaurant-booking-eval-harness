using Microsoft.AspNetCore.Http.HttpResults;
using RestaurantBooking.Infrastructure;

namespace RestaurantBooking.Features.Bookings.ListBookings;

public static class ListBookingsEndpoint
{
    public static Ok<List<BookingResponse>> Handle(InMemoryStore store)
    {
        var bookings = store.GetAllBookings();
        var result = bookings.Select(b =>
        {
            var restaurant = store.GetRestaurant(b.RestaurantId);
            return new BookingResponse(
                b.Id,
                b.RestaurantId,
                b.TableId,
                b.DateTime,
                b.Duration,
                b.PartySize,
                b.CustomerName,
                b.CustomerEmail,
                restaurant?.Name ?? "Unknown");
        }).ToList();

        return TypedResults.Ok(result);
    }
}
