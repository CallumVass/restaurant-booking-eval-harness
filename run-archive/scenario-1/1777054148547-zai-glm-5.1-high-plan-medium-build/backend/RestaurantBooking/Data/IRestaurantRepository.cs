using RestaurantBooking.Domain;

namespace RestaurantBooking.Data;

public interface IRestaurantRepository
{
    IReadOnlyList<Restaurant> GetAll();
    Restaurant? GetById(string id);
}