using RestaurantBooking.Domain;

namespace RestaurantBooking.Tests;

public class BookingConflictTests
{
    private static readonly Restaurant TestRestaurant = new()
    {
        Id = "r1",
        Name = "Test Restaurant",
        Cuisine = "Italian",
        Address = "123 Test St",
        Tables = new List<Table>
        {
            new() { Id = "t1", Capacity = 4, Label = "Table 1" },
            new() { Id = "t2", Capacity = 4, Label = "Table 2" }
        }
    };

    private static readonly DateTime Tomorrow18 = DateTime.UtcNow.Date.AddDays(1).AddHours(18);
    private static readonly DateTime Tomorrow19 = DateTime.UtcNow.Date.AddDays(1).AddHours(19);
    private static readonly DateTime Tomorrow20 = DateTime.UtcNow.Date.AddDays(1).AddHours(20);

    [Fact]
    public void TryBook_NonOverlappingOnSameTable_Succeeds()
    {
        var existing = new Booking
        {
            Id = "existing",
            RestaurantId = "r1",
            TableId = "t1",
            CustomerName = "Alice",
            CustomerEmail = "alice@test.com",
            PartySize = 2,
            ReservationTime = Tomorrow18,
            DurationMinutes = 60
        };

        var request = new BookingRequest("r1", "t1", "Bob", "bob@test.com", 2, Tomorrow19); // 19:00, after existing ends at 19:00

        var result = BookingService.TryBook(TestRestaurant, [existing], request);

        Assert.True(result.IsSuccess);
    }

    [Fact]
    public void TryBook_OverlappingOnSameTable_ReturnsTimeConflict()
    {
        var existing = new Booking
        {
            Id = "existing",
            RestaurantId = "r1",
            TableId = "t1",
            CustomerName = "Alice",
            CustomerEmail = "alice@test.com",
            PartySize = 2,
            ReservationTime = Tomorrow18,
            DurationMinutes = 90 // 18:00 - 19:30
        };

        var request = new BookingRequest("r1", "t1", "Bob", "bob@test.com", 2,
            Tomorrow18.AddMinutes(30)); // 18:30, overlaps with existing

        var result = BookingService.TryBook(TestRestaurant, [existing], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("TimeConflict", result.Error!.Code);
    }

    [Fact]
    public void TryBook_SameTimeOnSameTable_ReturnsTimeConflict()
    {
        var existing = new Booking
        {
            Id = "existing",
            RestaurantId = "r1",
            TableId = "t1",
            CustomerName = "Alice",
            CustomerEmail = "alice@test.com",
            PartySize = 2,
            ReservationTime = Tomorrow18,
            DurationMinutes = 90
        };

        var request = new BookingRequest("r1", "t1", "Bob", "bob@test.com", 2, Tomorrow18);

        var result = BookingService.TryBook(TestRestaurant, [existing], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("TimeConflict", result.Error!.Code);
    }

    [Fact]
    public void TryBook_OverlappingOnDifferentTable_Succeeds()
    {
        var existing = new Booking
        {
            Id = "existing",
            RestaurantId = "r1",
            TableId = "t1",
            CustomerName = "Alice",
            CustomerEmail = "alice@test.com",
            PartySize = 2,
            ReservationTime = Tomorrow18,
            DurationMinutes = 90
        };

        var request = new BookingRequest("r1", "t2", "Bob", "bob@test.com", 2, Tomorrow18);

        var result = BookingService.TryBook(TestRestaurant, [existing], request);

        Assert.True(result.IsSuccess);
    }

    [Fact]
    public void TryBook_WrappingOverlap_ReturnsTimeConflict()
    {
        var existing = new Booking
        {
            Id = "existing",
            RestaurantId = "r1",
            TableId = "t1",
            CustomerName = "Alice",
            CustomerEmail = "alice@test.com",
            PartySize = 2,
            ReservationTime = Tomorrow18,
            DurationMinutes = 120 // 18:00 - 20:00
        };

        var request = new BookingRequest("r1", "t1", "Bob", "bob@test.com", 2, Tomorrow19); // 19:00, inside existing

        var result = BookingService.TryBook(TestRestaurant, [existing], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("TimeConflict", result.Error!.Code);
    }

    [Fact]
    public void TryBook_BackToBack_Succeeds()
    {
        var existing = new Booking
        {
            Id = "existing",
            RestaurantId = "r1",
            TableId = "t1",
            CustomerName = "Alice",
            CustomerEmail = "alice@test.com",
            PartySize = 2,
            ReservationTime = Tomorrow18,
            DurationMinutes = 60 // 18:00 - 19:00
        };

        var request = new BookingRequest("r1", "t1", "Bob", "bob@test.com", 2, Tomorrow19); // 19:00

        var result = BookingService.TryBook(TestRestaurant, [existing], request);

        Assert.True(result.IsSuccess);
    }

    [Fact]
    public void TryBook_ExistingBookingOnOtherRestaurant_NoConflict()
    {
        var existing = new Booking
        {
            Id = "existing",
            RestaurantId = "r2",
            TableId = "t1",
            CustomerName = "Alice",
            CustomerEmail = "alice@test.com",
            PartySize = 2,
            ReservationTime = Tomorrow18,
            DurationMinutes = 90
        };

        var request = new BookingRequest("r1", "t1", "Bob", "bob@test.com", 2, Tomorrow18);

        var result = BookingService.TryBook(TestRestaurant, [existing], request);

        Assert.True(result.IsSuccess);
    }
}
