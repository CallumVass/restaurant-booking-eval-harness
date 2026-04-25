using RestaurantBooking.Data;
using RestaurantBooking.Domain;

namespace RestaurantBooking.Api;

public static class BookingEndpoints
{
    public static IEndpointRouteBuilder MapBookingEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/restaurants/{restaurantId}").WithTags("Bookings");

        group.MapGet("/slot", (
            string restaurantId,
            DateOnly date,
            int partySize,
            IRestaurantRepository restaurantRepo,
            ITableRepository tableRepo,
            IBookingRepository bookingRepo) =>
        {
            var result = BookingDomain.GetAvailableSlots(
                restaurantRepo.GetAll(),
                tableRepo.GetAll(),
                bookingRepo.GetAll(),
                restaurantId,
                date,
                partySize);

            if (!result.IsSuccess)
                return result.Error! switch
                {
                    BookingError.UnknownRestaurant => Results.NotFound(new ErrorDto("UnknownRestaurant", $"Restaurant '{restaurantId}' not found")),
                    BookingError.InvalidPartySize e => Results.BadRequest(new ErrorDto("InvalidPartySize", $"Invalid party size: {e.PartySize}")),
                    BookingError.InvalidDate e => Results.BadRequest(new ErrorDto("InvalidDate", e.Reason)),
                    BookingError.NoTablesAvailable => Results.NotFound(new ErrorDto("NoTablesAvailable", "No tables available for the given criteria")),
                    _ => Results.BadRequest(new ErrorDto("Error", "Unknown error"))
                };

            var slots = result.Value!;
            var dtos = slots.Select(s => new TimeSlotDto(s.Time.ToString("HH:mm"), s.DurationMinutes, s.TableId)).ToList();
            return Results.Ok(dtos);
        });

        group.MapPost("/bookings", (
            string restaurantId,
            CreateBookingRequest request,
            IRestaurantRepository restaurantRepo,
            ITableRepository tableRepo,
            IBookingRepository bookingRepo) =>
        {
            var result = BookingDomain.TryBook(
                restaurantRepo.GetAll(),
                tableRepo.GetAll(),
                bookingRepo.GetAll(),
                restaurantId,
                request.TableId,
                request.CustomerName,
                request.Date,
                request.Time,
                request.PartySize);

            if (!result.IsSuccess)
                return result.Error! switch
                {
                    BookingError.UnknownRestaurant => Results.NotFound(new ErrorDto("UnknownRestaurant", $"Restaurant '{restaurantId}' not found")),
                    BookingError.InvalidPartySize e => Results.BadRequest(new ErrorDto("InvalidPartySize", $"Invalid party size: {e.PartySize}")),
                    BookingError.InvalidDate e => Results.BadRequest(new ErrorDto("InvalidDate", e.Reason)),
                    BookingError.InvalidTimeSlot e => Results.BadRequest(new ErrorDto("InvalidTimeSlot", e.Reason)),
                    BookingError.OverlappingReservation => Results.Conflict(new ErrorDto("OverlappingReservation", "The selected time slot is already booked")),
                    _ => Results.BadRequest(new ErrorDto("Error", "Unknown error"))
                };

            var booking = result.Value!;
            bookingRepo.Add(booking);

            var dto = new BookingDto(
                booking.Id,
                booking.RestaurantId,
                booking.TableId,
                booking.CustomerName,
                booking.Date,
                booking.Time,
                booking.PartySize);

            return Results.Created($"/api/restaurants/{restaurantId}/bookings/{booking.Id}", dto);
        });

        group.MapGet("/bookings", (
            string restaurantId,
            IBookingRepository bookingRepo) =>
        {
            var bookings = bookingRepo.GetByRestaurantId(restaurantId);
            var dtos = bookings.Select(b => new BookingDto(
                b.Id, b.RestaurantId, b.TableId, b.CustomerName, b.Date, b.Time, b.PartySize)).ToList();
            return Results.Ok(dtos);
        });

        return app;
    }
}