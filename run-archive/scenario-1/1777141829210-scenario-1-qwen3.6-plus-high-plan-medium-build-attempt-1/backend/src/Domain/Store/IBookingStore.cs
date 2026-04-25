using Domain.Models;

namespace Domain.Store;

public interface IBookingStore
{
    IReadOnlyList<Restaurant> GetRestaurants();
    Restaurant? GetRestaurant(string id);
    IReadOnlyList<Booking> GetBookings();
    IReadOnlyList<Booking> GetBookingsByRestaurant(string restaurantId);
    void AddBooking(Booking booking);
}
