using System;

namespace RestaurantBooking.Api.Data;

using System.Collections.Generic;
using System.Linq;
using RestaurantBooking.Domain;

public sealed class DataStore
{
    private readonly List<Restaurant> _restaurants = [];
    private readonly List<Table> _tables = [];
    private readonly List<Booking> _bookings = [];
    private readonly object _lock = new();

    public DataStore()
    {
        Seed();
    }

    public IReadOnlyList<Restaurant> GetRestaurants()
    {
        lock (_lock)
        {
            return _restaurants.ToList();
        }
    }

    public Restaurant? GetRestaurant(Guid id)
    {
        lock (_lock)
        {
            return _restaurants.FirstOrDefault(r => r.Id == id);
        }
    }

    public IReadOnlyList<Table> GetTables()
    {
        lock (_lock)
        {
            return _tables.ToList();
        }
    }

    public IReadOnlyList<Table> GetTablesForRestaurant(Guid restaurantId)
    {
        lock (_lock)
        {
            return _tables.Where(t => t.RestaurantId == restaurantId).ToList();
        }
    }

    public IReadOnlyList<Booking> GetBookings()
    {
        lock (_lock)
        {
            return _bookings.ToList();
        }
    }

    public void AddBooking(Booking booking)
    {
        lock (_lock)
        {
            _bookings.Add(booking);
        }
    }

    private void Seed()
    {
        var bistro = new Restaurant
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Name = "Bistro Central",
            OpeningTime = new TimeOnly(8, 0),
            ClosingTime = new TimeOnly(22, 0),
        };

        var sushi = new Restaurant
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            Name = "Sushi Corner",
            OpeningTime = new TimeOnly(12, 0),
            ClosingTime = new TimeOnly(23, 0),
        };

        _restaurants.Add(bistro);
        _restaurants.Add(sushi);

        _tables.Add(new Table { Id = Guid.NewGuid(), RestaurantId = bistro.Id, Capacity = 2 });
        _tables.Add(new Table { Id = Guid.NewGuid(), RestaurantId = bistro.Id, Capacity = 4 });
        _tables.Add(new Table { Id = Guid.NewGuid(), RestaurantId = bistro.Id, Capacity = 6 });
        _tables.Add(new Table { Id = Guid.NewGuid(), RestaurantId = sushi.Id, Capacity = 2 });
        _tables.Add(new Table { Id = Guid.NewGuid(), RestaurantId = sushi.Id, Capacity = 4 });
    }
}
