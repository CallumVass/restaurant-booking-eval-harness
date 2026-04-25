using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Api.Tests;

public class BookingServiceTests
{
    private static readonly Restaurant TestRestaurant = new(1, "Test", [
        new Table(1, 1, 2),
        new Table(2, 1, 4),
        new Table(3, 1, 6),
        new Table(4, 1, 8)
    ]);

    private static readonly DateOnly Tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

    [Fact]
    public void ValidBooking_Succeeds()
    {
        var request = new BookingRequest(1, "Alice", "alice@test.com", 2, Tomorrow, new TimeOnly(18, 0));
        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal("Alice", result.Value!.CustomerName);
    }

    [Fact]
    public void ZeroPartySize_ReturnsError()
    {
        var request = new BookingRequest(1, "Alice", "alice@test.com", 0, Tomorrow, new TimeOnly(18, 0));
        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Contains("greater than 0", result.Error);
    }

    [Fact]
    public void NegativePartySize_ReturnsError()
    {
        var request = new BookingRequest(1, "Alice", "alice@test.com", -1, Tomorrow, new TimeOnly(18, 0));
        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Contains("greater than 0", result.Error);
    }

    [Fact]
    public void PartySizeExceedsCapacity_ReturnsError()
    {
        var request = new BookingRequest(1, "Alice", "alice@test.com", 10, Tomorrow, new TimeOnly(18, 0));
        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Contains("exceeds maximum table capacity", result.Error);
    }

    [Fact]
    public void PastDate_ReturnsError()
    {
        var pastDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1));
        var request = new BookingRequest(1, "Alice", "alice@test.com", 2, pastDate, new TimeOnly(18, 0));
        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Contains("past", result.Error);
    }

    [Fact]
    public void BeforeOpeningTime_ReturnsError()
    {
        var request = new BookingRequest(1, "Alice", "alice@test.com", 2, Tomorrow, new TimeOnly(9, 0));
        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Contains("between", result.Error);
    }

    [Fact]
    public void AfterClosingTime_ReturnsError()
    {
        var request = new BookingRequest(1, "Alice", "alice@test.com", 2, Tomorrow, new TimeOnly(23, 0));
        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Contains("between", result.Error);
    }

    [Fact]
    public void BookingEndsAfterClosingTime_ReturnsError()
    {
        var request = new BookingRequest(1, "Alice", "alice@test.com", 2, Tomorrow, new TimeOnly(21, 0));
        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Contains("past closing time", result.Error);
    }

    [Fact]
    public void OverlappingBookings_Conflict()
    {
        var existing = new Booking("B1", 1, 4, "Bob", "bob@test.com", 8, Tomorrow, new TimeOnly(18, 0), new TimeOnly(19, 30), DateTime.UtcNow);
        var request = new BookingRequest(1, "Alice", "alice@test.com", 8, Tomorrow, new TimeOnly(18, 30));

        var result = BookingService.TryBook(TestRestaurant, [existing], request);

        Assert.False(result.IsSuccess);
        Assert.Contains("No table", result.Error);
    }

    [Fact]
    public void NonOverlappingBookings_Succeed()
    {
        var existing = new Booking("B1", 1, 1, "Bob", "bob@test.com", 2, Tomorrow, new TimeOnly(18, 0), new TimeOnly(19, 30), DateTime.UtcNow);
        var request = new BookingRequest(1, "Alice", "alice@test.com", 2, Tomorrow, new TimeOnly(20, 0));

        var result = BookingService.TryBook(TestRestaurant, [existing], request);

        Assert.True(result.IsSuccess);
    }

    [Fact]
    public void NonOverlappingDifferentTable_Succeed()
    {
        var existing = new Booking("B1", 1, 1, "Bob", "bob@test.com", 2, Tomorrow, new TimeOnly(18, 0), new TimeOnly(19, 30), DateTime.UtcNow);
        var request = new BookingRequest(1, "Alice", "alice@test.com", 4, Tomorrow, new TimeOnly(18, 0));

        var result = BookingService.TryBook(TestRestaurant, [existing], request);

        Assert.True(result.IsSuccess);
        Assert.NotEqual(1, result.Value!.TableId);
    }

    [Fact]
    public void NonOverlappingDifferentDate_Succeed()
    {
        var existing = new Booking("B1", 1, 1, "Bob", "bob@test.com", 2, Tomorrow, new TimeOnly(18, 0), new TimeOnly(19, 30), DateTime.UtcNow);
        var otherDate = Tomorrow.AddDays(1);
        var request = new BookingRequest(1, "Alice", "alice@test.com", 2, otherDate, new TimeOnly(18, 0));

        var result = BookingService.TryBook(TestRestaurant, [existing], request);

        Assert.True(result.IsSuccess);
    }

    [Fact]
    public void AvailableTimeSlots_ReturnsWindows()
    {
        var slots = BookingService.GetAvailableTimeSlots(TestRestaurant, [], Tomorrow, 2);

        Assert.NotEmpty(slots);
        Assert.All(slots, s =>
        {
            Assert.True(s.EndTime <= BookingService.ClosingTime);
            Assert.Equal(90, (s.EndTime.ToTimeSpan() - s.StartTime.ToTimeSpan()).TotalMinutes);
        });
    }

    [Fact]
    public void TimeSlots_FilterFullyBookedWindows()
    {
        var allBookings = new List<Booking>();
        var start = BookingService.OpeningTime;
        while (start.AddMinutes(90) <= BookingService.ClosingTime)
        {
            foreach (var table in TestRestaurant.Tables)
            {
                allBookings.Add(new Booking(Guid.NewGuid().ToString()[..12], 1, table.Id, "Guest", "g@test.com", 2, Tomorrow, start, start.AddMinutes(90), DateTime.UtcNow));
            }
            start = start.AddMinutes(30);
        }

        var slots = BookingService.GetAvailableTimeSlots(TestRestaurant, allBookings, Tomorrow, 2);
        Assert.Empty(slots);
    }

    [Fact]
    public void TimeSlots_NegativePartySize_ReturnsEmpty()
    {
        var slots = BookingService.GetAvailableTimeSlots(TestRestaurant, [], Tomorrow, -1);
        Assert.Empty(slots);
    }

    [Fact]
    public void TimeSlots_ZeroPartySize_ReturnsEmpty()
    {
        var slots = BookingService.GetAvailableTimeSlots(TestRestaurant, [], Tomorrow, 0);
        Assert.Empty(slots);
    }
}
