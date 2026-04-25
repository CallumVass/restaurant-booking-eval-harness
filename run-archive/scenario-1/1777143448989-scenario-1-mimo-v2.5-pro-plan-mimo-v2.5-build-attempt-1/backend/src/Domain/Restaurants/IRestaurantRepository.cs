namespace RestaurantBooking.Domain.Restaurants;

public interface IRestaurantRepository
{
    Task<IReadOnlyList<Restaurant>> GetAllAsync();
    Task<Restaurant?> GetByIdAsync(Guid id);
}
