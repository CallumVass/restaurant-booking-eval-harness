// pattern: Mixed (unavoidable - test file)

using RestaurantBooking.Domain;

namespace RestaurantBooking.Tests.Domain;

public class AvailabilityTests
{
    private static readonly Restaurant TestRestaurant = new(
        Guid.NewGuid(), "Test", "Desc", "Test",
        [new Table(Guid.NewGuid(), 4), new Table(Guid.NewGuid(), 6)]);

    [Fact]
    public void GetAvailableSlots_NoBookings_AllSlotsAvailable()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var slots = Availability.GetAvailableSlots(TestRestaurant, date, 2, []);
        Assert.NotEmpty(slots);
        Assert.All(slots, s => Assert.True(s.Available));
    }

    [Fact]
    public void GetAvailableSlots_WithBookings_MarksConflictingSlots()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var tableId = TestRestaurant.Tables[0].Id;
        var existing = new List<Booking>
        {
            new(Guid.NewGuid(), TestRestaurant.Id, tableId, date, new TimeOnly(12, 0),
                2, "John", "john@test.com", DateTime.UtcNow)
        };

        var slots = Availability.GetAvailableSlots(TestRestaurant, date, 2, existing);

        var conflictingSlots = slots.Where(s => s.TableId == tableId && s.Time == new TimeOnly(12, 0));
        Assert.All(conflictingSlots, s => Assert.False(s.Available));
    }

    [Fact]
    public void GetAvailableSlots_PartyTooLarge_SkipsSmallTables()
    {
        var restaurant = new Restaurant(
            Guid.NewGuid(), "Test", "Desc", "Test",
            [new Table(Guid.NewGuid(), 2), new Table(Guid.NewGuid(), 6)]);

        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var slots = Availability.GetAvailableSlots(restaurant, date, 4, []);

        var tableIds = slots.Select(s => s.TableId).Distinct().ToList();
        Assert.Single(tableIds);
        Assert.Equal(restaurant.Tables[1].Id, tableIds[0]);
    }

    [Fact]
    public void GetAvailableSlots_TimeSlotCount_ReturnsAllSlotsForDay()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var slots = Availability.GetAvailableSlots(TestRestaurant, date, 2, []);

        var timeSlots = slots.Select(s => s.Time).Distinct().Count();
        var expectedSlots = ((ValidationRules.LastSeatingTime.Hour - ValidationRules.OpeningTime.Hour) * 2) + 1;
        Assert.Equal(expectedSlots, timeSlots);
    }

    [Fact]
    public void GetAvailableSlots_UsesAllSuitableTables()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var slots = Availability.GetAvailableSlots(TestRestaurant, date, 2, []);

        var tableIds = slots.Select(s => s.TableId).Distinct().ToList();
        Assert.Equal(2, tableIds.Count);
    }
}
