// pattern: Functional Core

using FluentAssertions;
using RestaurantBooking.Domain.Entities;
using RestaurantBooking.Domain.Services;
using RestaurantBooking.Domain.ValueObjects;

namespace RestaurantBooking.Tests;

public class BookingServiceTests
{
    private static Restaurant CreateRestaurant(params (Guid id, int capacity)[] tables)
    {
        return new Restaurant
        {
            Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
            Name = "Test Restaurant",
            Description = "Test",
            Address = "Test Address",
            Tables = tables.Select(t => new Table
            {
                Id = t.id,
                RestaurantId = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                TableNumber = 1,
                Capacity = t.capacity
            }).ToList()
        };
    }

    private static Table GetFirstTable(Restaurant restaurant) => restaurant.Tables.First();

    [Fact]
    public void CreateBooking_WithValidData_ReturnsSuccess()
    {
        var restaurant = CreateRestaurant((Guid.Parse("00000000-0000-0000-0001-000000000001"), 4));
        var table = GetFirstTable(restaurant);
        var futureTime = DateTime.UtcNow.AddDays(1).Date.AddHours(14);

        var result = BookingService.CreateBooking(
            restaurant, table,
            "John Doe", "john@example.com", "555-1234",
            2, futureTime,
            []);

        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value!.CustomerName.Should().Be("John Doe");
        result.Value.PartySize.Should().Be(2);
    }

    [Fact]
    public void CreateBooking_WithInvalidPartySize_ReturnsFailure()
    {
        var restaurant = CreateRestaurant((Guid.Parse("00000000-0000-0000-0001-000000000001"), 4));
        var table = GetFirstTable(restaurant);
        var futureTime = DateTime.UtcNow.AddDays(1).Date.AddHours(14);

        var result = BookingService.CreateBooking(
            restaurant, table,
            "John Doe", "john@example.com", "555-1234",
            6, futureTime,
            []);

        result.IsSuccess.Should().BeFalse();
        result.Error!.Code.Should().Be(Domain.Errors.BookingErrorCode.InvalidPartySize);
    }

    [Fact]
    public void CreateBooking_InPast_ReturnsFailure()
    {
        var restaurant = CreateRestaurant((Guid.Parse("00000000-0000-0000-0001-000000000001"), 4));
        var table = GetFirstTable(restaurant);
        var pastTime = DateTime.UtcNow.AddDays(-1);

        var result = BookingService.CreateBooking(
            restaurant, table,
            "John Doe", "john@example.com", "555-1234",
            2, pastTime,
            []);

        result.IsSuccess.Should().BeFalse();
        result.Error!.Code.Should().Be(Domain.Errors.BookingErrorCode.InvalidDateTime);
    }

    [Fact]
    public void CreateBooking_NonHalfHourSlot_ReturnsFailure()
    {
        var restaurant = CreateRestaurant((Guid.Parse("00000000-0000-0000-0001-000000000001"), 4));
        var table = GetFirstTable(restaurant);
        var futureTime = DateTime.UtcNow.AddDays(1).Date.AddHours(14).AddMinutes(15);

        var result = BookingService.CreateBooking(
            restaurant, table,
            "John Doe", "john@example.com", "555-1234",
            2, futureTime,
            []);

        result.IsSuccess.Should().BeFalse();
        result.Error!.Code.Should().Be(Domain.Errors.BookingErrorCode.InvalidDateTime);
    }

    [Fact]
    public void CreateBooking_WithOverlappingReservation_ReturnsFailure()
    {
        var restaurant = CreateRestaurant((Guid.Parse("00000000-0000-0000-0001-000000000001"), 4));
        var table = GetFirstTable(restaurant);
        var existingBooking = new Booking
        {
            Id = Guid.Parse("00000000-0000-0000-0002-000000000001"),
            RestaurantId = restaurant.Id,
            TableId = table.Id,
            CustomerName = "Jane Doe",
            CustomerEmail = "jane@example.com",
            CustomerPhone = "555-5678",
            PartySize = 2,
            StartTime = DateTime.UtcNow.AddDays(1).Date.AddHours(14),
            EndTime = DateTime.UtcNow.AddDays(1).Date.AddHours(15).AddMinutes(30),
            CreatedAt = DateTime.UtcNow
        };

        var result = BookingService.CreateBooking(
            restaurant, table,
            "John Doe", "john@example.com", "555-1234",
            2, existingBooking.StartTime,
            [existingBooking]);

        result.IsSuccess.Should().BeFalse();
        result.Error!.Code.Should().Be(Domain.Errors.BookingErrorCode.OverlappingReservation);
    }

