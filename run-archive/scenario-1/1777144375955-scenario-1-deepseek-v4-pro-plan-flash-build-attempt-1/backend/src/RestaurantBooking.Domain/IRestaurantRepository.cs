namespace RestaurantBooking.Domain;

public interface IRestaurantRepository
{
    List<Restaurant> GetAll();
    Restaurant? GetById(Guid id);
}

public interface IBookingRepository
{
    List<Booking> GetAll();
    Booking? GetById(Guid id);
    List<Booking> GetByRestaurantAndDate(Guid restaurantId, DateOnly date);
    void Add(Booking booking);
}
