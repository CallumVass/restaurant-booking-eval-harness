using RestaurantBooking.Domain;

namespace RestaurantBooking.Data;

public interface IBookingRepository
{
    IReadOnlyList<Booking> GetByRestaurantId(string restaurantId);
    void Add(Booking booking);
    IReadOnlyList<Booking> GetAll();
}