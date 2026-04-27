// pattern: Imperative Shell

using RestaurantBooking.Domain;
using RestaurantBooking.Infrastructure;

namespace RestaurantBooking.Features.Bookings;

public static class CreateBooking
{
    public static void Map(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/bookings", async Task<IResult> (HttpContext httpContext) =>
        {
            var restaurantStore = httpContext.RequestServices.GetRequiredService<IRestaurantStore>();
            var bookingStore = httpContext.RequestServices.GetRequiredService<IBookingStore>();

            var request = await httpContext.Request.ReadFromJsonAsync<CreateBookingRequest>();
            if (request is null)
                return TypedResults.BadRequest(new ProblemResponse("Invalid request body"));

            var restaurant = restaurantStore.GetById(request.RestaurantId);
            if (restaurant is null)
                return TypedResults.NotFound(new ProblemResponse("Restaurant not found"));

            var partySizeError = ValidationRules.ValidatePartySize(request.PartySize);
            if (partySizeError is not null)
                return TypedResults.BadRequest(new ProblemResponse(partySizeError.Message));

            var dateTimeError = ValidationRules.ValidateBookingDateTime(request.Date, request.Time);
            if (dateTimeError is not null)
                return TypedResults.BadRequest(new ProblemResponse(dateTimeError.Message));

            var suitableTable = restaurant.Tables
                .Where(t => ValidationRules.IsTableSuitable(t, request.PartySize))
                .OrderBy(t => t.Capacity)
                .FirstOrDefault();

            if (suitableTable is null)
                return TypedResults.BadRequest(new ProblemResponse("No suitable table available"));

            var existingBookings = bookingStore.GetByRestaurantAndDate(request.RestaurantId, request.Date);
            var (start, end) = ValidationRules.GetBookingWindow(request.Time);

            if (BookingConflict.HasOverlap(start, end, existingBookings, suitableTable.Id, request.Date))
                return TypedResults.Conflict(new ProblemResponse("Time slot is already booked"));

            var booking = new Booking(
                Guid.NewGuid(),
                request.RestaurantId,
                suitableTable.Id,
                request.Date,
                request.Time,
                request.PartySize,
                request.GuestName,
                request.GuestEmail,
                DateTime.UtcNow
            );

            bookingStore.Add(booking);

            return TypedResults.Created($"/api/bookings/{booking.Id}", new BookingResponse(
                booking.Id, booking.RestaurantId, restaurant.Name, booking.TableId,
                suitableTable.Capacity, booking.Date, booking.Time,
                booking.PartySize, booking.GuestName, booking.GuestEmail, booking.CreatedAt
            ));
        })
        .WithName("CreateBooking")
        .WithTags("Bookings")
        .Produces<BookingResponse>(StatusCodes.Status201Created)
        .Produces<ProblemResponse>(StatusCodes.Status400BadRequest)
        .Produces<ProblemResponse>(StatusCodes.Status404NotFound)
        .Produces<ProblemResponse>(StatusCodes.Status409Conflict)
        .Accepts<CreateBookingRequest>("application/json");
    }
}

public record CreateBookingRequest(Guid RestaurantId, DateOnly Date, TimeOnly Time,
    int PartySize, string GuestName, string GuestEmail);

public record BookingResponse(Guid Id, Guid RestaurantId, string RestaurantName, Guid TableId,
    int TableCapacity, DateOnly Date, TimeOnly Time, int PartySize,
    string GuestName, string GuestEmail, DateTime CreatedAt);
