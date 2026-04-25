using RestaurantBooking.Domain;
using RestaurantBooking.Seeding;
using Xunit;

namespace RestaurantBooking.Tests;

public class BookingDomainTests
{
    private static readonly IReadOnlyList<Restaurant> Restaurants = SeedData.Restaurants;
    private static readonly IReadOnlyList<Table> Tables = SeedData.Tables;
    private static readonly IReadOnlyList<Booking> EmptyBookings = [];
    private static readonly DateOnly Tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

    [Fact]
    public void GetAvailableSlots_ReturnsSlots_WhenValidRequest()
    {
        var result = BookingDomain.GetAvailableSlots(
            Restaurants, Tables, EmptyBookings, "r1", Tomorrow, 2);

        Assert.True(result.IsSuccess);
        Assert.NotEmpty(result.Value!);
    }

    [Fact]
    public void GetAvailableSlots_ReturnsError_ForUnknownRestaurant()
    {
        var result = BookingDomain.GetAvailableSlots(
            Restaurants, Tables, EmptyBookings, "unknown", Tomorrow, 2);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.UnknownRestaurant>(result.Error);
    }

    [Fact]
    public void GetAvailableSlots_ReturnsError_ForZeroPartySize()
    {
        var result = BookingDomain.GetAvailableSlots(
            Restaurants, Tables, EmptyBookings, "r1", Tomorrow, 0);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidPartySize>(result.Error);
    }

    [Fact]
    public void GetAvailableSlots_ReturnsError_ForNegativePartySize()
    {
        var result = BookingDomain.GetAvailableSlots(
            Restaurants, Tables, EmptyBookings, "r1", Tomorrow, -1);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidPartySize>(result.Error);
    }

    [Fact]
    public void GetAvailableSlots_ReturnsError_ForPartySizeExceedingMaxTable()
    {
        var result = BookingDomain.GetAvailableSlots(
            Restaurants, Tables, EmptyBookings, "r1", Tomorrow, 100);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidPartySize>(result.Error);
    }

