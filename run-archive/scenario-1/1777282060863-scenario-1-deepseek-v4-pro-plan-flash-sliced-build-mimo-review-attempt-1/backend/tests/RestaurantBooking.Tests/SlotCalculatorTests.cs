using RestaurantBooking.Domain;

namespace RestaurantBooking.Tests;

public class SlotCalculatorTests
{
    private static readonly Restaurant Restaurant = new(
        Guid.NewGuid(),
        "Test Restaurant",
        TimeSpan.FromHours(11),
        TimeSpan.FromHours(14));

    private static readonly Table Table2Seat = new(Guid.NewGuid(), Restaurant.Id, 2);
    private static readonly Table Table4Seat = new(Guid.NewGuid(), Restaurant.Id, 4);
    private static readonly Table Table6Seat = new(Guid.NewGuid(), Restaurant.Id, 6);
    private static readonly List<Table> Tables = [Table2Seat, Table4Seat, Table6Seat];

    private static Booking MakeBooking(Guid tableId, DateTimeOffset dateTime, TimeSpan duration) =>
        new(Guid.NewGuid(), Restaurant.Id, tableId, dateTime, duration, 2, "Test", "test@test.com");

    #region GenerateTimeSlots

    [Fact]
    public void GenerateTimeSlots_30MinInterval_1800To2200_Returns8Slots()
    {
        var slots = SlotCalculator.GenerateTimeSlots(
            TimeSpan.FromHours(18),
            TimeSpan.FromHours(22),
            TimeSpan.FromMinutes(30));

        Assert.Equal(8, slots.Count);
        Assert.Equal(TimeSpan.FromHours(18), slots[0]);
        Assert.Equal(TimeSpan.FromHours(18).Add(TimeSpan.FromMinutes(30)), slots[1]);
        Assert.Equal(TimeSpan.FromHours(21).Add(TimeSpan.FromMinutes(30)), slots[^1]);
    }

    [Fact]
    public void GenerateTimeSlots_CustomInterval_ReturnsCorrectCount()
    {
        var slots = SlotCalculator.GenerateTimeSlots(
            TimeSpan.FromHours(9),
            TimeSpan.FromHours(17),
            TimeSpan.FromHours(1));

        Assert.Equal(8, slots.Count);
        Assert.Equal(TimeSpan.FromHours(9), slots[0]);
        Assert.Equal(TimeSpan.FromHours(16), slots[^1]);
    }

    [Fact]
    public void GenerateTimeSlots_ExactClosingTime_NotIncluded()
    {
        var slots = SlotCalculator.GenerateTimeSlots(
            TimeSpan.FromHours(10),
            TimeSpan.FromHours(12),
            TimeSpan.FromHours(1));

        Assert.Equal(2, slots.Count);
        Assert.Contains(TimeSpan.FromHours(10), slots);
        Assert.Contains(TimeSpan.FromHours(11), slots);
        Assert.DoesNotContain(TimeSpan.FromHours(12), slots);
    }

    [Fact]
    public void GenerateTimeSlots_OpeningEqualsClosing_ReturnsEmpty()
    {
        var slots = SlotCalculator.GenerateTimeSlots(
            TimeSpan.FromHours(10),
            TimeSpan.FromHours(10),
            TimeSpan.FromMinutes(30));

        Assert.Empty(slots);
    }

    #endregion

    #region HasOverlap

    [Fact]
    public void HasOverlap_SameTableSameDateOverlapping_ReturnsTrue()
    {
        var baseTime = new DateTimeOffset(2026, 4, 27, 18, 0, 0, TimeSpan.Zero);
        var a = MakeBooking(Table4Seat.Id, baseTime, TimeSpan.FromMinutes(30));
        var b = MakeBooking(Table4Seat.Id, baseTime.Add(TimeSpan.FromMinutes(15)), TimeSpan.FromMinutes(30));

        Assert.True(SlotCalculator.HasOverlap(a, b));
    }

