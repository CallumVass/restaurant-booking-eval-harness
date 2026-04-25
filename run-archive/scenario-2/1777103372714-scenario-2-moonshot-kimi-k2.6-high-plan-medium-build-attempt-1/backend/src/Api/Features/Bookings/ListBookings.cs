// pattern: Imperative Shell

using RestaurantBooking.Api.Domain;
using RestaurantBooking.Api.Infrastructure;

namespace RestaurantBooking.Api.Features.Bookings;

public static class ListBookings
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/bookings", (IRestaurantStore restaurantStore, IBookingStore bookingStore) =>
        {
            var bookings = bookingStore.GetAll();
            var restaurants = restaurantStore.GetAll().ToDictionary(r => r.Id);

            var dtos = bookings.Select(b =>
            {
                var tableName = restaurants.TryGetValue(b.RestaurantId, out var r)
                    ? r.Tables.FirstOrDefault(t => t.Id == b.TableId)?.Name ?? "Unknown"
                    : "Unknown";

                return new BookingDto(
                    b.Id,
                    b.RestaurantId,
                    tableName,
                    b.StartTime,
                    b.EndTime,
                    b.PartySize,
                    b.CustomerName,
                    b.CustomerEmail
                );
            });

            return Results.Ok(dtos);
        })
        .WithName("ListBookings")
        .WithTags("Bookings")
        .Produces<List<BookingDto>>();
    }
}
