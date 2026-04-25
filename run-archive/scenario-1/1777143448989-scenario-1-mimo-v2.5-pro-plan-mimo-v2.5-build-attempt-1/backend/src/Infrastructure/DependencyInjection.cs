using Microsoft.Extensions.DependencyInjection;
using RestaurantBooking.Domain.Bookings;
using RestaurantBooking.Domain.Restaurants;
using RestaurantBooking.Domain.Tables;
using RestaurantBooking.Infrastructure.Repositories;

namespace RestaurantBooking.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<IRestaurantRepository, InMemoryRestaurantRepository>();
        services.AddSingleton<ITableRepository, InMemoryTableRepository>();
        services.AddSingleton<IBookingRepository, InMemoryBookingRepository>();
        return services;
    }
}
