using RestaurantBooking.Domain;
using RestaurantBooking.Domain.Errors;

namespace RestaurantBooking.Tests;

public class BookingServiceTests
{
    private static readonly Restaurant TestRestaurant = new()
    {
        Id = "r1",
        Name = "Test Restaurant",
        Cuisine = "Italian",
        Address = "123 Test St",
        Tables = new List<Table>
        {
            new() { Id = "t1", Capacity = 2, Label = "Small" },
            new() { Id = "t2", Capacity = 4, Label = "Medium" },
            new() { Id = "t3", Capacity = 8, Label = "Large" }
        }
    };

    private static readonly DateTime Tomorrow = DateTime.UtcNow.Date.AddDays(1).AddHours(18);

    [Fact]
    public void TryBook_PartySizeZero_ReturnsInvalidPartySize()
    {
        var request = new BookingRequest("r1", "t1", "Bob", "bob@test.com", 0, Tomorrow);

        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("InvalidPartySize", result.Error!.Code);
        Assert.Contains("at least 1", result.Error.Message);
    }

    [Fact]
    public void TryBook_PartySizeExceedsTableCapacity_ReturnsInvalidPartySize()
    {
        var request = new BookingRequest("r1", "t1", "Bob", "bob@test.com", 5, Tomorrow);

        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("InvalidPartySize", result.Error!.Code);
        Assert.Contains("capacity", result.Error.Message);
    }

    [Fact]
    public void TryBook_PartySizeNegative_ReturnsInvalidPartySize()
    {
        var request = new BookingRequest("r1", "t1", "Bob", "bob@test.com", -1, Tomorrow);

        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("InvalidPartySize", result.Error!.Code);
    }

    [Fact]
    public void TryBook_PastDateTime_ReturnsInvalidDateTime()
    {
        // Use a time that is within operating hours but in the past
        var now = DateTime.UtcNow;
        var hourNow = TimeOnly.FromDateTime(now);
        DateTime pastTime;

        if (hourNow >= BookingService.OperatingStart && hourNow < BookingService.OperatingEnd)
        {
            pastTime = now.AddHours(-1);
        }
        else
        {
            // If not in operating hours, use yesterday at 18:00
            pastTime = now.Date.AddDays(-1).AddHours(18);
        }

        var request = new BookingRequest("r1", "t1", "Bob", "bob@test.com", 2, pastTime);

        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("InvalidDateTime", result.Error!.Code);
    }

    [Fact]
    public void TryBook_BeforeOperatingHours_ReturnsInvalidDateTime()
    {
        var earlyTime = Tomorrow.Date.AddHours(9); // 09:00 - before 11:00
        var request = new BookingRequest("r1", "t2", "Bob", "bob@test.com", 3, earlyTime);

        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("InvalidDateTime", result.Error!.Code);
    }

    [Fact]
    public void TryBook_AtOperatingEnd_ReturnsInvalidDateTime()
    {
        var lateTime = Tomorrow.Date.AddHours(22); // 22:00 - at closing
        var request = new BookingRequest("r1", "t2", "Bob", "bob@test.com", 3, lateTime);

        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("InvalidDateTime", result.Error!.Code);
    }

    [Fact]
    public void TryBook_UnknownRestaurant_ReturnsRestaurantNotFound()
    {
        var request = new BookingRequest("nonexistent", "t1", "Bob", "bob@test.com", 2, Tomorrow);

        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("RestaurantNotFound", result.Error!.Code);
    }

    [Fact]
    public void TryBook_UnknownTable_ReturnsTableNotFound()
    {
        var request = new BookingRequest("r1", "nonexistent", "Bob", "bob@test.com", 2, Tomorrow);

        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("TableNotFound", result.Error!.Code);
    }

    [Fact]
    public void TryBook_ValidBooking_Succeeds()
    {
        var request = new BookingRequest("r1", "t2", "Alice", "alice@test.com", 3, Tomorrow);

        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal("r1", result.Value.RestaurantId);
        Assert.Equal("t2", result.Value.TableId);
        Assert.Equal("Alice", result.Value.CustomerName);
        Assert.Equal(3, result.Value.PartySize);
        Assert.NotEmpty(result.Value.Id);
    }

    [Fact]
    public void TryBook_ExactPartySizeMatchesCapacity_Succeeds()
    {
        var request = new BookingRequest("r1", "t1", "Bob", "bob@test.com", 2, Tomorrow);

        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.True(result.IsSuccess);
    }

    [Fact]
    public void TryBook_LastSlotBeforeClosing_Succeeds()
    {
        var lateTime = Tomorrow.Date.AddHours(21).AddMinutes(30); // 21:30
        var request = new BookingRequest("r1", "t2", "Bob", "bob@test.com", 2, lateTime);

        var result = BookingService.TryBook(TestRestaurant, [], request);

        Assert.True(result.IsSuccess);
    }
}
