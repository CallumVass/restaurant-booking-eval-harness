// pattern: Imperative Shell

using RestaurantBooking.Domain.Entities;
using RestaurantBooking.Domain.Services;

namespace RestaurantBooking.Api.Infrastructure;

public sealed class InMemoryBookingRepository : IBookingRepository
{
    private readonly List<Booking> _bookings = [];

    public Task<IReadOnlyList<Booking>> GetByRestaurantAndDateAsync(Guid restaurantId, DateOnly date, CancellationToken ct = default)
    {
        var result = _bookings.Where(b =>
            b.RestaurantId == restaurantId &&
            b.StartTime.Date == date.ToDateTime(TimeOnly.MinValue)).ToList();
        return Task.FromResult<IReadOnlyList<Booking>>(result);
    }

    public Task<IReadOnlyList<Booking>> GetByTableAndDateRangeAsync(Guid tableId, DateTime start, DateTime end, CancellationToken ct = default)
    {
        var result = _bookings.Where(b =>
            b.TableId == tableId &&
            b.StartTime < end &&
            b.EndTime > start).ToList();
        return Task.FromResult<IReadOnlyList<Booking>>(result);
    }

    public Task<Booking?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => Task.FromResult(_bookings.FirstOrDefault(b => b.Id == id));

    public Task<Booking> AddAsync(Booking booking, CancellationToken ct = default)
    {
        _bookings.Add(booking);
        return Task.FromResult(booking);
    }
}