    [Fact]
    public void HasOverlap_SameTableSameDateNonOverlapping_ReturnsFalse()
    {
        var baseTime = new DateTimeOffset(2026, 4, 27, 18, 0, 0, TimeSpan.Zero);
        var a = MakeBooking(Table4Seat.Id, baseTime, TimeSpan.FromMinutes(30));
        var b = MakeBooking(Table4Seat.Id, baseTime.Add(TimeSpan.FromMinutes(30)), TimeSpan.FromMinutes(30));

        Assert.False(SlotCalculator.HasOverlap(a, b));
    }

    [Fact]
    public void HasOverlap_DifferentTable_ReturnsFalse()
    {
        var baseTime = new DateTimeOffset(2026, 4, 27, 18, 0, 0, TimeSpan.Zero);
        var a = MakeBooking(Table2Seat.Id, baseTime, TimeSpan.FromMinutes(30));
        var b = MakeBooking(Table4Seat.Id, baseTime, TimeSpan.FromMinutes(30));

        Assert.False(SlotCalculator.HasOverlap(a, b));
    }

    [Fact]
    public void HasOverlap_DifferentDate_ReturnsFalse()
    {
        var a = MakeBooking(Table4Seat.Id, new DateTimeOffset(2026, 4, 27, 18, 0, 0, TimeSpan.Zero), TimeSpan.FromMinutes(30));
        var b = MakeBooking(Table4Seat.Id, new DateTimeOffset(2026, 4, 28, 18, 0, 0, TimeSpan.Zero), TimeSpan.FromMinutes(30));

        Assert.False(SlotCalculator.HasOverlap(a, b));
    }

    [Fact]
    public void HasOverlap_AdjacentBookings_ReturnsFalse()
    {
        var baseTime = new DateTimeOffset(2026, 4, 27, 18, 0, 0, TimeSpan.Zero);
        var a = MakeBooking(Table4Seat.Id, baseTime, TimeSpan.FromMinutes(30));
        var b = MakeBooking(Table4Seat.Id, baseTime.Add(TimeSpan.FromMinutes(30)), TimeSpan.FromMinutes(30));

        Assert.False(SlotCalculator.HasOverlap(a, b));
    }

    #endregion

    #region FindAvailableSlots

    [Fact]
    public void FindAvailableSlots_NoBookings_ReturnsAllSlots()
    {
        var date = new DateOnly(2026, 4, 27);
        var slots = SlotCalculator.FindAvailableSlots(Restaurant, Tables, [], date, 2);

        var expectedCount = (Restaurant.ClosingTime.TotalMinutes - Restaurant.OpeningTime.TotalMinutes) / 30 * Tables.Count(t => t.Capacity >= 2);
        Assert.Equal(expectedCount, slots.Count);
    }

    [Fact]
    public void FindAvailableSlots_TableInsufficientCapacity_NotOffered()
    {
        var date = new DateOnly(2026, 4, 27);
        var slots = SlotCalculator.FindAvailableSlots(Restaurant, Tables, [], date, 5);

        Assert.DoesNotContain(slots, s => s.TableId == Table2Seat.Id);
        Assert.Contains(slots, s => s.TableId == Table6Seat.Id);
    }

    [Fact]
    public void FindAvailableSlots_FullyBookedTable_ExcludesBookedSlots()
    {
        var date = new DateOnly(2026, 4, 27);
        var baseTime = date.ToDateTime(TimeOnly.FromTimeSpan(TimeSpan.FromHours(11)), DateTimeKind.Local);

        var bookings = new List<Booking>
        {
            MakeBooking(Table2Seat.Id, baseTime, TimeSpan.FromMinutes(30))
        };

        var slots = SlotCalculator.FindAvailableSlots(Restaurant, Tables, bookings, date, 2);

        var table2At11 = slots.Any(s => s.TableId == Table2Seat.Id && s.Time == TimeSpan.FromHours(11));
        Assert.False(table2At11);
    }

