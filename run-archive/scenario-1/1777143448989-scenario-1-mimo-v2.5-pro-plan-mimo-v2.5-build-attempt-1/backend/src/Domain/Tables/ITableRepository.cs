namespace RestaurantBooking.Domain.Tables;

public interface ITableRepository
{
    Task<IReadOnlyList<Table>> GetByRestaurantAsync(Guid restaurantId);
}
