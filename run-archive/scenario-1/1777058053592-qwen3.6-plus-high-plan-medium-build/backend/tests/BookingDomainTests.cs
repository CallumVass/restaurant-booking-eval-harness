using RestaurantBooking.Domain;
using Xunit;

namespace RestaurantBooking.Tests;

public class BookingDomainTests
{
    private static readonly Guid RestaurantId = Guid.NewGuid();
    private static readonly Guid Table2Id = Guid.NewGuid();
    private static readonly Guid Table4Id = Guid.NewGuid();
    private static readonly Guid Table6Id = Guid.NewGuid();

    private static readonly Restaurant TestRestaurant = new(
        RestaurantId,
        "Test Restaurant",
        "123 Test St",
        new List<Table>
        {
            new(Table2Id, RestaurantId, 2),
            new(Table4Id, RestaurantId, 4),
            new(Table6Id, RestaurantId, 6),
        });

    private static readonly DateTime Now = DateTime.UtcNow;
    private static readonly DateTime Tomorrow = DateTime.UtcNow.Date.AddDays(1);

    [Fact]
    public void CreateBooking_ValidRequest_ReturnsBooking()
    {
        var request = new BookingRequest(RestaurantId, "John", "john@test.com", 3, Tomorrow.AddHours(12));
        var existing = Array.Empty<Booking>();

        var result = BookingDomain.CreateBooking(TestRestaurant, existing, request, Now);

        Assert.True(result.IsSuccess);
        Assert.Equal(RestaurantId, result.Value!.RestaurantId);
        Assert.Equal(3, result.Value.PartySize);
        Assert.Equal(request.StartTime.AddMinutes(30), result.Value.EndTime);
    }

    [Fact]
    public void CreateBooking_PartySizeZero_ReturnsError()
    {
        var request = new BookingRequest(RestaurantId, "John", "john@test.com", 0, Tomorrow.AddHours(12));
        var existing = Array.Empty<Booking>();

        var result = BookingDomain.CreateBooking(TestRestaurant, existing, request, Now);

        Assert.False(result.IsSuccess);
        Assert.Contains("at least 1", result.Error!.Message);
    }

    [Fact]
    public void CreateBooking_PartySizeTooLarge_ReturnsError()
    {
        var request = new BookingRequest(RestaurantId, "John", "john@test.com", 10, Tomorrow.AddHours(12));
        var existing = Array.Empty<Booking>();

        var result = BookingDomain.CreateBooking(TestRestaurant, existing, request, Now);

        Assert.False(result.IsSuccess);
        Assert.Contains("exceeds maximum capacity", result.Error!.Message);
    }

    [Fact]
    public void CreateBooking_PastDate_ReturnsError()
    {
        var request = new BookingRequest(RestaurantId, "John", "john@test.com", 2, Now.AddHours(-5));
        var existing = Array.Empty<Booking>();

        var result = BookingDomain.CreateBooking(TestRestaurant, existing, request, Now);

        Assert.False(result.IsSuccess);
        Assert.Contains("past", result.Error!.Message);
    }

    [Fact]
    public void CreateBooking_OutsideOperatingHours_ReturnsError()
    {
        var earlyMorning = Tomorrow.AddHours(8);
        var request = new BookingRequest(RestaurantId, "John", "john@test.com", 2, earlyMorning);
        var existing = Array.Empty<Booking>();

        var result = BookingDomain.CreateBooking(TestRestaurant, existing, request, Now);

        Assert.False(result.IsSuccess);
        Assert.Contains("operating hours", result.Error!.Message);
    }

    [Fact]
    public void CreateBooking_NotOn30MinBoundary_ReturnsError()
    {
        var notOnBoundary = Tomorrow.AddHours(12).AddMinutes(15);
        var request = new BookingRequest(RestaurantId, "John", "john@test.com", 2, notOnBoundary);
        var existing = Array.Empty<Booking>();

        var result = BookingDomain.CreateBooking(TestRestaurant, existing, request, Now);

        Assert.False(result.IsSuccess);
        Assert.Contains("30-minute boundary", result.Error!.Message);
    }

