using RestaurantBooking.Domain;

namespace RestaurantBooking.Tests;

public class AvailabilityTests
{
    private static readonly Restaurant TestRestaurant = new()
    {
        Id = "r1",
        Name = "Test Restaurant",
        Cuisine = "Italian",
        Address = "123 Test St",
        Tables = new List<Table>
        {
            new() { Id = "t1", Capacity = 2, Label = "Small" },
            new() { Id = "t2", Capacity = 4, Label = "Medium" },
            new() { Id = "t3", Capacity = 8, Label = "Large" }
        }
    };

    [Fact]
    public void GetAvailableSlots_EmptyRestaurant_AllSlotsAvailable()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var slots = BookingService.GetAvailableSlots(TestRestaurant, [], date, 2);

        Assert.NotEmpty(slots);
        Assert.All(slots, s => Assert.True(s.Time >= BookingService.OperatingStart && s.Time < BookingService.OperatingEnd));
        Assert.All(slots, s => Assert.True(s.Capacity >= 2));
    }

    [Fact]
    public void GetAvailableSlots_TableBooked_SlotNotAvailableForThatTable()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var bookedTime = date.ToDateTime(new TimeOnly(18, 0));

        var existing = new Booking
        {
            Id = "existing",
            RestaurantId = "r1",
            TableId = "t3", // The only table that fits 6
            CustomerName = "Alice",
            CustomerEmail = "alice@test.com",
            PartySize = 6,
            ReservationTime = bookedTime,
            DurationMinutes = 90
        };

        var slots = BookingService.GetAvailableSlots(TestRestaurant, [existing], date, 6);

        // The 18:00 slot should be filtered out for party of 6 (only t3 fits, and it's booked)
        var sixPmSlot = slots.FirstOrDefault(s => s.Time == new TimeOnly(18, 0));
        Assert.Null(sixPmSlot);

        // After the booking ends at 19:30, next slot at 19:30 should be available
        var sevenThirtySlot = slots.FirstOrDefault(s => s.Time == new TimeOnly(19, 30));
        Assert.NotNull(sevenThirtySlot);
    }

    [Fact]
    public void GetAvailableSlots_PartySizeExceedsAllTables_ReturnsEmpty()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var slots = BookingService.GetAvailableSlots(TestRestaurant, [], date, 20);

        Assert.Empty(slots);
    }

    [Fact]
    public void GetAvailableSlots_NegativePartySize_ReturnsEmpty()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var slots = BookingService.GetAvailableSlots(TestRestaurant, [], date, 0);

        Assert.Empty(slots);
    }

    [Fact]
    public void GetAvailableSlots_MultipleTables_LargePartyGetsCorrectTable()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var slots = BookingService.GetAvailableSlots(TestRestaurant, [], date, 3);

        Assert.NotEmpty(slots);
        // Party of 3 should use t2 (capacity 4) or t3 (capacity 8), NOT t1 (capacity 2)
        Assert.All(slots, s => Assert.True(s.Capacity >= 3));
        Assert.All(slots, s => Assert.NotEqual("t1", s.TableId));
    }

    [Fact]
    public void GetAvailableSlots_AllTablesBooked_ReturnsEmpty()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var time = date.ToDateTime(new TimeOnly(18, 0));

        var bookings = TestRestaurant.Tables.Select(t => new Booking
        {
            Id = Guid.NewGuid().ToString(),
            RestaurantId = "r1",
            TableId = t.Id,
            CustomerName = "Guest",
            CustomerEmail = "guest@test.com",
            PartySize = t.Capacity,
            ReservationTime = time,
            DurationMinutes = 90
        }).ToList();

        var slots = BookingService.GetAvailableSlots(TestRestaurant, bookings, date, 2);

        // The 18:00 slot should be filtered out (all tables booked)
        var sixPmSlot = slots.FirstOrDefault(s => s.Time == new TimeOnly(18, 0));
        Assert.Null(sixPmSlot);

        // 18:30 conflicts with the 18:00 booking (90 min duration) so also filtered
        var sixThirtySlot = slots.FirstOrDefault(s => s.Time == new TimeOnly(18, 30));
        Assert.Null(sixThirtySlot);

        // After bookings end at 19:30, slots should be available again
        var sevenThirtySlot = slots.FirstOrDefault(s => s.Time == new TimeOnly(19, 30));
        Assert.NotNull(sevenThirtySlot);
    }
}
