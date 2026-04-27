using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Tests;

public sealed class BookingRulesTests
{
    private static readonly DateOnly Today = new(2026, 5, 1);
    private static readonly DateOnly BookingDate = new(2026, 5, 2);
    private static readonly Restaurant Restaurant = new(
        "test-kitchen",
        "Test Kitchen",
        "Test",
        "Lab",
        "Boundary testing restaurant.",
        [new Table("two-top", 2), new Table("four-top", 4)]);

    [Theory]
    [InlineData(0)]
    [InlineData(9)]
    public void CreateBookingRejectsInvalidPartySize(int partySize)
    {
        var result = BookingRules.CreateBooking([Restaurant], [], Request(partySize: partySize), "booking-1", Today);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingErrorCode.InvalidPartySize, result.Error.Code);
    }

    [Fact]
    public void CreateBookingRejectsPastDate()
    {
        var result = BookingRules.CreateBooking([Restaurant], [], Request(date: Today.AddDays(-1)), "booking-1", Today);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingErrorCode.InvalidDate, result.Error.Code);
    }

    [Theory]
    [InlineData(16, 30)]
    [InlineData(18, 15)]
    [InlineData(21, 0)]
    public void CreateBookingRejectsInvalidTime(int hour, int minute)
    {
        var result = BookingRules.CreateBooking([Restaurant], [], Request(startTime: new TimeOnly(hour, minute)), "booking-1", Today);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingErrorCode.InvalidTime, result.Error.Code);
    }

    [Fact]
    public void CreateBookingRejectsUnknownRestaurant()
    {
        var result = BookingRules.CreateBooking([Restaurant], [], Request(restaurantId: "missing"), "booking-1", Today);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingErrorCode.UnknownRestaurant, result.Error.Code);
    }

    [Fact]
    public void CreateBookingAllowsExactEdgeNonOverlapOnSameTable()
    {
        var existing = Existing("four-top", new TimeOnly(17, 0), new TimeOnly(18, 30));

        var result = BookingRules.CreateBooking([Restaurant], [existing], Request(startTime: new TimeOnly(18, 30), partySize: 4), "booking-2", Today);

        Assert.True(result.IsSuccess);
        Assert.Equal("four-top", result.Value?.TableId);
    }

    [Theory]
    [InlineData(17, 30)]
    [InlineData(17, 0)]
    public void CreateBookingRejectsOverlappingReservationWhenOnlyMatchingTableIsBusy(int hour, int minute)
    {
        var existing = Existing("four-top", new TimeOnly(17, 0), new TimeOnly(18, 30));

        var result = BookingRules.CreateBooking([Restaurant], [existing], Request(startTime: new TimeOnly(hour, minute), partySize: 4), "booking-2", Today);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingErrorCode.OverlappingReservation, result.Error.Code);
    }

    [Fact]
    public void CreateBookingRejectsReservationThatEnvelopsExistingBooking()
    {
        var existing = Existing("four-top", new TimeOnly(17, 30), new TimeOnly(18, 0));

        var result = BookingRules.CreateBooking([Restaurant], [existing], Request(startTime: new TimeOnly(17, 0), partySize: 4), "booking-2", Today);
        Assert.False(result.IsSuccess);
        Assert.Equal(BookingErrorCode.OverlappingReservation, result.Error.Code);
    }

    [Fact]
    public void CreateBookingRejectsPartyTooLargeForAnyTable()
    {
        var result = BookingRules.CreateBooking([Restaurant], [], Request(partySize: 5), "booking-1", Today);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingErrorCode.NoCapacity, result.Error.Code);
    }

    [Fact]
    public void AvailableSlotsExcludeConflictingTimesAndKeepLaterSlots()
    {
        var existing = Existing("four-top", new TimeOnly(17, 30), new TimeOnly(19, 0));

        var result = BookingRules.ListAvailableSlots([Restaurant], [existing], Restaurant.Id, BookingDate, 4, Today);

        Assert.True(result.IsSuccess);
        Assert.DoesNotContain(result.Value!, slot => slot.StartTime == new TimeOnly(17, 0));
        Assert.DoesNotContain(result.Value!, slot => slot.StartTime == new TimeOnly(18, 30));
        Assert.Contains(result.Value!, slot => slot.StartTime == new TimeOnly(19, 0));
    }

    private static CreateBookingRequest Request(
        string restaurantId = "test-kitchen",
        int partySize = 2,
        DateOnly? date = null,
        TimeOnly? startTime = null) => new(
        restaurantId,
        "Ada Lovelace",
        "ada@example.com",
        partySize,
        date ?? BookingDate,
        startTime ?? new TimeOnly(17, 0));

    private static Booking Existing(string tableId, TimeOnly startTime, TimeOnly endTime) => new(
        "existing",
        Restaurant.Id,
        tableId,
        "Existing Guest",
        "existing@example.com",
        4,
        BookingDate,
        startTime,
        endTime);
}
