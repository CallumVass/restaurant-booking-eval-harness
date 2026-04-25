using Api.Infrastructure;
using Domain.Errors;
using Domain.Models;
using Domain.Services;
using Domain.Store;

namespace BookingTests;

public class BookingServiceTests
{
    private InMemoryBookingStore _store = null!;
    private const string RestaurantId = "resto-1";
    private const string SingleTableRestaurantId = "resto-single";

    public BookingServiceTests()
    {
        _store = new InMemoryBookingStore();
        _store.Seed(new[]
        {
            new Restaurant(
                RestaurantId,
                "Test Restaurant",
                "Test",
                "Test",
                new[]
                {
                    new Table("t1", 2),
                    new Table("t2", 4),
                    new Table("t3", 6),
                }),
            new Restaurant(
                SingleTableRestaurantId,
                "Single Table Restaurant",
                "Test",
                "Test",
                new[]
                {
                    new Table("st1", 4),
                }),
        });
    }

    [Fact]
    public void BookRestaurant_ValidBooking_ReturnsSuccess()
    {
        var future = DateTime.UtcNow.AddHours(2);
        var result = BookingService.BookRestaurant(
            _store, RestaurantId, "John", "john@test.com", 2, future);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal(RestaurantId, result.Value.RestaurantId);
        Assert.Equal(2, result.Value.PartySize);
    }

    [Fact]
    public void BookRestaurant_ZeroPartySize_ReturnsInvalidPartySize()
    {
        var future = DateTime.UtcNow.AddHours(2);
        var result = BookingService.BookRestaurant(
            _store, RestaurantId, "John", "john@test.com", 0, future);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidPartySize>(result.Error);
    }

    [Fact]
    public void BookRestaurant_NegativePartySize_ReturnsInvalidPartySize()
    {
        var future = DateTime.UtcNow.AddHours(2);
        var result = BookingService.BookRestaurant(
            _store, RestaurantId, "John", "john@test.com", -1, future);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidPartySize>(result.Error);
    }

    [Fact]
    public void BookRestaurant_PastDateTime_ReturnsInvalidDateTime()
    {
        var past = DateTime.UtcNow.AddHours(-2);
        var result = BookingService.BookRestaurant(
            _store, RestaurantId, "John", "john@test.com", 2, past);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidDateTime>(result.Error);
    }

    [Fact]
    public void BookRestaurant_CurrentTime_ReturnsInvalidDateTime()
    {
        var result = BookingService.BookRestaurant(
            _store, RestaurantId, "John", "john@test.com", 2, DateTime.UtcNow);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidDateTime>(result.Error);
    }

    [Fact]
    public void BookRestaurant_BeforeOpeningHours_ReturnsInvalidDateTime()
    {
        var early = DateTime.UtcNow.Date.AddHours(9);
        if (early <= DateTime.UtcNow)
            early = early.AddDays(1);

        var result = BookingService.BookRestaurant(
            _store, RestaurantId, "John", "john@test.com", 2, early);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidDateTime>(result.Error);
    }

    [Fact]
    public void BookRestaurant_AfterClosingHours_ReturnsInvalidDateTime()
    {
        var late = DateTime.UtcNow.Date.AddHours(22);
        if (late <= DateTime.UtcNow)
            late = late.AddDays(1);

        var result = BookingService.BookRestaurant(
            _store, RestaurantId, "John", "john@test.com", 2, late);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.InvalidDateTime>(result.Error);
    }

    [Fact]
    public void BookRestaurant_UnknownRestaurant_ReturnsRestaurantNotFound()
    {
        var future = DateTime.UtcNow.AddHours(2);
        var result = BookingService.BookRestaurant(
            _store, "unknown", "John", "john@test.com", 2, future);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.RestaurantNotFound>(result.Error);
    }

    [Fact]
    public void BookRestaurant_PartyTooLarge_ReturnsNoTableAvailable()
    {
        var future = DateTime.UtcNow.AddHours(2);
        var result = BookingService.BookRestaurant(
            _store, RestaurantId, "John", "john@test.com", 100, future);

        Assert.False(result.IsSuccess);
        Assert.IsType<BookingError.NoTableAvailable>(result.Error);
    }

    [Fact]
    public void BookRestaurant_OverlappingBookingOnSingleTable_ReturnsBookingConflict()
    {
        var future = DateTime.UtcNow.AddHours(2);

        var first = BookingService.BookRestaurant(
            _store, SingleTableRestaurantId, "John", "john@test.com", 2, future);
        Assert.True(first.IsSuccess);
        _store.AddBooking(first.Value!);

        var second = BookingService.BookRestaurant(
            _store, SingleTableRestaurantId, "Jane", "jane@test.com", 2, future);

        Assert.False(second.IsSuccess);
        Assert.IsType<BookingError.BookingConflict>(second.Error);
    }