    [Fact]
    public void CreateBooking_OverlappingSameTable_ReturnsConflict()
    {
        var slotTime = Tomorrow.AddHours(12);
        var existingBooking = new Booking(
            Guid.NewGuid(), RestaurantId, Table4Id, "Jane", "jane@test.com", 2,
            slotTime, slotTime.AddMinutes(30));

        var request = new BookingRequest(RestaurantId, "John", "john@test.com", 3, slotTime);

        var result = BookingDomain.CreateBooking(TestRestaurant, new[] { existingBooking }, request, Now);

        Assert.False(result.IsSuccess);
        Assert.Contains("conflicts", result.Error!.Message);
    }

    [Fact]
    public void CreateBooking_DifferentTableNoConflict_ReturnsBooking()
    {
        var slotTime = Tomorrow.AddHours(12);
        var existingBooking = new Booking(
            Guid.NewGuid(), RestaurantId, Table2Id, "Jane", "jane@test.com", 2,
            slotTime, slotTime.AddMinutes(30));

        var request = new BookingRequest(RestaurantId, "John", "john@test.com", 5, slotTime);

        var result = BookingDomain.CreateBooking(TestRestaurant, new[] { existingBooking }, request, Now);

        Assert.True(result.IsSuccess);
        Assert.Equal(Table6Id, result.Value!.TableId);
    }

    [Fact]
    public void CreateBooking_AdjacentSlotsNoOverlap_ReturnsBooking()
    {
        var slotTime = Tomorrow.AddHours(12);
        var existingBooking = new Booking(
            Guid.NewGuid(), RestaurantId, Table4Id, "Jane", "jane@test.com", 2,
            slotTime, slotTime.AddMinutes(30));

        var request = new BookingRequest(RestaurantId, "John", "john@test.com", 3, slotTime.AddMinutes(30));

        var result = BookingDomain.CreateBooking(TestRestaurant, new[] { existingBooking }, request, Now);

        Assert.True(result.IsSuccess);
    }

    [Fact]
    public void CreateBooking_PartialOverlap_ReturnsConflict()
    {
        var slotTime = Tomorrow.AddHours(12);
        var existingBooking = new Booking(
            Guid.NewGuid(), RestaurantId, Table4Id, "Jane", "jane@test.com", 2,
            slotTime, slotTime.AddMinutes(60));

        var request = new BookingRequest(RestaurantId, "John", "john@test.com", 3, slotTime.AddMinutes(30));

        var result = BookingDomain.CreateBooking(TestRestaurant, new[] { existingBooking }, request, Now);

        Assert.False(result.IsSuccess);
        Assert.Contains("conflicts", result.Error!.Message);
    }

    [Fact]
    public void ValidatePartySize_Zero_ReturnsError()
    {
        var error = BookingDomain.ValidatePartySize(0, TestRestaurant.Tables);
        Assert.NotNull(error);
        Assert.Contains("at least 1", error.Message);
    }

    [Fact]
    public void ValidatePartySize_Negative_ReturnsError()
    {
        var error = BookingDomain.ValidatePartySize(-5, TestRestaurant.Tables);
        Assert.NotNull(error);
    }

    [Fact]
    public void ValidatePartySize_ExceedsMax_ReturnsError()
    {
        var error = BookingDomain.ValidatePartySize(7, TestRestaurant.Tables);
        Assert.NotNull(error);
        Assert.Contains("exceeds maximum capacity", error.Message);
    }

    [Fact]
    public void ValidatePartySize_Valid_ReturnsNull()
    {
        var error = BookingDomain.ValidatePartySize(4, TestRestaurant.Tables);
        Assert.Null(error);
    }

    [Fact]
    public void ValidateDateTime_Past_ReturnsError()
    {
        var error = BookingDomain.ValidateDateTime(Now.AddHours(-2), Now);
        Assert.NotNull(error);
        Assert.Contains("past", error.Message);
    }

    [Fact]
    public void ValidateDateTime_EarlyMorning_ReturnsError()
    {
        var early = Tomorrow.AddHours(8);
        var error = BookingDomain.ValidateDateTime(early, Now);
        Assert.NotNull(error);
        Assert.Contains("operating hours", error.Message);
    }

    [Fact]
    public void ValidateDateTime_LateNight_ReturnsError()
    {
        var late = Tomorrow.AddHours(22);
        var error = BookingDomain.ValidateDateTime(late, Now);
        Assert.NotNull(error);
        Assert.Contains("operating hours", error.Message);
    }

