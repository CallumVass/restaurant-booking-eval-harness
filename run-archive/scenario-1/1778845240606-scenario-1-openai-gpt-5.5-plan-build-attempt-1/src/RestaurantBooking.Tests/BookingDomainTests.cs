public sealed class BookingDomainTests
{
    private static readonly DateTimeOffset Now = new(2026, 5, 15, 12, 0, 0, TimeSpan.Zero);
    private static readonly Guid RestaurantId = Seed.Restaurants[0].Id;

    [Fact]
    public void Rejects_invalid_party_size()
    {
        var result = BookingDomain.CreateBooking(Snapshot(), new CreateBookingRequest(RestaurantId, "Ada", 0, FutureAt(17, 0)), Now);
        Assert.False(result.IsSuccess);
        Assert.Equal("invalid_party_size", result.Error.Code);
    }

    [Fact]
    public void Rejects_unknown_restaurant()
    {
        var result = BookingDomain.GetAvailableSlots(Snapshot(), Guid.NewGuid(), DateOnly.FromDateTime(FutureAt(17, 0)), 2, Now);
        Assert.False(result.IsSuccess);
        Assert.Equal("unknown_restaurant", result.Error.Code);
    }

    [Fact]
    public void Rejects_invalid_time_outside_service_window()
    {
        var result = BookingDomain.CreateBooking(Snapshot(), new CreateBookingRequest(RestaurantId, "Ada", 2, FutureAt(21, 0)), Now);
        Assert.False(result.IsSuccess);
        Assert.Equal("invalid_time", result.Error.Code);
    }

    [Fact]
    public void Rejects_past_dates()
    {
        var result = BookingDomain.CreateBooking(Snapshot(), new CreateBookingRequest(RestaurantId, "Ada", 2, Now.AddDays(-1).DateTime), Now);
        Assert.False(result.IsSuccess);
        Assert.Equal("invalid_date", result.Error.Code);
    }

    [Fact]
    public void Prevents_overlapping_reservations_when_no_table_fits()
    {
        var table = Seed.Restaurants[0].Tables.Single(t => t.Capacity == 6);
        var existing = new BookingDto(Guid.NewGuid(), RestaurantId, table.Id, "Grace", 5, FutureAt(17, 0), FutureAt(18, 30));
        var result = BookingDomain.CreateBooking(Snapshot(existing), new CreateBookingRequest(RestaurantId, "Ada", 5, FutureAt(18, 0)), Now);
        Assert.False(result.IsSuccess);
        Assert.Equal("overlapping_reservation", result.Error.Code);
    }

    [Fact]
    public void Allows_adjacent_reservations_on_same_table()
    {
        var table = Seed.Restaurants[0].Tables.First(t => t.Capacity >= 2);
        var existing = new BookingDto(Guid.NewGuid(), RestaurantId, table.Id, "Grace", 2, FutureAt(17, 0), FutureAt(18, 30));
        var result = BookingDomain.CreateBooking(Snapshot(existing), new CreateBookingRequest(RestaurantId, "Ada", 2, FutureAt(18, 30)), Now);
        Assert.True(result.IsSuccess);
        Assert.Equal(table.Id, result.Value.TableId);
    }

    [Fact]
    public void Lists_availability_for_each_service_slot()
    {
        var result = BookingDomain.GetAvailableSlots(Snapshot(), RestaurantId, DateOnly.FromDateTime(FutureAt(17, 0)), 4, Now);
        Assert.True(result.IsSuccess);
        Assert.Contains(result.Value, slot => slot.Start == FutureAt(17, 0) && slot.Available);
        Assert.DoesNotContain(result.Value, slot => TimeOnly.FromDateTime(slot.Start) > new TimeOnly(20, 30));
    }

    private static BookingSnapshot Snapshot(params BookingDto[] bookings) => new(Seed.Restaurants, bookings);
    private static DateTime FutureAt(int hour, int minute) => new(2026, 5, 16, hour, minute, 0);
}
