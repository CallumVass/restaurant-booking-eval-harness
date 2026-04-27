// pattern: Mixed (unavoidable - test file)

using RestaurantBooking.Domain;

namespace RestaurantBooking.Tests.Domain;

public class ValidationRulesTests
{
    [Theory]
    [InlineData(1)]
    [InlineData(10)]
    [InlineData(20)]
    public void ValidatePartySize_ValidSizes_ReturnsNull(int size)
    {
        var result = ValidationRules.ValidatePartySize(size);
        Assert.Null(result);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    [InlineData(21)]
    [InlineData(100)]
    public void ValidatePartySize_InvalidSizes_ReturnsError(int size)
    {
        var result = ValidationRules.ValidatePartySize(size);
        Assert.NotNull(result);
        Assert.IsType<Error.InvalidPartySize>(result);
    }

    [Fact]
    public void ValidateBookingDateTime_FutureTime_ReturnsNull()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var time = new TimeOnly(12, 0);
        var result = ValidationRules.ValidateBookingDateTime(date, time);
        Assert.Null(result);
    }

    [Fact]
    public void ValidateBookingDateTime_PastDate_ReturnsError()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1));
        var time = new TimeOnly(12, 0);
        var result = ValidationRules.ValidateBookingDateTime(date, time);
        Assert.NotNull(result);
        Assert.IsType<Error.InvalidDateTime>(result);
    }

    [Fact]
    public void ValidateBookingDateTime_BeforeOpening_ReturnsError()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var time = new TimeOnly(8, 0);
        var result = ValidationRules.ValidateBookingDateTime(date, time);
        Assert.NotNull(result);
        Assert.IsType<Error.InvalidDateTime>(result);
    }

    [Fact]
    public void ValidateBookingDateTime_AfterLastSeating_ReturnsError()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var time = new TimeOnly(22, 0);
        var result = ValidationRules.ValidateBookingDateTime(date, time);
        Assert.NotNull(result);
        Assert.IsType<Error.InvalidDateTime>(result);
    }

    [Fact]
    public void ValidateBookingDateTime_NonIncrementTime_ReturnsError()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var time = new TimeOnly(12, 7);
        var result = ValidationRules.ValidateBookingDateTime(date, time);
        Assert.NotNull(result);
        Assert.IsType<Error.InvalidDateTime>(result);
    }

    [Fact]
    public void IsTableSuitable_EnoughCapacity_ReturnsTrue()
    {
        var table = new Table(Guid.NewGuid(), 6);
        Assert.True(ValidationRules.IsTableSuitable(table, 4));
    }

    [Fact]
    public void IsTableSuitable_ExactCapacity_ReturnsTrue()
    {
        var table = new Table(Guid.NewGuid(), 4);
        Assert.True(ValidationRules.IsTableSuitable(table, 4));
    }

    [Fact]
    public void IsTableSuitable_InsufficientCapacity_ReturnsFalse()
    {
        var table = new Table(Guid.NewGuid(), 2);
        Assert.False(ValidationRules.IsTableSuitable(table, 4));
    }

    [Fact]
    public void GetBookingWindow_ReturnsCorrectDuration()
    {
        var time = new TimeOnly(12, 0);
        var (start, end) = ValidationRules.GetBookingWindow(time);
        Assert.Equal(time, start);
        Assert.Equal(new TimeOnly(13, 30), end);
    }
}