    [Fact]
    public void GetAvailableSlots_ReturnsError_ForPastDate()
    {
        var pastDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1));
        var result = BookingDomain.GetAvailableSlots(
            Restaurants, Tables, EmptyBookings, "r1", pastDate, 2);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidDate>(result.Error);
    }

    [Fact]
    public void GetAvailableSlots_FiltersOutBookedSlotsForSameTable()
    {
        var booking = new Booking("b1", "r1", "t1", "Alice", Tomorrow, new TimeOnly(17, 0), 2);
        var bookings = new List<Booking> { booking };

        var result = BookingDomain.GetAvailableSlots(
            Restaurants, Tables, bookings, "r1", Tomorrow, 2);

        Assert.True(result.IsSuccess);
        var slotsAt17ForBookedTable = result.Value!.Where(s => s.Time == new TimeOnly(17, 0) && s.TableId == "t1").ToList();
        Assert.Empty(slotsAt17ForBookedTable);
    }

    [Fact]
    public void GetAvailableSlots_OnlyReturnsTablesThatFitPartySize()
    {
        var result = BookingDomain.GetAvailableSlots(
            Restaurants, Tables, EmptyBookings, "r1", Tomorrow, 6);

        Assert.True(result.IsSuccess);
        Assert.All(result.Value!, s =>
        {
            var table = Tables.First(t => t.Id == s.TableId);
            Assert.True(table.Seats >= 6);
        });
    }

    [Fact]
    public void TryBook_Succeeds_WhenValid()
    {
        var result = BookingDomain.TryBook(
            Restaurants, Tables, EmptyBookings,
            "r1", "t1", "Alice", Tomorrow, new TimeOnly(17, 0), 2);

        Assert.True(result.IsSuccess);
        Assert.Equal("Alice", result.Value!.CustomerName);
        Assert.Equal("r1", result.Value!.RestaurantId);
    }

    [Fact]
    public void TryBook_Rejects_OverlappingReservation()
    {
        var existing = new Booking("b1", "r1", "t1", "Bob", Tomorrow, new TimeOnly(17, 0), 2);
        var bookings = new List<Booking> { existing };

        var result = BookingDomain.TryBook(
            Restaurants, Tables, bookings,
            "r1", "t1", "Alice", Tomorrow, new TimeOnly(17, 0), 2);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.OverlappingReservation>(result.Error);
    }

    [Fact]
    public void TryBook_AllowsDifferentTime_SameTable()
    {
        var existing = new Booking("b1", "r1", "t1", "Bob", Tomorrow, new TimeOnly(17, 0), 2);
        var bookings = new List<Booking> { existing };

        var result = BookingDomain.TryBook(
            Restaurants, Tables, bookings,
            "r1", "t1", "Alice", Tomorrow, new TimeOnly(18, 0), 2);

        Assert.True(result.IsSuccess);
    }

    [Fact]
    public void TryBook_Rejects_InvalidPartySize()
    {
        var result = BookingDomain.TryBook(
            Restaurants, Tables, EmptyBookings,
            "r1", "t1", "Alice", Tomorrow, new TimeOnly(17, 0), 0);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidPartySize>(result.Error);
    }

    [Fact]
    public void TryBook_Rejects_PartySizeExceedingTableCapacity()
    {
        var result = BookingDomain.TryBook(
            Restaurants, Tables, EmptyBookings,
            "r1", "t1", "Alice", Tomorrow, new TimeOnly(17, 0), 10);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidPartySize>(result.Error);
    }

    [Fact]
    public void TryBook_Rejects_InvalidTime_TooEarly()
    {
        var result = BookingDomain.TryBook(
            Restaurants, Tables, EmptyBookings,
            "r1", "t1", "Alice", Tomorrow, new TimeOnly(12, 0), 2);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidTimeSlot>(result.Error);
    }

    [Fact]
    public void TryBook_Rejects_InvalidTime_TooLate()
    {
        var result = BookingDomain.TryBook(
            Restaurants, Tables, EmptyBookings,
            "r1", "t1", "Alice", Tomorrow, new TimeOnly(22, 0), 2);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidTimeSlot>(result.Error);
    }

    [Fact]
    public void TryBook_Rejects_NonHourTime()
    {
        var result = BookingDomain.TryBook(
            Restaurants, Tables, EmptyBookings,
            "r1", "t1", "Alice", Tomorrow, new TimeOnly(17, 30), 2);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidTimeSlot>(result.Error);
    }

    [Fact]
    public void TryBook_Rejects_PastDate()
    {
        var pastDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1));
        var result = BookingDomain.TryBook(
            Restaurants, Tables, EmptyBookings,
            "r1", "t1", "Alice", pastDate, new TimeOnly(17, 0), 2);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidDate>(result.Error);
    }

    [Fact]
    public void TryBook_Rejects_UnknownRestaurant()
    {
        var result = BookingDomain.TryBook(
            Restaurants, Tables, EmptyBookings,
            "unknown", "t1", "Alice", Tomorrow, new TimeOnly(17, 0), 2);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.UnknownRestaurant>(result.Error);
    }

    [Fact]
    public void TryBook_Rejects_UnknownTable()
    {
        var result = BookingDomain.TryBook(
            Restaurants, Tables, EmptyBookings,
            "r1", "unknown", "Alice", Tomorrow, new TimeOnly(17, 0), 2);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidTimeSlot>(result.Error);
    }

    [Fact]
    public void TryBook_Rejects_TableFromDifferentRestaurant()
    {
        var result = BookingDomain.TryBook(
            Restaurants, Tables, EmptyBookings,
            "r1", "t4", "Alice", Tomorrow, new TimeOnly(17, 0), 2);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidTimeSlot>(result.Error);
    }
}