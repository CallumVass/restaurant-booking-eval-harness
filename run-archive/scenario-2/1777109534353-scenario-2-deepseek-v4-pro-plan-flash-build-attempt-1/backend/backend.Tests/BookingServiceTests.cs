using Backend.Data;
using Backend.Domain;

namespace Backend.Tests;

public class BookingServiceTests
{
    private static readonly Guid RestaurantId = Guid.NewGuid();
    private static readonly Guid Table2Seat = Guid.NewGuid();
    private static readonly Guid Table4Seat = Guid.NewGuid();
    private static readonly Guid Table6Seat = Guid.NewGuid();

    private static readonly List<Table> Tables =
    [
        new(Table2Seat, RestaurantId, 2),
        new(Table4Seat, RestaurantId, 4),
        new(Table6Seat, RestaurantId, 6),
    ];

    private static DateOnly FutureDate => DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
    private static DateOnly PastDate => DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1));

    [Fact]
    public void TryBook_InvalidPartySize_Zero_ReturnsError()
    {
        var result = BookingService.TryBook(Tables, [], RestaurantId, Table4Seat, FutureDate,
            new TimeOnly(12, 0), 0, "Test");

        Assert.False(result.IsSuccess);
        Assert.Equal("INVALID_PARTY_SIZE", result.Error!.Code);
    }

    [Fact]
    public void TryBook_InvalidPartySize_Negative_ReturnsError()
    {
        var result = BookingService.TryBook(Tables, [], RestaurantId, Table4Seat, FutureDate,
            new TimeOnly(12, 0), -1, "Test");

        Assert.False(result.IsSuccess);
        Assert.Equal("INVALID_PARTY_SIZE", result.Error!.Code);
    }

    [Fact]
    public void TryBook_InvalidPartySize_OverMax_ReturnsError()
    {
        var result = BookingService.TryBook(Tables, [], RestaurantId, Table4Seat, FutureDate,
            new TimeOnly(12, 0), 21, "Test");

        Assert.False(result.IsSuccess);
        Assert.Equal("INVALID_PARTY_SIZE", result.Error!.Code);
    }

    [Fact]
    public void TryBook_InvalidDate_PastDate_ReturnsError()
    {
        var result = BookingService.TryBook(Tables, [], RestaurantId, Table4Seat, PastDate,
            new TimeOnly(12, 0), 2, "Test");

        Assert.False(result.IsSuccess);
        Assert.Equal("INVALID_DATE", result.Error!.Code);
    }

    [Fact]
    public void TryBook_InvalidTime_BeforeOpen_ReturnsError()
    {
        var result = BookingService.TryBook(Tables, [], RestaurantId, Table4Seat, FutureDate,
            new TimeOnly(8, 0), 2, "Test");

        Assert.False(result.IsSuccess);
        Assert.Equal("INVALID_TIME", result.Error!.Code);
    }

    [Fact]
    public void TryBook_InvalidTime_AfterClose_ReturnsError()
    {
        var result = BookingService.TryBook(Tables, [], RestaurantId, Table4Seat, FutureDate,
            new TimeOnly(22, 0), 2, "Test");

        Assert.False(result.IsSuccess);
        Assert.Equal("INVALID_TIME", result.Error!.Code);
    }

    [Fact]
    public void TryBook_TableNotFound_ReturnsError()
    {
        var result = BookingService.TryBook(Tables, [], RestaurantId, Guid.NewGuid(), FutureDate,
            new TimeOnly(12, 0), 2, "Test");

        Assert.False(result.IsSuccess);
        Assert.Equal("TABLE_NOT_FOUND", result.Error!.Code);
    }

    [Fact]
    public void TryBook_TableTooSmall_ReturnsError()
    {
        var result = BookingService.TryBook(Tables, [], RestaurantId, Table2Seat, FutureDate,
            new TimeOnly(12, 0), 4, "Test");

        Assert.False(result.IsSuccess);
        Assert.Equal("TABLE_TOO_SMALL", result.Error!.Code);
    }

    [Fact]
    public void TryBook_OverlappingBooking_ReturnsError()
    {
        var existing = new List<Booking>
        {
            new(Guid.NewGuid(), RestaurantId, Table4Seat, FutureDate, new TimeOnly(12, 0),
                2, "Existing", DateTime.UtcNow),
        };

        var result = BookingService.TryBook(Tables, existing, RestaurantId, Table4Seat, FutureDate,
            new TimeOnly(12, 30), 2, "Test");

        Assert.False(result.IsSuccess);
        Assert.Equal("OVERLAPPING_BOOKING", result.Error!.Code);
    }

    [Fact]
    public void TryBook_NonOverlapping_AdjacentSlots_ReturnsSuccess()
    {
        var existing = new List<Booking>
        {
            new(Guid.NewGuid(), RestaurantId, Table4Seat, FutureDate, new TimeOnly(12, 0),
                2, "Existing", DateTime.UtcNow),
        };

        var result = BookingService.TryBook(Tables, existing, RestaurantId, Table4Seat, FutureDate,
            new TimeOnly(13, 30), 2, "Test");

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
    }

    [Fact]
    public void TryBook_DifferentTable_SameTime_ReturnsSuccess()
    {
        var existing = new List<Booking>
        {
            new(Guid.NewGuid(), RestaurantId, Table4Seat, FutureDate, new TimeOnly(12, 0),
                2, "Existing", DateTime.UtcNow),
        };

        var result = BookingService.TryBook(Tables, existing, RestaurantId, Table6Seat, FutureDate,
            new TimeOnly(12, 0), 2, "Test");

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
    }

    [Fact]
    public void TryBook_ValidRequest_ReturnsSuccess()
    {
        var result = BookingService.TryBook(Tables, [], RestaurantId, Table4Seat, FutureDate,
            new TimeOnly(12, 0), 2, "Alice");

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal(RestaurantId, result.Value.RestaurantId);
        Assert.Equal(Table4Seat, result.Value.TableId);
        Assert.Equal(FutureDate, result.Value.Date);
        Assert.Equal(new TimeOnly(12, 0), result.Value.StartTime);
        Assert.Equal(2, result.Value.PartySize);
        Assert.Equal("Alice", result.Value.GuestName);
    }

    [Fact]
    public void FindAvailableSlots_InvalidPartySize_ReturnsError()
    {
        var result = BookingService.FindAvailableSlots(Tables, [], FutureDate, 0);

        Assert.False(result.IsSuccess);
        Assert.Equal("INVALID_PARTY_SIZE", result.Error!.Code);
    }

    [Fact]
    public void FindAvailableSlots_PastDate_ReturnsError()
    {
        var result = BookingService.FindAvailableSlots(Tables, [], PastDate, 2);

        Assert.False(result.IsSuccess);
        Assert.Equal("INVALID_DATE", result.Error!.Code);
    }

    [Fact]
    public void FindAvailableSlots_PartyTooLarge_ReturnsError()
    {
        var result = BookingService.FindAvailableSlots(Tables, [], FutureDate, 10);

        Assert.False(result.IsSuccess);
        Assert.Equal("NO_TABLES_AVAILABLE", result.Error!.Code);
    }

    [Fact]
    public void FindAvailableSlots_ReturnsCorrectSlotCount()
    {
        var result = BookingService.FindAvailableSlots(Tables, [], FutureDate, 2);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);

        var expectedLastStart = BookingService.CloseTime.AddMinutes(-BookingService.BookingDurationMinutes);
        var totalMinutes = (expectedLastStart.Hour - BookingService.OpenTime.Hour) * 60
            + expectedLastStart.Minute - BookingService.OpenTime.Minute;
        var slotCount = totalMinutes / BookingService.SlotIntervalMinutes + 1;
        var expectedCount = slotCount * Tables.Count(t => t.Capacity >= 2);

        Assert.Equal(expectedCount, result.Value.Slots.Count);
    }

    [Fact]
    public void FindAvailableSlots_SomeBookedSlots_MarkedUnavailable()
    {
        var existing = new List<Booking>
        {
            new(Guid.NewGuid(), RestaurantId, Table4Seat, FutureDate, new TimeOnly(12, 0),
                2, "Existing", DateTime.UtcNow),
        };

        var result = BookingService.FindAvailableSlots(Tables, existing, FutureDate, 2);

        Assert.True(result.IsSuccess);

        var table4SlotsAtNoon = result.Value!.Slots
            .Where(s => s.TableId == Table4Seat && s.StartTime == new TimeOnly(12, 0))
            .ToList();

        Assert.All(table4SlotsAtNoon, s => Assert.False(s.IsAvailable));
    }

    [Fact]
    public void FindAvailableSlots_FullyBooked_NoAvailableSlots()
    {
        var existing = new List<Booking>();
        var current = BookingService.OpenTime;

        while (current.AddMinutes(BookingService.BookingDurationMinutes) <= BookingService.CloseTime)
        {
            existing.Add(new Booking(Guid.NewGuid(), RestaurantId, Table4Seat, FutureDate, current,
                2, "Occupied", DateTime.UtcNow));
            existing.Add(new Booking(Guid.NewGuid(), RestaurantId, Table6Seat, FutureDate, current,
                2, "Occupied", DateTime.UtcNow));
            existing.Add(new Booking(Guid.NewGuid(), RestaurantId, Table2Seat, FutureDate, current,
                2, "Occupied", DateTime.UtcNow));
            current = current.AddMinutes(BookingService.SlotIntervalMinutes);
        }

        var result = BookingService.FindAvailableSlots(Tables, existing, FutureDate, 2);

        Assert.True(result.IsSuccess);
        Assert.False(result.Value!.HasAvailableSlots);
    }

    [Fact]
    public void GenerateTimeSlots_ReturnsCorrectRange()
    {
        var slots = BookingService.GenerateTimeSlots();

        Assert.NotEmpty(slots);
        Assert.Equal(BookingService.OpenTime, slots[0]);
        Assert.Equal(new TimeOnly(10, 0), slots[0]);
    }
}
