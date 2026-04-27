// pattern: Imperative Shell

using System.Collections.Concurrent;
using RestaurantBooking.Domain;
using RestaurantBooking.Domain.Errors;

namespace RestaurantBooking.Web.Repositories;

public sealed class InMemoryBookingRepository
{
    private readonly ConcurrentDictionary<string, Booking> _bookings = new();

    public IReadOnlyList<Booking> GetAll() => _bookings.Values.ToList();

    public IReadOnlyList<Booking> GetByRestaurant(string restaurantId) =>
        _bookings.Values.Where(b => b.RestaurantId == restaurantId).ToList();

    public Booking? GetById(string id) =>
        _bookings.TryGetValue(id, out var b) ? b : null;

    public Result<Booking, BookingError> Add(Booking booking)
    {
        if (!_bookings.TryAdd(booking.Id, booking))
            return Result.Failure<Booking, BookingError>(
                BookingErrors.TimeConflict(booking.TableId, booking.ReservationTime, booking.EndTime));

        return Result.Success<Booking, BookingError>(booking);
    }
}
