using FluentAssertions;
using RestaurantBooking.Domain;

namespace RestaurantBooking.Domain.Tests;

public class ConflictDetectorTests
{
    private static readonly Guid TableA = Guid.NewGuid();
    private static readonly Guid TableB = Guid.NewGuid();
    private static readonly DateOnly SomeDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7));

    private static Booking MakeBooking(Guid tableId, int hour, int minute, string name = "John")
    {
        var start = new TimeOnly(hour, minute);
        return new Booking(
            Guid.NewGuid(), Guid.NewGuid(), tableId, name, "john@test.com",
            SomeDate, start, start.AddHours(1.5), 2, DateTime.UtcNow);
    }

    [Fact]
    public void OverlappingBooking_SameTable_ReturnsTrue()
    {
        var existing = new List<Booking> { MakeBooking(TableA, 18, 0) };
        var result = ConflictDetector.HasConflict(TableA, SomeDate, new TimeOnly(18, 15), new TimeOnly(19, 45), existing);
        result.Should().BeTrue();
    }

    [Fact]
    public void NonOverlappingBooking_DifferentTable_ReturnsFalse()
    {
        var existing = new List<Booking> { MakeBooking(TableA, 18, 0) };
        var result = ConflictDetector.HasConflict(TableB, SomeDate, new TimeOnly(18, 0), new TimeOnly(19, 30), existing);
        result.Should().BeFalse();
    }

    [Fact]
    public void NonOverlappingBooking_SameTableWithGap_ReturnsFalse()
    {
        var existing = new List<Booking> { MakeBooking(TableA, 12, 0) };
        var result = ConflictDetector.HasConflict(TableA, SomeDate, new TimeOnly(14, 0), new TimeOnly(15, 30), existing);
        result.Should().BeFalse();
    }

    [Fact]
    public void NoConflict_WhenBookingEndsBeforeNextStarts()
    {
        var existing = new List<Booking> { MakeBooking(TableA, 18, 0) };
        var result = ConflictDetector.HasConflict(TableA, SomeDate, new TimeOnly(19, 30), new TimeOnly(21, 0), existing);
        result.Should().BeFalse();
    }

    [Fact]
    public void Conflict_WhenBookingStartsDuringExisting()
    {
        var existing = new List<Booking> { MakeBooking(TableA, 18, 30) };
        var result = ConflictDetector.HasConflict(TableA, SomeDate, new TimeOnly(18, 0), new TimeOnly(19, 30), existing);
        result.Should().BeTrue();
    }
}
