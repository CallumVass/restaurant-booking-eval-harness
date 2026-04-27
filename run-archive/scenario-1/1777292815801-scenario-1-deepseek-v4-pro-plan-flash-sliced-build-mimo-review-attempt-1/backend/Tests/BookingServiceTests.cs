using Backend.Domain;
using Backend.UseCases;

namespace Backend.Tests;

public class BookingServiceTests
{
    private static readonly DateTime FutureNow = new(2026, 1, 1, 0, 0, 0, DateTimeKind.Local);

    private static readonly Table[] Tables =
    [
        new("t1", "rest-1", 2, "Small"),
        new("t2", "rest-1", 4, "Medium"),
        new("t3", "rest-1", 6, "Large"),
    ];

    [Fact]
    public void CreateBooking_AllTablesBooked_ReturnsFailure()
    {
        var allBooked = Tables.Select(t => new Booking(
            Guid.NewGuid().ToString(), "rest-1", t.Id, "John", "john@test.com", 2,
            new DateTime(2026, 6, 15, 12, 0, 0), TimeSpan.FromHours(1.5))).ToArray();

        var request = new CreateBookingRequest("Jane", "jane@test.com", 2,
            new DateTime(2026, 6, 15, 12, 30, 0));

        var result = BookingService.CreateBooking("rest-1", request, Tables, allBooked, FutureNow);

        Assert.False(result.IsSuccess);
    }

    [Fact]
    public void CreateBooking_AdjacentNonOverlappingTime_ReturnsSuccess()
    {
        var existing = new Booking("b1", "rest-1", "t1", "John", "john@test.com", 2,
            new DateTime(2026, 6, 15, 11, 0, 0), TimeSpan.FromHours(1.5));

        var request = new CreateBookingRequest("Jane", "jane@test.com", 2,
            new DateTime(2026, 6, 15, 12, 30, 0));

        var result = BookingService.CreateBooking("rest-1", request, Tables, [existing], FutureNow);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void CreateBooking_InvalidPartySize_ReturnsError(int partySize)
    {
        var request = new CreateBookingRequest("Jane", "jane@test.com", partySize,
            new DateTime(2026, 6, 15, 12, 0, 0));

        var result = BookingService.CreateBooking("rest-1", request, Tables, [], FutureNow);

        Assert.False(result.IsSuccess);
        Assert.Equal("Party size must be at least 1", result.Error);
    }

    [Fact]
    public void CreateBooking_PastDate_ReturnsError()
    {
        var request = new CreateBookingRequest("Jane", "jane@test.com", 2,
            new DateTime(2020, 1, 1, 12, 0, 0));

        var result = BookingService.CreateBooking("rest-1", request, Tables, [], FutureNow);

        Assert.False(result.IsSuccess);
        Assert.Equal("Booking must be in the future", result.Error);
    }

    [Fact]
    public void CreateBooking_TimeOutsideOperatingHours_ReturnsError()
    {
        var request = new CreateBookingRequest("Jane", "jane@test.com", 2,
            new DateTime(2026, 6, 15, 9, 0, 0));

        var result = BookingService.CreateBooking("rest-1", request, Tables, [], FutureNow);

        Assert.False(result.IsSuccess);
        Assert.Equal("Booking time must be between 11:00 and 20:30", result.Error);
    }

    [Fact]
    public void CreateBooking_UnknownRestaurant_ReturnsError()
    {
        var request = new CreateBookingRequest("Jane", "jane@test.com", 2,
            new DateTime(2026, 6, 15, 12, 0, 0));

        var result = BookingService.CreateBooking("unknown", request, Tables, [], FutureNow);

        Assert.False(result.IsSuccess);
        Assert.Equal("Restaurant not found", result.Error);
    }

    [Fact]
    public void CreateBooking_AssignsSmallestTableThatFits()
    {
        var request = new CreateBookingRequest("Jane", "jane@test.com", 3,
            new DateTime(2026, 6, 15, 12, 0, 0));

        var result = BookingService.CreateBooking("rest-1", request, Tables, [], FutureNow);

        Assert.True(result.IsSuccess);
        Assert.Equal("t2", result.Value!.TableId);
    }

    [Fact]
    public void GetAvailableSlots_ReturnsAllSlotsForEmptyRestaurant()
    {
        var slots = BookingService.GetAvailableSlots("rest-1", new DateOnly(2026, 6, 15), 2, Tables, []);

        Assert.Equal(20, slots.Count);
        Assert.Equal(new TimeOnly(11, 0), slots[0]);
        Assert.Equal(new TimeOnly(20, 30), slots[^1]);
    }

    [Fact]
    public void GetAvailableSlots_ExcludesSlotsWhenAllTablesAreOccupied()
    {
        var allBooked = Tables.Select(t => new Booking(
            Guid.NewGuid().ToString(), "rest-1", t.Id, "John", "john@test.com", 2,
            new DateTime(2026, 6, 15, 12, 0, 0), TimeSpan.FromHours(1.5))).ToArray();

        var slots = BookingService.GetAvailableSlots("rest-1", new DateOnly(2026, 6, 15), 2, Tables, allBooked);

        Assert.DoesNotContain(new TimeOnly(12, 0), slots);
        Assert.DoesNotContain(new TimeOnly(12, 30), slots);
        Assert.DoesNotContain(new TimeOnly(13, 0), slots);

        Assert.Contains(new TimeOnly(13, 30), slots);
    }
}
