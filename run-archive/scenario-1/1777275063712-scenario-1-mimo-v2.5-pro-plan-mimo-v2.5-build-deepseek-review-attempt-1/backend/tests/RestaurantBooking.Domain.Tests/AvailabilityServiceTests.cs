using RestaurantBooking.Domain;

namespace RestaurantBooking.Domain.Tests;

public class AvailabilityServiceTests
{
    private static readonly Restaurant TestRestaurant = new(
        "r1", "Test Restaurant", "123 Test St", "Italian",
        new TimeOnly(11, 0), new TimeOnly(22, 0));

    private static readonly List<Table> TestTables =
    [
        new("t1", "r1", 2, "Patio"),
        new("t2", "r1", 4, "Main"),
        new("t3", "r1", 6, "Private")
    ];

    [Fact]
    public void GetAvailableSlots_InvalidPartySize_ReturnsInvalidPartySize()
    {
        var result = AvailabilityService.GetAvailableSlots(
            TestRestaurant, TestTables, [], DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)), 0);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidPartySize, result.Error);
    }

    [Fact]
    public void GetAvailableSlots_PastDate_ReturnsInvalidDate()
    {
        var result = AvailabilityService.GetAvailableSlots(
            TestRestaurant, TestTables, [], DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)), 2);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidDate, result.Error);
    }

    [Fact]
    public void GetAvailableSlots_NoSuitableTable_ReturnsNoAvailableTable()
    {
        var result = AvailabilityService.GetAvailableSlots(
            TestRestaurant, TestTables, [], DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)), 100);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.NoAvailableTable, result.Error);
    }

    [Fact]
    public void GetAvailableSlots_AllSlotsAvailable_ReturnsAllSlots()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var result = AvailabilityService.GetAvailableSlots(
            TestRestaurant, TestTables, [], tomorrow, 2);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.True(result.Value.Count > 0);
    }

    [Fact]
    public void GetAvailableSlots_ExistingBooking_ExcludesOccupiedSlots()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var existingBooking = new Booking(
            "b1", "r1", "t1", "John", 2, tomorrow,
            new TimeOnly(12, 0), new TimeOnly(13, 0), DateTime.UtcNow);

        var result = AvailabilityService.GetAvailableSlots(
            TestRestaurant, TestTables, [existingBooking], tomorrow, 2);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);

        var slotAt12 = result.Value.FirstOrDefault(s =>
            s.Slot.StartTime == new TimeOnly(12, 0) && s.TableId == "t1");
        Assert.Null(slotAt12);
    }

    [Fact]
    public void GetAvailableSlots_PartySizeLargerThanTable_SkipsSmallTables()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var result = AvailabilityService.GetAvailableSlots(
            TestRestaurant, TestTables, [], tomorrow, 5);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.All(result.Value, s => Assert.True(s.TableSeats >= 5));
    }
}
