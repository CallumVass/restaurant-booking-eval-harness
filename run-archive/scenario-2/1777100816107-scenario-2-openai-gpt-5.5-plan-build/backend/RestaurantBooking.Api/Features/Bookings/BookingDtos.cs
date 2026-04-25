using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Api.Features.Bookings;

public sealed record CreateBookingRequest(string RestaurantId, DateOnly Date, string StartTime, int PartySize, string GuestName, string GuestEmail);

public sealed record BookingResponse(string Id, string RestaurantId, string TableId, DateOnly Date, string StartTime, string EndTime, int PartySize, string GuestName, string GuestEmail)
{
    public static BookingResponse From(Booking booking) => new(
        booking.Id,
        booking.RestaurantId,
        booking.TableId,
        booking.Date,
        booking.StartTime.ToString("HH:mm"),
        booking.EndTime.ToString("HH:mm"),
        booking.PartySize,
        booking.GuestName,
        booking.GuestEmail);
}