    [Fact]
    public void ValidateDateTime_NotOnBoundary_ReturnsError()
    {
        var notOnBoundary = Tomorrow.AddHours(12).AddMinutes(15);
        var error = BookingDomain.ValidateDateTime(notOnBoundary, Now);
        Assert.NotNull(error);
        Assert.Contains("30-minute boundary", error.Message);
    }

    [Fact]
    public void ValidateDateTime_Valid_ReturnsNull()
    {
        var valid = Tomorrow.AddHours(12);
        var error = BookingDomain.ValidateDateTime(valid, Now);
        Assert.Null(error);
    }

    [Fact]
    public void DetectConflict_SameTableOverlapping_ReturnsError()
    {
        var existing = new Booking(
            Guid.NewGuid(), RestaurantId, Table4Id, "Jane", "jane@test.com", 2,
            Now.AddHours(2), Now.AddHours(2).AddMinutes(30));

        var error = BookingDomain.DetectConflict(Table4Id, Now.AddHours(2).AddMinutes(15), Now.AddHours(3), new[] { existing });

        Assert.NotNull(error);
    }

    [Fact]
    public void DetectConflict_DifferentTable_ReturnsNull()
    {
        var existing = new Booking(
            Guid.NewGuid(), RestaurantId, Table4Id, "Jane", "jane@test.com", 2,
            Now.AddHours(2), Now.AddHours(2).AddMinutes(30));

        var error = BookingDomain.DetectConflict(Table6Id, Now.AddHours(2), Now.AddHours(2).AddMinutes(30), new[] { existing });

        Assert.Null(error);
    }

    [Fact]
    public void DetectConflict_AdjacentSlots_ReturnsNull()
    {
        var existing = new Booking(
            Guid.NewGuid(), RestaurantId, Table4Id, "Jane", "jane@test.com", 2,
            Now.AddHours(2), Now.AddHours(2).AddMinutes(30));

        var error = BookingDomain.DetectConflict(Table4Id, Now.AddHours(2).AddMinutes(30), Now.AddHours(3), new[] { existing });

        Assert.Null(error);
    }

    [Fact]
    public void FindSmallestFitTable_ExactFit_ReturnsCorrectTable()
    {
        var table = BookingDomain.FindSmallestFitTable(TestRestaurant.Tables, 4);
        Assert.NotNull(table);
        Assert.Equal(4, table!.Capacity);
    }

    [Fact]
    public void FindSmallestFitTable_NoFit_ReturnsNull()
    {
        var table = BookingDomain.FindSmallestFitTable(TestRestaurant.Tables, 10);
        Assert.Null(table);
    }

    [Fact]
    public void FindSmallestFitTable_SmallestAvailable_ReturnsCorrectTable()
    {
        var table = BookingDomain.FindSmallestFitTable(TestRestaurant.Tables, 3);
        Assert.NotNull(table);
        Assert.Equal(4, table!.Capacity);
    }

    [Fact]
    public void GetAvailableSlots_ValidDate_ReturnsSlots()
    {
        var date = Tomorrow.AddHours(10);
        var existing = Array.Empty<Booking>();

        var result = BookingDomain.GetAvailableSlots(TestRestaurant, existing, date, 2);

        Assert.True(result.IsSuccess);
        var slots = result.Value!;
        Assert.NotEmpty(slots);
        Assert.All(slots, s => Assert.Equal(TimeSpan.FromMinutes(30), s.End - s.Start));
    }

    [Fact]
    public void GetAvailableSlots_WithExistingBooking_MarksSlotUnavailable()
    {
        var slotStart = Tomorrow.AddHours(12);
        var existing = new[]
        {
            new Booking(Guid.NewGuid(), RestaurantId, Table2Id, "Jane", "jane@test.com", 2, slotStart, slotStart.AddMinutes(30)),
        };

        var result = BookingDomain.GetAvailableSlots(TestRestaurant, existing, Tomorrow.AddHours(10), 2);

        Assert.True(result.IsSuccess);
        var slots = result.Value!;
        var bookedSlot = slots.First(s => s.Start == slotStart);
        Assert.False(bookedSlot.IsAvailable);
    }

    [Fact]
    public void GetAvailableSlots_InvalidPartySize_ReturnsError()
    {
        var date = Tomorrow.AddHours(10);
        var existing = Array.Empty<Booking>();

        var result = BookingDomain.GetAvailableSlots(TestRestaurant, existing, date, 0);

        Assert.False(result.IsSuccess);
    }
}
