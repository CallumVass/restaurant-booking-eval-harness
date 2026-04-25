using System.Collections.Concurrent;
using RestaurantBooking.Domain.Bookings;

namespace RestaurantBooking.Infrastructure.Repositories;

public sealed class InMemoryBookingRepository : IBookingRepository
{
    private readonly ConcurrentDictionary<Guid, Booking> _bookings = new();

    public Task<Booking?> GetByIdAsync(Guid id) =>
        Task.FromResult(_bookings.TryGetValue(id, out var booking) ? booking : null);

    public Task<IReadOnlyList<Booking>> GetByRestaurantAsync(Guid restaurantId, DateOnly? filterDate = null)
    {
        var result = _bookings.Values
            .Where(b => b.RestaurantId == restaurantId)
            .Where(b => filterDate == null || b.Date == filterDate.Value)
            .ToList();

        return Task.FromResult<IReadOnlyList<Booking>>(result);
    }

    public Task AddAsync(Booking booking)
    {
        _bookings.TryAdd(booking.Id, booking);
        return Task.CompletedTask;
    }
}
