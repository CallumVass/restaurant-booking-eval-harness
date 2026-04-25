using FluentAssertions;
using RestaurantBooking.Domain;

namespace RestaurantBooking.Domain.Tests;

public class AvailabilityCalculatorTests
{
    private static readonly Guid Table4 = Guid.NewGuid();
    private static readonly Guid Table6 = Guid.NewGuid();
    private static readonly Guid Table2 = Guid.NewGuid();
    private static readonly DateOnly FutureDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7));

    private static readonly List<Table> Tables =
    [
        new(Table2, "T1", 2),
        new(Table4, "T2", 4),
        new(Table6, "T3", 6)
    ];

    [Fact]
    public void AllSlotsFree_ReturnsAllOperatingHourSlots()
    {
        var slots = AvailabilityCalculator.GetAvailableSlots(FutureDate, 2, Tables, []);
        slots.Should().HaveCount(7);
        slots[0].StartTime.Should().Be(new TimeOnly(11, 0));
        slots[^1].StartTime.Should().Be(new TimeOnly(20, 0));
    }

    [Fact]
    public void PartySizeExceedsAllTables_ReturnsEmpty()
    {
        var slots = AvailabilityCalculator.GetAvailableSlots(FutureDate, 10, Tables, []);
        slots.Should().BeEmpty();
    }

    [Fact]
    public void FullyBooked_ReturnsEmpty()
    {
        var existing = new List<Booking>();
        foreach (var table in Tables)
        {
            for (var h = 11; h < 22; h += 1)
            {
                var start = new TimeOnly(h, 0);
                var end = start.AddHours(1.5);
                if (end <= new TimeOnly(22, 0))
                {
                    existing.Add(new Booking(
                        Guid.NewGuid(), Guid.NewGuid(), table.Id, "John", "john@test.com",
                        FutureDate, start, end, table.Capacity, DateTime.UtcNow));
                }
            }
        }

        var slots = AvailabilityCalculator.GetAvailableSlots(FutureDate, 2, Tables, existing);
        slots.Should().BeEmpty();
    }

    [Fact]
    public void PartialBooking_ExcludesThatSlotForCapacity()
    {
        var existing = new List<Booking>
        {
            new(Guid.NewGuid(), Guid.NewGuid(), Table4, "John", "john@test.com",
                FutureDate, new TimeOnly(18, 0), new TimeOnly(19, 30), 2, DateTime.UtcNow)
        };

        var slots = AvailabilityCalculator.GetAvailableSlots(FutureDate, 4, Tables, existing);
        var slot18 = slots.Should().ContainSingle(s => s.StartTime == new TimeOnly(17, 0));
        slots.First(s => s.StartTime == new TimeOnly(17, 0)).AvailableCapacity.Should().Be(1);
    }
}
