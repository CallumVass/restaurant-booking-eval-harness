using RestaurantBooking.Domain;

namespace RestaurantBooking.Domain.Tests;

public class BookingServiceTests
{
    private static readonly Restaurant TestRestaurant = new(
        "r1", "Test Restaurant", "123 Test St", "Italian",
        new TimeOnly(11, 0), new TimeOnly(22, 0));

    private static readonly List<Table> TestTables =
    [
        new("t1", "r1", 2, "Patio"),
        new("t2", "r1", 4, "Main")
    ];

    private static BookingRequest ValidRequest(DateOnly? date = null, TimeOnly? start = null, TimeOnly? end = null) =>
        new("r1", "Jane Doe", 2,
            date ?? DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            start ?? new TimeOnly(12, 0),
            end ?? new TimeOnly(13, 0));

    [Fact]
    public void CreateBooking_ValidRequest_ReturnsSuccess()
    {
        var result = BookingService.CreateBooking([], TestTables, TestRestaurant, ValidRequest());

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal("Jane Doe", result.Value.CustomerName);
    }

    [Fact]
    public void CreateBooking_InvalidPartySize_ReturnsInvalidPartySize()
    {
        var request = ValidRequest() with { PartySize = 0 };
        var result = BookingService.CreateBooking([], TestTables, TestRestaurant, request);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidPartySize, result.Error);
    }

    [Fact]
    public void CreateBooking_PastDate_ReturnsInvalidDate()
    {
        var request = ValidRequest(date: DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)));
        var result = BookingService.CreateBooking([], TestTables, TestRestaurant, request);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidDate, result.Error);
    }

    [Fact]
    public void CreateBooking_StartAfterEnd_ReturnsInvalidTimeSlot()
    {
        var request = ValidRequest(start: new TimeOnly(14, 0), end: new TimeOnly(13, 0));
        var result = BookingService.CreateBooking([], TestTables, TestRestaurant, request);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidTimeSlot, result.Error);
    }

    [Fact]
    public void CreateBooking_OutsideOpeningHours_ReturnsInvalidTimeSlot()
    {
        var request = ValidRequest(start: new TimeOnly(8, 0), end: new TimeOnly(9, 0));
        var result = BookingService.CreateBooking([], TestTables, TestRestaurant, request);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidTimeSlot, result.Error);
    }

    [Fact]
    public void CreateBooking_OverlappingReservation_ReturnsOverlappingReservation()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var existingBooking = new Booking(
            "b1", "r1", "t1", "John", 2, date,
            new TimeOnly(12, 0), new TimeOnly(13, 0), DateTime.UtcNow);
        var existingBooking2 = new Booking(
            "b2", "r1", "t2", "Bob", 2, date,
            new TimeOnly(12, 0), new TimeOnly(13, 0), DateTime.UtcNow);

        var request = ValidRequest(date: date);
        var result = BookingService.CreateBooking(
            [existingBooking, existingBooking2], TestTables, TestRestaurant, request);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.OverlappingReservation, result.Error);
    }

    [Fact]
    public void CreateBooking_OverlappingDifferentTable_Succeeds()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var existingBooking = new Booking(
            "b1", "r1", "t1", "John", 2, date,
            new TimeOnly(12, 0), new TimeOnly(13, 0), DateTime.UtcNow);

        var request = ValidRequest(date: date);
        var result = BookingService.CreateBooking(
            [existingBooking], TestTables, TestRestaurant, request);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal("t2", result.Value.TableId);
    }

    [Fact]
    public void CreateBooking_NonOverlappingSameTable_Succeeds()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var existingBooking = new Booking(
            "b1", "r1", "t1", "John", 2, date,
            new TimeOnly(12, 0), new TimeOnly(13, 0), DateTime.UtcNow);

        var request = ValidRequest(date: date, start: new TimeOnly(14, 0), end: new TimeOnly(15, 0));
        var result = BookingService.CreateBooking(
            [existingBooking], TestTables, TestRestaurant, request);

        Assert.True(result.IsSuccess);
    }

    [Fact]
    public void CreateBooking_NoTablesLargeParty_ReturnsNoAvailableTable()
    {
        var request = ValidRequest() with { PartySize = 100 };
        var result = BookingService.CreateBooking([], TestTables, TestRestaurant, request);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.NoAvailableTable, result.Error);
    }
}
