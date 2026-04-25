using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Api.Infrastructure;

public interface IBookingStore
{
    IReadOnlyList<Restaurant> Restaurants { get; }

    IReadOnlyList<Booking> Bookings { get; }

    Booking Add(Booking booking);
}
