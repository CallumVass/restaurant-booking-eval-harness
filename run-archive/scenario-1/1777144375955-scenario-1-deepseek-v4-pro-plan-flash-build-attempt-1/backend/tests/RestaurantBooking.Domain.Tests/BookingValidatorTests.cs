using FluentAssertions;
using RestaurantBooking.Domain;

namespace RestaurantBooking.Domain.Tests;

public class BookingValidatorTests
{
    private static readonly Guid RestaurantId = Guid.NewGuid();
    private static readonly Guid TableId = Guid.NewGuid();
    private static readonly Restaurant Restaurant = new(RestaurantId, "Test", "Italian", []);
    private static readonly List<Table> Tables = [new(TableId, "T1", 6)];
    private static readonly List<Booking> NoBookings = [];
    private static readonly Guid BookingId = Guid.NewGuid();
    private static readonly DateOnly FutureDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7));

    [Fact]
    public void PartySizeZero_ReturnsValidationError()
    {
        var result = BookingValidator.Validate(
            BookingId, RestaurantId, TableId, "John", "john@test.com",
            FutureDate, new TimeOnly(18, 0), 0, Restaurant, Tables, NoBookings);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("INVALID_PARTY_SIZE");
    }

    [Fact]
    public void PartySizeNegative_ReturnsValidationError()
    {
        var result = BookingValidator.Validate(
            BookingId, RestaurantId, TableId, "John", "john@test.com",
            FutureDate, new TimeOnly(18, 0), -1, Restaurant, Tables, NoBookings);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("INVALID_PARTY_SIZE");
    }

    [Fact]
    public void PartySizeExceedsMaxCapacity_ReturnsValidationError()
    {
        var result = BookingValidator.Validate(
            BookingId, RestaurantId, TableId, "John", "john@test.com",
            FutureDate, new TimeOnly(18, 0), 10, Restaurant, Tables, NoBookings);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("INVALID_PARTY_SIZE");
        result.Error.Message.Should().Contain("6");
    }

    [Fact]
    public void DateInPast_ReturnsValidationError()
    {
        var yesterday = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1));
        var result = BookingValidator.Validate(
            BookingId, RestaurantId, TableId, "John", "john@test.com",
            yesterday, new TimeOnly(18, 0), 4, Restaurant, Tables, NoBookings);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("INVALID_DATE");
    }

    [Fact]
    public void TimeOutsideOperatingHours_ReturnsValidationError()
    {
        var result = BookingValidator.Validate(
            BookingId, RestaurantId, TableId, "John", "john@test.com",
            FutureDate, new TimeOnly(23, 0), 4, Restaurant, Tables, NoBookings);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("INVALID_TIME");
    }

    [Fact]
    public void TimeBeforeOpening_ReturnsValidationError()
    {
        var result = BookingValidator.Validate(
            BookingId, RestaurantId, TableId, "John", "john@test.com",
            FutureDate, new TimeOnly(9, 0), 4, Restaurant, Tables, NoBookings);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("INVALID_TIME");
    }

    [Fact]
    public void CustomerNameEmpty_ReturnsValidationError()
    {
        var result = BookingValidator.Validate(
            BookingId, RestaurantId, TableId, "", "john@test.com",
            FutureDate, new TimeOnly(18, 0), 4, Restaurant, Tables, NoBookings);

        result.IsFailure.Should().BeTrue();
    }

    [Fact]
    public void CustomerEmailEmpty_ReturnsValidationError()
    {
        var result = BookingValidator.Validate(
            BookingId, RestaurantId, TableId, "John", "",
            FutureDate, new TimeOnly(18, 0), 4, Restaurant, Tables, NoBookings);

        result.IsFailure.Should().BeTrue();
    }
}
