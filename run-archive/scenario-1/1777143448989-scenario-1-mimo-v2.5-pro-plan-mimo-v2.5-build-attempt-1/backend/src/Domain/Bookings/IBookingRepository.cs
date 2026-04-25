namespace RestaurantBooking.Domain.Bookings;

public interface IBookingRepository
{
    Task<Booking?> GetByIdAsync(Guid id);
    Task<IReadOnlyList<Booking>> GetByRestaurantAsync(Guid restaurantId, DateOnly? filterDate = null);
    Task AddAsync(Booking booking);
}
