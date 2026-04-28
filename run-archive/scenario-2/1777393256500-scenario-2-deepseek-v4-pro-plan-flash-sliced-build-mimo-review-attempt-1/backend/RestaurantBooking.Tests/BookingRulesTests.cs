using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class BookingRulesTests
{
    private static readonly DateOnly Today = new(2026, 4, 25);
    private static readonly Restaurant Restaurant = new(
        "test",
        "Test Kitchen",
        "Test",
        "Test District",
        "A test restaurant.",
        [new("t2", 2), new("t4", 4)]);

    [Theory]
    [InlineData(0)]
    [InlineData(9)]
    public void CreateBookingRejectsInvalidPartySize(int partySize)
    {
        var result = BookingRules.CreateBooking(Restaurant, Request(partySize: partySize), Today, [], "b1");

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidPartySize, result.Error);
    }

    [Fact]
    public void CreateBookingRejectsUnknownRestaurant()
    {
        var result = BookingRules.CreateBooking(null, Request(), Today, [], "b1");

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.UnknownRestaurant, result.Error);
    }

    [Fact]
    public void CreateBookingRejectsPastDate()
    {
        var result = BookingRules.CreateBooking(Restaurant, Request(date: Today.AddDays(-1)), Today, [], "b1");

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidDate, result.Error);
    }

    [Fact]
    public void CreateBookingRejectsInvalidTime()
    {
        var result = BookingRules.CreateBooking(Restaurant, Request(time: new TimeOnly(16, 30)), Today, [], "b1");

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidTime, result.Error);
    }

    [Fact]
    public void CreateBookingAllowsAdjacentNonOverlappingBookingOnSameTable()
    {
        var existing = Existing("t4", new TimeOnly(17, 0));

        var result = BookingRules.CreateBooking(Restaurant, Request(time: new TimeOnly(19, 0), partySize: 4), Today, [existing], "b2");

        Assert.True(result.IsSuccess);
        Assert.Equal("t4", result.Value!.TableId);
    }

    [Fact]
    public void CreateBookingRejectsOverlappingReservationWhenNoSuitableTableIsFree()
    {
        var existing = Existing("t4", new TimeOnly(17, 0));

        var result = BookingRules.CreateBooking(Restaurant, Request(time: new TimeOnly(18, 0), partySize: 4), Today, [existing], "b2");

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.OverlappingReservation, result.Error);
    }

    [Fact]
    public void AvailableSlotsRejectsPartyThatExceedsCapacity()
    {
        var result = BookingRules.AvailableSlots(Restaurant, Today, 6, Today, []);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.NoTableForPartySize, result.Error);
    }

    private static CreateBookingRequest Request(DateOnly? date = null, TimeOnly? time = null, int partySize = 2) =>
        new("test", date ?? Today, time ?? new TimeOnly(17, 0), partySize, "Avery Stone", "avery@example.com");

    private static Booking Existing(string tableId, TimeOnly time) =>
        new("existing", "test", "Test Kitchen", tableId, 4, Today, time, "Guest", "guest@example.com", "");
}
