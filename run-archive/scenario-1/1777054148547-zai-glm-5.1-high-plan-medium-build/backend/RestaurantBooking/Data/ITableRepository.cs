using RestaurantBooking.Domain;

namespace RestaurantBooking.Data;

public interface ITableRepository
{
    IReadOnlyList<Table> GetByRestaurantId(string restaurantId);
    Table? GetById(string id);
    IReadOnlyList<Table> GetAll();
}