    [Fact]
    public void BookRestaurant_NonOverlappingSameTable_Succeeds()
    {
        var tomorrow = DateTime.UtcNow.Date.AddDays(1);
        var time1 = tomorrow.AddHours(12);
        var time2 = tomorrow.AddHours(14);

        var first = BookingService.BookRestaurant(
            _store, SingleTableRestaurantId, "John", "john@test.com", 2, time1);
        Assert.True(first.IsSuccess);
        _store.AddBooking(first.Value!);

        var second = BookingService.BookRestaurant(
            _store, SingleTableRestaurantId, "Jane", "jane@test.com", 2, time2);

        Assert.True(second.IsSuccess);
    }

    [Fact]
    public void BookRestaurant_ExactBoundaryOverlap_ReturnsConflict()
    {
        var time1 = DateTime.UtcNow.AddHours(2);
        var time2 = time1.AddMinutes(30);

        var first = BookingService.BookRestaurant(
            _store, SingleTableRestaurantId, "John", "john@test.com", 2, time1);
        Assert.True(first.IsSuccess);
        _store.AddBooking(first.Value!);

        var second = BookingService.BookRestaurant(
            _store, SingleTableRestaurantId, "Jane", "jane@test.com", 2, time2);

        Assert.False(second.IsSuccess);
        Assert.IsType<BookingError.BookingConflict>(second.Error);
    }

    [Fact]
    public void IsOverlapping_PartialOverlap_ReturnsTrue()
    {
        var start1 = new DateTime(2025, 1, 1, 12, 0, 0, DateTimeKind.Utc);
        var start2 = new DateTime(2025, 1, 1, 12, 30, 0, DateTimeKind.Utc);

        Assert.True(BookingService.IsOverlapping(start1, 60, start2, 60));
    }

    [Fact]
    public void IsOverlapping_NoOverlap_ReturnsFalse()
    {
        var start1 = new DateTime(2025, 1, 1, 12, 0, 0, DateTimeKind.Utc);
        var start2 = new DateTime(2025, 1, 1, 13, 30, 0, DateTimeKind.Utc);

        Assert.False(BookingService.IsOverlapping(start1, 60, start2, 60));
    }

    [Fact]
    public void IsOverlapping_ExactTouch_ReturnsFalse()
    {
        var start1 = new DateTime(2025, 1, 1, 12, 0, 0, DateTimeKind.Utc);
        var start2 = new DateTime(2025, 1, 1, 13, 0, 0, DateTimeKind.Utc);

        Assert.False(BookingService.IsOverlapping(start1, 60, start2, 60));
    }

    [Fact]
    public void GetAvailableSlots_ReturnsSlotsForValidRestaurant()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var slots = BookingService.GetAvailableSlots(_store, RestaurantId, tomorrow, 2);

        Assert.NotEmpty(slots);
        Assert.All(slots, s => Assert.True(s.IsAvailable));
    }

    [Fact]
    public void GetAvailableSlots_EmptyForUnknownRestaurant()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var slots = BookingService.GetAvailableSlots(_store, "unknown", tomorrow, 2);

        Assert.Empty(slots);
    }

    [Fact]
    public void GetAvailableSlots_FilledAfterBooking()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var firstSlot = BookingService.GetAvailableSlots(_store, SingleTableRestaurantId, tomorrow, 2).First();

        var booking = BookingService.BookRestaurant(
            _store, SingleTableRestaurantId, "John", "john@test.com", 2, firstSlot.Time);
        Assert.True(booking.IsSuccess);
        _store.AddBooking(booking.Value!);

        var slots = BookingService.GetAvailableSlots(_store, SingleTableRestaurantId, tomorrow, 2);
        var bookedSlot = slots.FirstOrDefault(s => s.Time == firstSlot.Time);

        Assert.True(bookedSlot == null || !bookedSlot.IsAvailable);
    }

    [Fact]
    public void GetAvailableSlots_FiltersByPartySize()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var slotsFor2 = BookingService.GetAvailableSlots(_store, RestaurantId, tomorrow, 2);
        var slotsFor6 = BookingService.GetAvailableSlots(_store, RestaurantId, tomorrow, 6);

        Assert.NotEmpty(slotsFor2);
        Assert.NotEmpty(slotsFor6);
        Assert.True(slotsFor2.Count >= slotsFor6.Count);
    }

    [Fact]
    public void BookRestaurant_AllTablesBooked_ReturnsBookingConflict()
    {
        var future = DateTime.UtcNow.AddHours(2);

        var b1 = BookingService.BookRestaurant(_store, RestaurantId, "A", "a@test.com", 2, future);
        Assert.True(b1.IsSuccess);
        _store.AddBooking(b1.Value!);

        var b2 = BookingService.BookRestaurant(_store, RestaurantId, "B", "b@test.com", 4, future);
        Assert.True(b2.IsSuccess);
        _store.AddBooking(b2.Value!);

        var b3 = BookingService.BookRestaurant(_store, RestaurantId, "C", "c@test.com", 6, future);
        Assert.True(b3.IsSuccess);
        _store.AddBooking(b3.Value!);

        var b4 = BookingService.BookRestaurant(_store, RestaurantId, "D", "d@test.com", 2, future);
        Assert.False(b4.IsSuccess);
        Assert.IsType<BookingError.BookingConflict>(b4.Error);
    }
}
