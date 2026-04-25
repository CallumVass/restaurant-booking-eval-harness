// pattern: Functional Core

using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Tests.Domain;

public class BookingValidatorTests
{
    [Theory]
    [InlineData(0, 4, "Party size must be greater than 0.")]
    [InlineData(-1, 4, "Party size must be greater than 0.")]
    [InlineData(5, 4, "Party size (5) exceeds table capacity (4).")]
    public void ValidatePartySize_Invalid_ReturnsError(int partySize, int capacity, string expectedMessage)
    {
        var error = BookingValidator.ValidatePartySize(partySize, capacity);
        Assert.NotNull(error);
        Assert.Equal(BookingErrorType.InvalidPartySize, error.Type);
        Assert.Equal(expectedMessage, error.Message);
    }

    [Fact]
    public void ValidatePartySize_Valid_ReturnsNull()
    {
        var error = BookingValidator.ValidatePartySize(3, 4);
        Assert.Null(error);
    }

    [Fact]
    public void ValidateBookingTime_PastDate_ReturnsError()
    {
        var now = new DateTime(2025, 1, 15, 12, 0, 0);
        var start = new DateTime(2025, 1, 14, 12, 0, 0);
        var error = BookingValidator.ValidateBookingTime(start, now);
        Assert.NotNull(error);
        Assert.Equal(BookingErrorType.InvalidDateTime, error.Type);
    }

    [Fact]
    public void ValidateBookingTime_OutsideHours_ReturnsError()
    {
        var now = new DateTime(2025, 1, 15, 12, 0, 0);
        var start = new DateTime(2025, 1, 16, 10, 0, 0);
        var error = BookingValidator.ValidateBookingTime(start, now);
        Assert.NotNull(error);
        Assert.Equal(BookingErrorType.InvalidDateTime, error.Type);
    }

    [Fact]
    public void ValidateBookingTime_NotOnHour_ReturnsError()
    {
        var now = new DateTime(2025, 1, 15, 12, 0, 0);
        var start = new DateTime(2025, 1, 16, 12, 30, 0);
        var error = BookingValidator.ValidateBookingTime(start, now);
        Assert.NotNull(error);
        Assert.Equal(BookingErrorType.InvalidDateTime, error.Type);
    }

    [Fact]
    public void ValidateBookingTime_Valid_ReturnsNull()
    {
        var now = new DateTime(2025, 1, 15, 12, 0, 0);
        var start = new DateTime(2025, 1, 16, 14, 0, 0);
        var error = BookingValidator.ValidateBookingTime(start, now);
        Assert.Null(error);
    }

    [Fact]
    public void Overlaps_ReturnsTrueWhenOverlapping()
    {
        var existing = new Booking(
            Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(),
            new DateTime(2025, 1, 16, 12, 0, 0),
            new DateTime(2025, 1, 16, 14, 0, 0),
            2, "A", "a@example.com");

        var start = new DateTime(2025, 1, 16, 13, 0, 0);
        var end = new DateTime(2025, 1, 16, 15, 0, 0);
        Assert.True(BookingValidator.Overlaps(existing, start, end));
    }

    [Fact]
    public void Overlaps_ReturnsFalseWhenNotOverlapping()
    {
        var existing = new Booking(
            Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid(),
            new DateTime(2025, 1, 16, 12, 0, 0),
            new DateTime(2025, 1, 16, 14, 0, 0),
            2, "A", "a@example.com");

        var start = new DateTime(2025, 1, 16, 14, 0, 0);
        var end = new DateTime(2025, 1, 16, 16, 0, 0);
        Assert.False(BookingValidator.Overlaps(existing, start, end));
    }
}
