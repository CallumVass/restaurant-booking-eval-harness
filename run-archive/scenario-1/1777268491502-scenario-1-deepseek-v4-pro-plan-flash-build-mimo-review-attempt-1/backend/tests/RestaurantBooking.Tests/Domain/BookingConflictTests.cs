// pattern: Mixed (unavoidable - test file)

using RestaurantBooking.Domain;

namespace RestaurantBooking.Tests.Domain;

public class BookingConflictTests
{
    [Fact]
    public void HasOverlap_NoExistingBookings_ReturnsFalse()
    {
        var result = BookingConflict.HasOverlap(
            new TimeOnly(12, 0), new TimeOnly(13, 30),
            [], Guid.NewGuid(), DateOnly.FromDateTime(DateTime.UtcNow));
        Assert.False(result);
    }

    [Fact]
    public void HasOverlap_SameTimeSlot_ReturnsTrue()
    {
        var tableId = Guid.NewGuid();
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var existing = new List<Booking>
        {
            new(Guid.NewGuid(), Guid.NewGuid(), tableId, date, new TimeOnly(12, 0),
                4, "John", "john@test.com", DateTime.UtcNow)
        };

        var result = BookingConflict.HasOverlap(
            new TimeOnly(12, 0), new TimeOnly(13, 30),
            existing, tableId, date);
        Assert.True(result);
    }

    [Fact]
    public void HasOverlap_OverlappingEndTime_ReturnsTrue()
    {
        var tableId = Guid.NewGuid();
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var existing = new List<Booking>
        {
            new(Guid.NewGuid(), Guid.NewGuid(), tableId, date, new TimeOnly(12, 0),
                4, "John", "john@test.com", DateTime.UtcNow)
        };

        var result = BookingConflict.HasOverlap(
            new TimeOnly(13, 0), new TimeOnly(14, 30),
            existing, tableId, date);
        Assert.True(result);
    }

    [Fact]
    public void HasOverlap_AdjacentSlotNoOverlap_ReturnsFalse()
    {
        var tableId = Guid.NewGuid();
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var existing = new List<Booking>
        {
            new(Guid.NewGuid(), Guid.NewGuid(), tableId, date, new TimeOnly(12, 0),
                4, "John", "john@test.com", DateTime.UtcNow)
        };

        var result = BookingConflict.HasOverlap(
            new TimeOnly(13, 30), new TimeOnly(15, 0),
            existing, tableId, date);
        Assert.False(result);
    }

    [Fact]
    public void HasOverlap_DifferentTable_ReturnsFalse()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var existing = new List<Booking>
        {
            new(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(), date, new TimeOnly(12, 0),
                4, "John", "john@test.com", DateTime.UtcNow)
        };

        var result = BookingConflict.HasOverlap(
            new TimeOnly(12, 0), new TimeOnly(13, 30),
            existing, Guid.NewGuid(), date);
        Assert.False(result);
    }

    [Fact]
    public void HasOverlap_DifferentDate_ReturnsFalse()
    {
        var tableId = Guid.NewGuid();
        var existing = new List<Booking>
        {
            new(Guid.NewGuid(), Guid.NewGuid(), tableId, DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
                new TimeOnly(12, 0), 4, "John", "john@test.com", DateTime.UtcNow)
        };

        var result = BookingConflict.HasOverlap(
            new TimeOnly(12, 0), new TimeOnly(13, 30),
            existing, tableId, DateOnly.FromDateTime(DateTime.UtcNow.AddDays(2)));
        Assert.False(result);
    }
}
