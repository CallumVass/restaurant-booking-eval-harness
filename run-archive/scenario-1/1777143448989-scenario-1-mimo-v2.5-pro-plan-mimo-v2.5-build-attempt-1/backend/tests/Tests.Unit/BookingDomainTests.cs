using RestaurantBooking.Domain.Bookings;
using RestaurantBooking.Domain.Common;

namespace RestaurantBooking.Tests.Unit;

public class BookingDomainTests
{
    private static readonly Guid RestaurantId = Guid.NewGuid();
    private static readonly DateOnly Today = DateOnly.FromDateTime(DateTime.UtcNow);
    private static readonly DateOnly Tomorrow = Today.AddDays(1);
    private static readonly DateOnly Yesterday = Today.AddDays(-1);

    private static readonly IReadOnlyList<Domain.Tables.Table> DefaultTables = new List<Domain.Tables.Table>
    {
        new() { Id = Guid.NewGuid(), RestaurantId = RestaurantId, Seats = 2 },
        new() { Id = Guid.NewGuid(), RestaurantId = RestaurantId, Seats = 4 },
        new() { Id = Guid.NewGuid(), RestaurantId = RestaurantId, Seats = 6 },
    };

    private static readonly IReadOnlyList<Booking> EmptyBookings = new List<Booking>();

    private static readonly Domain.Restaurants.Restaurant DefaultRestaurant = new()
    {
        Id = RestaurantId,
        Name = "Test Restaurant",
        Address = "123 Test St",
        MaxPartySize = 12
    };

    [Fact]
    public void GetAvailableSlots_ReturnsSlots_ForValidRequest()
    {
        var result = BookingDomain.GetAvailableSlots(Tomorrow, 2, DefaultTables, EmptyBookings, 12);

        Assert.True(result.IsSuccess);
        Assert.NotEmpty(result.Value!);
    }

