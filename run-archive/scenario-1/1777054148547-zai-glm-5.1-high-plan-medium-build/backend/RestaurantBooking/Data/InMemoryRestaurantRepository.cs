using RestaurantBooking.Domain;

namespace RestaurantBooking.Data;

public sealed class InMemoryRestaurantRepository : IRestaurantRepository
{
    private readonly IReadOnlyList<Restaurant> _restaurants;

    public InMemoryRestaurantRepository(IReadOnlyList<Restaurant> restaurants) =>
        _restaurants = restaurants;

    public IReadOnlyList<Restaurant> GetAll() => _restaurants;

    public Restaurant? GetById(string id) =>
        _restaurants.FirstOrDefault(r => r.Id == id);
}