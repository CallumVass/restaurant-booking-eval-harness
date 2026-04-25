using RestaurantBooking.Api.Bookings;

namespace RestaurantBooking.Api.Tests;

public sealed class BookingRulesTests
{
    [Theory]
    [InlineData("2030-01-01T18:00:00Z", "2030-01-01T19:30:00Z", false)]
    [InlineData("2030-01-01T18:30:00Z", "2030-01-01T19:30:00Z", true)]
    [InlineData("2030-01-01T16:30:00Z", "2030-01-01T18:00:00Z", false)]
    public void Overlap_detection_treats_touching_edges_as_available(string newStart, string existingStart, bool expected)
    {
        var newStartsAt = DateTimeOffset.Parse(newStart);
        var existingStartsAt = DateTimeOffset.Parse(existingStart);

        var overlaps = BookingRules.Overlaps(
            newStartsAt,
            newStartsAt.Add(BookingRules.BookingDuration),
            existingStartsAt,
            existingStartsAt.Add(BookingRules.BookingDuration));

        Assert.Equal(expected, overlaps);
    }
}