    [Fact]
    public void GetAvailableSlots_ReturnsError_ForPartySizeZero()
    {
        var result = BookingDomain.GetAvailableSlots(Tomorrow, 0, DefaultTables, EmptyBookings, 12);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidPartySize, result.Error);
    }

    [Fact]
    public void GetAvailableSlots_ReturnsError_ForNegativePartySize()
    {
        var result = BookingDomain.GetAvailableSlots(Tomorrow, -1, DefaultTables, EmptyBookings, 12);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidPartySize, result.Error);
    }

    [Fact]
    public void GetAvailableSlots_ReturnsError_ForPartySizeExceedingMax()
    {
        var result = BookingDomain.GetAvailableSlots(Tomorrow, 13, DefaultTables, EmptyBookings, 12);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidPartySize, result.Error);
    }

    [Fact]
    public void GetAvailableSlots_ReturnsError_ForPastDate()
    {
        var result = BookingDomain.GetAvailableSlots(Yesterday, 2, DefaultTables, EmptyBookings, 12);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidDate, result.Error);
    }

    [Fact]
    public void GetAvailableSlots_ReturnsError_WhenNoTablesFit()
    {
        var result = BookingDomain.GetAvailableSlots(Tomorrow, 20, DefaultTables, EmptyBookings, 30);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.NoAvailableTable, result.Error);
    }

    [Fact]
    public void GetAvailableSlots_ExcludesBookedSlots()
    {
        var tables = new List<Domain.Tables.Table>
        {
            new() { Id = Guid.NewGuid(), RestaurantId = RestaurantId, Seats = 4 }
        };

        var bookings = new List<Booking>
        {
            new()
            {
                Id = Guid.NewGuid(),
                RestaurantId = RestaurantId,
                TableId = tables[0].Id,
                CustomerName = "Test",
                CustomerEmail = "test@test.com",
                PartySize = 2,
                Date = Tomorrow,
                StartTime = new TimeOnly(11, 0),
                EndTime = new TimeOnly(12, 0)
            }
        };

        var result = BookingDomain.GetAvailableSlots(Tomorrow, 2, tables, bookings, 12);

        Assert.True(result.IsSuccess);
        var slots = result.Value!;
        Assert.DoesNotContain(slots, s => s.StartTime == new TimeOnly(11, 0));
    }

    [Fact]
    public void CreateBooking_Succeeds_ForValidRequest()
    {
        var request = new CreateBookingRequest("John", "john@test.com", 2, Tomorrow, new TimeOnly(11, 0));

        var result = BookingDomain.CreateBooking(request, DefaultRestaurant, DefaultTables, EmptyBookings);

        Assert.True(result.IsSuccess);
        Assert.Equal("John", result.Value!.CustomerName);
        Assert.Equal(new TimeOnly(12, 0), result.Value.EndTime);
    }

    [Fact]
    public void CreateBooking_Rejects_PartySizeZero()
    {
        var request = new CreateBookingRequest("John", "john@test.com", 0, Tomorrow, new TimeOnly(11, 0));

        var result = BookingDomain.CreateBooking(request, DefaultRestaurant, DefaultTables, EmptyBookings);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidPartySize, result.Error);
    }

    [Fact]
    public void CreateBooking_Rejects_PartySizeExceedingMax()
    {
        var request = new CreateBookingRequest("John", "john@test.com", 15, Tomorrow, new TimeOnly(11, 0));

        var result = BookingDomain.CreateBooking(request, DefaultRestaurant, DefaultTables, EmptyBookings);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidPartySize, result.Error);
    }

    [Fact]
    public void CreateBooking_Rejects_PastDate()
    {
        var request = new CreateBookingRequest("John", "john@test.com", 2, Yesterday, new TimeOnly(11, 0));

        var result = BookingDomain.CreateBooking(request, DefaultRestaurant, DefaultTables, EmptyBookings);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidDate, result.Error);
    }

    [Fact]
    public void CreateBooking_Rejects_InvalidTime_BeforeServiceStart()
    {
        var request = new CreateBookingRequest("John", "john@test.com", 2, Tomorrow, new TimeOnly(9, 0));

        var result = BookingDomain.CreateBooking(request, DefaultRestaurant, DefaultTables, EmptyBookings);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidTime, result.Error);
    }

    [Fact]
    public void CreateBooking_Rejects_InvalidTime_AfterServiceEnd()
    {
        var request = new CreateBookingRequest("John", "john@test.com", 2, Tomorrow, new TimeOnly(23, 0));

        var result = BookingDomain.CreateBooking(request, DefaultRestaurant, DefaultTables, EmptyBookings);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.InvalidTime, result.Error);
    }

    [Fact]
    public void CreateBooking_Rejects_NoAvailableTable()
    {
        var smallTables = new List<Domain.Tables.Table>
        {
            new() { Id = Guid.NewGuid(), RestaurantId = RestaurantId, Seats = 2 }
        };

        var request = new CreateBookingRequest("John", "john@test.com", 4, Tomorrow, new TimeOnly(11, 0));

        var result = BookingDomain.CreateBooking(request, DefaultRestaurant, smallTables, EmptyBookings);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.NoAvailableTable, result.Error);
    }

    [Fact]
    public void CreateBooking_Rejects_OverlappingReservation()
    {
        var tables = new List<Domain.Tables.Table>
        {
            new() { Id = Guid.NewGuid(), RestaurantId = RestaurantId, Seats = 4 }
        };

        var bookings = new List<Booking>
        {
            new()
            {
                Id = Guid.NewGuid(),
                RestaurantId = RestaurantId,
                TableId = tables[0].Id,
                CustomerName = "Existing",
                CustomerEmail = "existing@test.com",
                PartySize = 2,
                Date = Tomorrow,
                StartTime = new TimeOnly(11, 0),
                EndTime = new TimeOnly(12, 0)
            }
        };

        var request = new CreateBookingRequest("John", "john@test.com", 2, Tomorrow, new TimeOnly(11, 0));

        var result = BookingDomain.CreateBooking(request, DefaultRestaurant, tables, bookings);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.OverlappingReservation, result.Error);
    }

    [Fact]
    public void CreateBooking_Allows_BookingDifferentTableSameTime()
    {
        var tables = new List<Domain.Tables.Table>
        {
            new() { Id = Guid.NewGuid(), RestaurantId = RestaurantId, Seats = 4 },
            new() { Id = Guid.NewGuid(), RestaurantId = RestaurantId, Seats = 4 }
        };

        var bookings = new List<Booking>
        {
            new()
            {
                Id = Guid.NewGuid(),
                RestaurantId = RestaurantId,
                TableId = tables[0].Id,
                CustomerName = "Existing",
                CustomerEmail = "existing@test.com",
                PartySize = 2,
                Date = Tomorrow,
                StartTime = new TimeOnly(11, 0),
                EndTime = new TimeOnly(12, 0)
            }
        };

        var request = new CreateBookingRequest("John", "john@test.com", 2, Tomorrow, new TimeOnly(11, 0));

        var result = BookingDomain.CreateBooking(request, DefaultRestaurant, tables, bookings);

        Assert.True(result.IsSuccess);
        Assert.Equal(tables[1].Id, result.Value!.TableId);
    }

    [Fact]
    public void CreateBooking_PicksSmallestSuitableTable()
    {
        var tables = new List<Domain.Tables.Table>
        {
            new() { Id = Guid.NewGuid(), RestaurantId = RestaurantId, Seats = 6 },
            new() { Id = Guid.NewGuid(), RestaurantId = RestaurantId, Seats = 4 },
            new() { Id = Guid.NewGuid(), RestaurantId = RestaurantId, Seats = 2 }
        };

        var request = new CreateBookingRequest("John", "john@test.com", 2, Tomorrow, new TimeOnly(11, 0));

        var result = BookingDomain.CreateBooking(request, DefaultRestaurant, tables, EmptyBookings);

        Assert.True(result.IsSuccess);
        Assert.Equal(tables[2].Id, result.Value!.TableId);
    }
}