    [Fact]
    public void FindAvailableSlots_NoSuitableTables_ReturnsEmpty()
    {
        var date = new DateOnly(2026, 4, 27);
        var slots = SlotCalculator.FindAvailableSlots(Restaurant, Tables, [], date, 100);

        Assert.Empty(slots);
    }

    #endregion

    #region ValidateBooking

    [Fact]
    public void ValidateBooking_PartySizeZero_ReturnsInvalidPartySize()
    {
        var request = new CreateBookingRequest(
            Restaurant.Id,
            DateTimeOffset.UtcNow.AddDays(1),
            0,
            "Test",
            "test@test.com");

        var (isSuccess, _, error) = SlotCalculator.ValidateBooking(request, Restaurant, Tables, []);

        Assert.False(isSuccess);
        Assert.Equal(BookingError.InvalidPartySize, error);
    }

    [Fact]
    public void ValidateBooking_PartySizeNegative_ReturnsInvalidPartySize()
    {
        var request = new CreateBookingRequest(
            Restaurant.Id,
            DateTimeOffset.UtcNow.AddDays(1),
            -1,
            "Test",
            "test@test.com");

        var (isSuccess, _, error) = SlotCalculator.ValidateBooking(request, Restaurant, Tables, []);

        Assert.False(isSuccess);
        Assert.Equal(BookingError.InvalidPartySize, error);
    }

    [Fact]
    public void ValidateBooking_PastDate_ReturnsInvalidDateTime()
    {
        var request = new CreateBookingRequest(
            Restaurant.Id,
            DateTimeOffset.UtcNow.AddDays(-1),
            2,
            "Test",
            "test@test.com");

        var (isSuccess, _, error) = SlotCalculator.ValidateBooking(request, Restaurant, Tables, []);

        Assert.False(isSuccess);
        Assert.Equal(BookingError.InvalidDateTime, error);
    }

    [Fact]
    public void ValidateBooking_RestaurantNotFound_ReturnsRestaurantNotFound()
    {
        var request = new CreateBookingRequest(
            Guid.NewGuid(),
            DateTimeOffset.UtcNow.AddDays(1),
            2,
            "Test",
            "test@test.com");

        var (isSuccess, _, error) = SlotCalculator.ValidateBooking(request, null, Tables, []);

        Assert.False(isSuccess);
        Assert.Equal(BookingError.RestaurantNotFound, error);
    }

    [Fact]
    public void ValidateBooking_ValidRequest_ReturnsSuccess()
    {
        var request = new CreateBookingRequest(
            Restaurant.Id,
            DateTimeOffset.UtcNow.AddDays(1),
            2,
            "Test",
            "test@test.com");

        var (isSuccess, value, error) = SlotCalculator.ValidateBooking(request, Restaurant, Tables, []);

        Assert.True(isSuccess);
        Assert.NotNull(value);
        Assert.Equal("Test", value!.CustomerName);
        Assert.Equal(request.PartySize, value.PartySize);
    }

    [Fact]
    public void ValidateBooking_OverlappingBooking_ReturnsOverlapConflict()
    {
        var futureTime = DateTimeOffset.UtcNow.AddDays(1).Date.Add(TimeSpan.FromHours(12));
        var request = new CreateBookingRequest(
            Restaurant.Id,
            futureTime,
            2,
            "Test",
            "test@test.com");

        var existingBooking = MakeBooking(Table2Seat.Id, futureTime, TimeSpan.FromMinutes(30));
        var bookings = new List<Booking> { existingBooking };

        var (isSuccess, _, error) = SlotCalculator.ValidateBooking(request, Restaurant, [Table2Seat], bookings);

        Assert.False(isSuccess);
        Assert.Equal(BookingError.OverlapConflict, error);
    }

    #endregion
}
