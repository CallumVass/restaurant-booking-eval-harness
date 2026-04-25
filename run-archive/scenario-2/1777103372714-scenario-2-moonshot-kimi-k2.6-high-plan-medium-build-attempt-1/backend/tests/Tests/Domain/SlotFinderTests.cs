// pattern: Functional Core

using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Tests.Domain;

public class SlotFinderTests
{
    [Fact]
    public void FindAvailableSlots_ExcludesOverlappingBookings()
    {
        var table = new Table(Guid.NewGuid(), "T1", 4);
        var restaurant = new Restaurant(Guid.NewGuid(), "R1", "Desc", [table]);

        var bookings = new List<Booking>
        {
            new(Guid.NewGuid(), restaurant.Id, table.Id,
                new DateTime(2025, 6, 1, 12, 0, 0),
                new DateTime(2025, 6, 1, 14, 0, 0),
                2, "A", "a@example.com")
        };

        var slots = SlotFinder.FindAvailableSlots(restaurant, new DateOnly(2025, 6, 1), 2, bookings);

        Assert.DoesNotContain(slots, s => s.StartTime.Hour == 12);
        Assert.DoesNotContain(slots, s => s.StartTime.Hour == 11); // 11-13 overlaps 12-14
        Assert.DoesNotContain(slots, s => s.StartTime.Hour == 13); // 13-15 overlaps 12-14
    }

    [Fact]
    public void FindAvailableSlots_FindsSlotForSecondTable()
    {
        var t1 = new Table(Guid.NewGuid(), "T1", 4);
        var t2 = new Table(Guid.NewGuid(), "T2", 4);
        var restaurant = new Restaurant(Guid.NewGuid(), "R1", "Desc", [t1, t2]);

        var bookings = new List<Booking>
        {
            new(Guid.NewGuid(), restaurant.Id, t1.Id,
                new DateTime(2025, 6, 1, 12, 0, 0),
                new DateTime(2025, 6, 1, 14, 0, 0),
                2, "A", "a@example.com")
        };

        var slots = SlotFinder.FindAvailableSlots(restaurant, new DateOnly(2025, 6, 1), 2, bookings);
        Assert.Contains(slots, s => s.StartTime.Hour == 12);
    }

    [Fact]
    public void FindAvailableSlots_RespectsPartySize()
    {
        var table = new Table(Guid.NewGuid(), "T1", 2);
        var restaurant = new Restaurant(Guid.NewGuid(), "R1", "Desc", [table]);

        var slots = SlotFinder.FindAvailableSlots(restaurant, new DateOnly(2025, 6, 1), 4, []);
        Assert.Empty(slots);
    }
}
