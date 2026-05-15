using RestaurantBooking.Api.Data;
using RestaurantBooking.Api.Domain;
using RestaurantBooking.Api.Dtos;

namespace RestaurantBooking.Tests.Domain;

public class BookingServiceTests
{
    private readonly InMemoryStore _store = new();
    private readonly BookingService _sut;

    public BookingServiceTests()
    {
        SeedData.Initialize(_store);
        _sut = new BookingService(_store);
    }

    [Fact]
    public void CreateBooking_WithValidRequest_ReturnsBooking()
    {
        var request = ValidRequest();
        var (booking, error) = _sut.CreateBooking(request);

        Assert.Null(error);
        Assert.NotNull(booking);
        Assert.Equal(request.RestaurantId, booking.RestaurantId);
        Assert.Equal(request.CustomerEmail, booking.CustomerEmail);
    }

    [Fact]
    public void CreateBooking_WithUnknownRestaurant_ReturnsNotFound()
    {
        var request = ValidRequest() with { RestaurantId = Guid.NewGuid() };
        var (_, error) = _sut.CreateBooking(request);

        Assert.IsType<BookingError.RestaurantNotFound>(error);
    }

    [Fact]
    public void CreateBooking_WithPartySizeZero_ReturnsInvalidPartySize()
    {
        var request = ValidRequest() with { PartySize = 0 };
        var (_, error) = _sut.CreateBooking(request);

        Assert.IsType<BookingError.InvalidPartySize>(error);
    }

    [Fact]
    public void CreateBooking_WithPartySizeExceedingMax_ReturnsInvalidPartySize()
    {
        var request = ValidRequest() with { PartySize = 99 };
        var (_, error) = _sut.CreateBooking(request);

        Assert.IsType<BookingError.InvalidPartySize>(error);
    }

    [Fact]
    public void CreateBooking_WithPastDate_ReturnsInvalidDate()
    {
        var request = ValidRequest() with { Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)) };
        var (_, error) = _sut.CreateBooking(request);

        Assert.IsType<BookingError.InvalidDate>(error);
    }

    [Fact]
    public void CreateBooking_WithDateTooFarInFuture_ReturnsInvalidDate()
    {
        var request = ValidRequest() with { Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(61)) };
        var (_, error) = _sut.CreateBooking(request);

        Assert.IsType<BookingError.InvalidDate>(error);
    }

    [Fact]
    public void CreateBooking_WithEarlyMorningTime_ReturnsInvalidTime()
    {
        var request = ValidRequest() with { StartTime = new TimeOnly(8, 0) };
        var (_, error) = _sut.CreateBooking(request);

        Assert.IsType<BookingError.InvalidTime>(error);
    }

    [Fact]
    public void CreateBooking_ReservingSameSlot_ReturnsOverlapping()
    {
        var request = ValidRequest();
        var (first, firstError) = _sut.CreateBooking(request);
        Assert.Null(firstError);
        Assert.NotNull(first);

        // Same restaurant, date, time slot with same party size
        // Use party size 6 to only target the unique 6-person table at La Trattoria
        var second = ValidRequest() with { PartySize = 6, CustomerEmail = "other@test.com" };
        var (secondBooking, secondError) = _sut.CreateBooking(second);
        Assert.Null(secondError);
        Assert.NotNull(secondBooking);

        // Now try overlapping - another 6-person booking at same time should fail
        var (third, thirdError) = _sut.CreateBooking(second);
        Assert.Null(third);
        Assert.NotNull(thirdError);
    }

    [Fact]
    public void GetAvailableSlots_WithValidRequest_ReturnsSlots()
    {
        var slots = _sut.GetAvailableSlots(
            Guid.Parse("11111111-1111-1111-1111-111111111111"),
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            2);

        Assert.NotEmpty(slots);
    }

    [Fact]
    public void GetAvailableSlots_WithLargeParty_ReturnsSuitableSlots()
    {
        var slots = _sut.GetAvailableSlots(
            Guid.Parse("11111111-1111-1111-1111-111111111111"),
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            6);

        Assert.NotEmpty(slots);
    }

    [Fact]
    public void GetBookingsByEmail_ReturnsMatchingBookings()
    {
        var email = "test@example.com";
        _sut.CreateBooking(ValidRequest() with { CustomerEmail = email });
        _sut.CreateBooking(ValidRequest() with { CustomerEmail = email });
        _sut.CreateBooking(ValidRequest() with { CustomerEmail = "other@example.com" });

        var bookings = _sut.GetBookingsByEmail(email);
        Assert.Equal(2, bookings.Count);
    }

    private static CreateBookingRequest ValidRequest() => new(
        RestaurantId: Guid.Parse("11111111-1111-1111-1111-111111111111"),
        Date: DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
        StartTime: new TimeOnly(12, 0),
        PartySize: 2,
        CustomerName: "John Doe",
        CustomerEmail: "john@example.com",
        Notes: null);
}
