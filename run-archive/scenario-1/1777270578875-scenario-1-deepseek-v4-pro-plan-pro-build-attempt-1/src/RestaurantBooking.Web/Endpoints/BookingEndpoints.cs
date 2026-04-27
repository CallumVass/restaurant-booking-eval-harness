// pattern: Imperative Shell

using RestaurantBooking.Domain;
using RestaurantBooking.Web.Repositories;

namespace RestaurantBooking.Web.Endpoints;

public static class BookingEndpoints
{
    public static void MapBookingEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/api/bookings", CreateBooking)
            .WithTags("Bookings")
            .WithName("CreateBooking")
            .WithOpenApi(o =>
            {
                o.Summary = "Create a booking";
                o.Description = "Books a table at a restaurant. Validates party size, date/time, and checks for conflicts.";
                return o;
            });

        app.MapGet("/api/bookings", GetAllBookings)
            .WithTags("Bookings")
            .WithName("GetBookings")
            .WithOpenApi(o =>
            {
                o.Summary = "List all bookings";
                o.Description = "Returns all bookings across all restaurants.";
                return o;
            });

        app.MapGet("/api/bookings/{id}", GetBookingById)
            .WithTags("Bookings")
            .WithName("GetBooking")
            .WithOpenApi(o =>
            {
                o.Summary = "Get booking by ID";
                o.Description = "Returns a single booking by its ID.";
                return o;
            });
    }

    private static IResult CreateBooking(
        BookingRequest request,
        InMemoryRestaurantRepository restaurantRepo,
        InMemoryBookingRepository bookingRepo)
    {
        var restaurant = restaurantRepo.GetById(request.RestaurantId);
        if (restaurant is null)
            return TypedResults.NotFound(new
            {
                error = "RestaurantNotFound",
                message = $"Restaurant '{request.RestaurantId}' not found."
            });

        var existingBookings = bookingRepo.GetByRestaurant(request.RestaurantId);

        var result = BookingService.TryBook(restaurant, existingBookings, request);

        return result.Match<IResult>(
            booking =>
            {
                var addResult = bookingRepo.Add(booking);
                return addResult.Match<IResult>(
                    b => TypedResults.Created($"/api/bookings/{b.Id}", new
                    {
                        b.Id,
                        b.RestaurantId,
                        b.TableId,
                        b.CustomerName,
                        b.CustomerEmail,
                        b.PartySize,
                        ReservationTime = b.ReservationTime.ToString("o"),
                        b.DurationMinutes,
                        RestaurantName = restaurant.Name
                    }),
                    error => TypedResults.Conflict(new { error = error.Code, message = error.Message }));
            },
            error => error.Code switch
            {
                "InvalidPartySize" => TypedResults.BadRequest(new { error = error.Code, message = error.Message }),
                "InvalidDateTime" => TypedResults.BadRequest(new { error = error.Code, message = error.Message }),
                "TableNotFound" => TypedResults.NotFound(new { error = error.Code, message = error.Message }),
                "TimeConflict" => TypedResults.Conflict(new { error = error.Code, message = error.Message }),
                _ => TypedResults.BadRequest(new { error = error.Code, message = error.Message })
            });
    }

    private static IResult GetAllBookings(InMemoryBookingRepository repo)
    {
        var bookings = repo.GetAll().Select(b => new
        {
            b.Id,
            b.RestaurantId,
            b.TableId,
            b.CustomerName,
            b.CustomerEmail,
            b.PartySize,
            ReservationTime = b.ReservationTime.ToString("o"),
            b.DurationMinutes,
            EndTime = b.EndTime.ToString("o")
        });
        return TypedResults.Ok(bookings);
    }

    private static IResult GetBookingById(string id, InMemoryBookingRepository repo)
    {
        var b = repo.GetById(id);
        if (b is null)
            return TypedResults.NotFound(new { error = "BookingNotFound", message = $"Booking '{id}' not found." });

        return TypedResults.Ok(new
        {
            b.Id,
            b.RestaurantId,
            b.TableId,
            b.CustomerName,
            b.CustomerEmail,
            b.PartySize,
            ReservationTime = b.ReservationTime.ToString("o"),
            b.DurationMinutes,
            EndTime = b.EndTime.ToString("o")
        });
    }
}
