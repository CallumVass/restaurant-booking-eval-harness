namespace RestaurantBooking.Domain.Services;

public interface IBookingRepository
{
    Task<IReadOnlyList<Entities.Booking>> GetByRestaurantAndDateAsync(Guid restaurantId, DateOnly date, CancellationToken ct = default);
    Task<IReadOnlyList<Entities.Booking>> GetByTableAndDateRangeAsync(Guid tableId, DateTime start, DateTime end, CancellationToken ct = default);
    Task<Entities.Booking?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Entities.Booking> AddAsync(Entities.Booking booking, CancellationToken ct = default);
}

public interface IRestaurantRepository
{
    Task<IReadOnlyList<Entities.Restaurant>> GetAllAsync(CancellationToken ct = default);
    Task<Entities.Restaurant?> GetByIdAsync(Guid id, CancellationToken ct = default);
}