    [Fact]
    public void CreateBooking_SameTimeDifferentTable_ReturnsSuccess()
    {
        var restaurant = CreateRestaurant(
            (Guid.Parse("00000000-0000-0000-0001-000000000001"), 4),
            (Guid.Parse("00000000-0000-0000-0001-000000000002"), 4));
        var table1 = restaurant.Tables.First(t => t.Id == Guid.Parse("00000000-0000-0000-0001-000000000001"));
        var table2 = restaurant.Tables.First(t => t.Id == Guid.Parse("00000000-0000-0000-0001-000000000002"));
        var futureTime = DateTime.UtcNow.AddDays(1).Date.AddHours(14);

        var existingBooking = new Booking
        {
            Id = Guid.Parse("00000000-0000-0000-0002-000000000001"),
            RestaurantId = restaurant.Id,
            TableId = table1.Id,
            CustomerName = "Jane Doe",
            CustomerEmail = "jane@example.com",
            CustomerPhone = "555-5678",
            PartySize = 2,
            StartTime = futureTime,
            EndTime = futureTime.AddMinutes(90),
            CreatedAt = DateTime.UtcNow
        };

        var result = BookingService.CreateBooking(
            restaurant, table2,
            "John Doe", "john@example.com", "555-1234",
            2, futureTime,
            [existingBooking]);

        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public void IsSlotAvailable_WithNoConflicts_ReturnsTrue()
    {
        var restaurant = CreateRestaurant((Guid.Parse("00000000-0000-0000-0001-000000000001"), 4));
        var table = GetFirstTable(restaurant);
        var futureTime = DateTime.UtcNow.AddDays(1).Date.AddHours(14);

        var available = BookingService.IsSlotAvailable(table, futureTime, []);

        available.Should().BeTrue();
    }

    [Fact]
    public void IsSlotAvailable_WithOverlappingBooking_ReturnsFalse()
    {
        var restaurant = CreateRestaurant((Guid.Parse("00000000-0000-0000-0001-000000000001"), 4));
        var table = GetFirstTable(restaurant);
        var existingBooking = new Booking
        {
            Id = Guid.Parse("00000000-0000-0000-0002-000000000001"),
            RestaurantId = restaurant.Id,
            TableId = table.Id,
            StartTime = DateTime.UtcNow.AddDays(1).Date.AddHours(14),
            EndTime = DateTime.UtcNow.AddDays(1).Date.AddHours(15).AddMinutes(30),
            CreatedAt = DateTime.UtcNow,
            CustomerName = "Jane",
            CustomerEmail = "jane@test.com",
            CustomerPhone = "555",
            PartySize = 2
        };

        var available = BookingService.IsSlotAvailable(table, existingBooking.StartTime, [existingBooking]);

        available.Should().BeFalse();
    }

    [Fact]
    public void GetAvailableSlots_ReturnsCorrectSlots()
    {
        var restaurant = CreateRestaurant((Guid.Parse("00000000-0000-0000-0001-000000000001"), 4));
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var slots = BookingService.GetAvailableSlots(restaurant, 2, date, []);

        slots.Should().NotBeEmpty();
        slots.Should().OnlyContain(s => s.Start.Minute == 0 || s.Start.Minute == 30);
        slots.Should().OnlyContain(s => s.Start.Hour >= 11 && s.Start.Hour < 22);
    }

    [Fact]
    public void GetAvailableSlots_ExcludesBookedSlots()
    {
        var restaurant = CreateRestaurant(
            (Guid.Parse("00000000-0000-0000-0001-000000000001"), 4));
        var table1 = restaurant.Tables.First(t => t.Id == Guid.Parse("00000000-0000-0000-0001-000000000001"));
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var bookedTime = date.ToDateTime(TimeOnly.FromTimeSpan(TimeSpan.FromHours(14)));

        var existingBooking = new Booking
        {
            Id = Guid.Parse("00000000-0000-0000-0002-000000000001"),
            RestaurantId = restaurant.Id,
            TableId = table1.Id,
            StartTime = bookedTime,
            EndTime = bookedTime.AddMinutes(90),
            CreatedAt = DateTime.UtcNow,
            CustomerName = "Jane",
            CustomerEmail = "jane@test.com",
            CustomerPhone = "555",
            PartySize = 2
        };

        var slots = BookingService.GetAvailableSlots(restaurant, 2, date, [existingBooking]);

        slots.Should().NotContain(s => s.Start == bookedTime);
    }

    [Fact]
    public void TimeSlot_Overlaps_ReturnsTrue()
    {
        var slot1 = TimeSlot.FromDateTime(DateTime.UtcNow.AddDays(1).Date.AddHours(14));
        var slot2 = TimeSlot.FromDateTime(DateTime.UtcNow.AddDays(1).Date.AddHours(14).AddMinutes(30));

        slot1.Overlaps(slot2).Should().BeTrue();
    }

    [Fact]
    public void TimeSlot_NoOverlap_ReturnsFalse()
    {
        var slot1 = TimeSlot.FromDateTime(DateTime.UtcNow.AddDays(1).Date.AddHours(14));
        var slot2 = TimeSlot.FromDateTime(DateTime.UtcNow.AddDays(1).Date.AddHours(16));

        slot1.Overlaps(slot2).Should().BeFalse();
    }

    [Fact]
    public void Restaurant_HasTableFor_ReturnsTrue()
    {
        var restaurant = CreateRestaurant(
            (Guid.Parse("00000000-0000-0000-0001-000000000001"), 2),
            (Guid.Parse("00000000-0000-0000-0001-000000000002"), 6));

        restaurant.HasTableFor(4).Should().BeTrue();
        restaurant.HasTableFor(8).Should().BeFalse();
    }

    [Fact]
    public void Restaurant_TablesFor_FiltersCorrectly()
    {
        var restaurant = CreateRestaurant(
            (Guid.Parse("00000000-0000-0000-0001-000000000001"), 2),
            (Guid.Parse("00000000-0000-0000-0001-000000000002"), 6));

        var tables = restaurant.TablesFor(4).ToList();

        tables.Should().HaveCount(1);
        tables.First().Capacity.Should().Be(6);
    }

    [Fact]
    public void CreateBooking_TableTooSmall_ReturnsFailure()
    {
        var restaurant = CreateRestaurant((Guid.Parse("00000000-0000-0000-0001-000000000001"), 2));
        var table = GetFirstTable(restaurant);
        var futureTime = DateTime.UtcNow.AddDays(1).Date.AddHours(14);

        var result = BookingService.CreateBooking(
            restaurant, table,
            "John Doe", "john@example.com", "555-1234",
            4, futureTime,
            []);

        result.IsSuccess.Should().BeFalse();
        result.Error!.Code.Should().Be(Domain.Errors.BookingErrorCode.InvalidPartySize);
    }

    [Fact]
    public void CreateBooking_TableMismatchRestaurant_ReturnsFailure()
    {
        var restaurant = CreateRestaurant((Guid.Parse("00000000-0000-0000-0001-000000000001"), 4));
        var wrongRestaurantTable = new Table
        {
            Id = Guid.Parse("00000000-0000-0000-0001-000000000099"),
            RestaurantId = Guid.Parse("99999999-9999-9999-9999-999999999999"),
            TableNumber = 99,
            Capacity = 4
        };
        var futureTime = DateTime.UtcNow.AddDays(1).Date.AddHours(14);

        var result = BookingService.CreateBooking(
            restaurant, wrongRestaurantTable,
            "John Doe", "john@example.com", "555-1234",
            2, futureTime,
            []);

        result.IsSuccess.Should().BeFalse();
        result.Error!.Code.Should().Be(Domain.Errors.BookingErrorCode.TableNotFound);
    }
}