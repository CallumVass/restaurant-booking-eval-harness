using RestaurantBooking.Domain;
using Xunit;

namespace RestaurantBooking.Tests;

public class BookingServiceTests
{
    private static readonly IReadOnlyList<Restaurant> Restaurants =
    [
        new Restaurant
        {
            Id = "rest-1",
            Name = "Test Restaurant",
            Address = "123 Test St",
            Tables =
            [
                new Table { Id = "t1", RestaurantId = "rest-1", Seats = 2 },
                new Table { Id = "t2", RestaurantId = "rest-1", Seats = 4 },
                new Table { Id = "t3", RestaurantId = "rest-1", Seats = 8 },
            ]
        }
    ];

    private static DateOnly FutureDate => DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

    [Fact]
    public void CreateBooking_ValidRequest_ReturnsSuccess()
    {
        var request = new BookingRequest
        {
            RestaurantId = "rest-1",
            CustomerName = "Alice",
            PartySize = 2,
            Date = FutureDate,
            StartTime = new TimeOnly(18, 0)
        };

        var result = BookingService.CreateBooking(Restaurants, [], request);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal("Alice", result.Value.CustomerName);
        Assert.Equal("Confirmed", result.Value.Status);
    }

    [Fact]
    public void CreateBooking_PartySizeZero_ReturnsInvalidPartySize()
    {
        var request = new BookingRequest
        {
            RestaurantId = "rest-1",
            CustomerName = "Bob",
            PartySize = 0,
            Date = FutureDate,
            StartTime = new TimeOnly(18, 0)
        };

        var result = BookingService.CreateBooking(Restaurants, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("INVALID_PARTY_SIZE", result.ErrorCode);
    }

    [Fact]
    public void CreateBooking_PartySizeNegative_ReturnsInvalidPartySize()
    {
        var request = new BookingRequest
        {
            RestaurantId = "rest-1",
            CustomerName = "Bob",
            PartySize = -1,
            Date = FutureDate,
            StartTime = new TimeOnly(18, 0)
        };

        var result = BookingService.CreateBooking(Restaurants, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("INVALID_PARTY_SIZE", result.ErrorCode);
    }

    [Fact]
    public void CreateBooking_PartySizeOverMax_ReturnsInvalidPartySize()
    {
        var request = new BookingRequest
        {
            RestaurantId = "rest-1",
            CustomerName = "Bob",
            PartySize = 21,
            Date = FutureDate,
            StartTime = new TimeOnly(18, 0)
        };

        var result = BookingService.CreateBooking(Restaurants, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("INVALID_PARTY_SIZE", result.ErrorCode);
    }

    [Fact]
    public void CreateBooking_UnknownRestaurant_ReturnsRestaurantNotFound()
    {
        var request = new BookingRequest
        {
            RestaurantId = "rest-unknown",
            CustomerName = "Bob",
            PartySize = 2,
            Date = FutureDate,
            StartTime = new TimeOnly(18, 0)
        };

        var result = BookingService.CreateBooking(Restaurants, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("RESTAURANT_NOT_FOUND", result.ErrorCode);
    }

    [Fact]
    public void CreateBooking_PastDate_ReturnsInvalidDate()
    {
        var request = new BookingRequest
        {
            RestaurantId = "rest-1",
            CustomerName = "Bob",
            PartySize = 2,
            Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)),
            StartTime = new TimeOnly(18, 0)
        };

        var result = BookingService.CreateBooking(Restaurants, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("INVALID_DATE", result.ErrorCode);
    }

    [Fact]
    public void CreateBooking_InvalidTimeSlot_ReturnsInvalidTimeSlot()
    {
        var request = new BookingRequest
        {
            RestaurantId = "rest-1",
            CustomerName = "Bob",
            PartySize = 2,
            Date = FutureDate,
            StartTime = new TimeOnly(15, 30)
        };

        var result = BookingService.CreateBooking(Restaurants, [], request);

        Assert.False(result.IsSuccess);
        Assert.Equal("INVALID_TIME_SLOT", result.ErrorCode);
    }

    [Fact]
    public void CreateBooking_OverlappingReservation_ReturnsNoTableAvailable()
    {
        var existingBookings = new List<Booking>
        {
            new Booking
            {
                Id = "existing-1",
                RestaurantId = "rest-1",
                TableId = "t1",
                CustomerName = "Existing",
                PartySize = 2,
                Date = FutureDate,
                StartTime = new TimeOnly(18, 0),
                EndTime = new TimeOnly(19, 0),
                Status = "Confirmed"
            },
            new Booking
            {
                Id = "existing-2",
                RestaurantId = "rest-1",
                TableId = "t2",
                CustomerName = "Existing2",
                PartySize = 4,
                Date = FutureDate,
                StartTime = new TimeOnly(18, 0),
                EndTime = new TimeOnly(19, 0),
                Status = "Confirmed"
            },
            new Booking
            {
                Id = "existing-3",
                RestaurantId = "rest-1",
                TableId = "t3",
                CustomerName = "Existing3",
                PartySize = 8,
                Date = FutureDate,
                StartTime = new TimeOnly(18, 0),
                EndTime = new TimeOnly(19, 0),
                Status = "Confirmed"
            }
        };

        var request = new BookingRequest
        {
            RestaurantId = "rest-1",
            CustomerName = "Bob",
            PartySize = 2,
            Date = FutureDate,
            StartTime = new TimeOnly(18, 0)
        };

        var result = BookingService.CreateBooking(Restaurants, existingBookings, request);

        Assert.False(result.IsSuccess);
        Assert.Equal("NO_TABLE_AVAILABLE", result.ErrorCode);
    }

    [Fact]
    public void CreateBooking_SmallerTableAvailable_BooksSmallerTable()
    {
        var existing = new Booking
        {
            Id = "existing-1",
            RestaurantId = "rest-1",
            TableId = "t2",
            CustomerName = "Existing",
            PartySize = 4,
            Date = FutureDate,
            StartTime = new TimeOnly(18, 0),
            EndTime = new TimeOnly(19, 0),
            Status = "Confirmed"
        };

        var request = new BookingRequest
        {
            RestaurantId = "rest-1",
            CustomerName = "Bob",
            PartySize = 2,
            Date = FutureDate,
            StartTime = new TimeOnly(18, 0)
        };

        var result = BookingService.CreateBooking(Restaurants, [existing], request);

        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal("t1", result.Value.TableId);
    }

    [Fact]
    public void GetAvailableSlots_NoBookings_AllSlotsAvailable()
    {
        var request = new SlotAvailabilityRequest
        {
            RestaurantId = "rest-1",
            Date = FutureDate,
            PartySize = 2
        };

        var slots = BookingService.GetAvailableSlots(Restaurants, [], request);

        Assert.Equal(6, slots.Count);
        Assert.All(slots, s => Assert.True(s.IsAvailable));
    }

    [Fact]
    public void GetAvailableSlots_UnknownRestaurant_ReturnsEmpty()
    {
        var request = new SlotAvailabilityRequest
        {
            RestaurantId = "rest-unknown",
            Date = FutureDate,
            PartySize = 2
        };

        var slots = BookingService.GetAvailableSlots(Restaurants, [], request);

        Assert.Empty(slots);
    }

    [Fact]
    public void GetAvailableSlots_InvalidPartySize_ReturnsEmpty()
    {
        var request = new SlotAvailabilityRequest
        {
            RestaurantId = "rest-1",
            Date = FutureDate,
            PartySize = 0
        };

        var slots = BookingService.GetAvailableSlots(Restaurants, [], request);

        Assert.Empty(slots);
    }

    [Fact]
    public void GetAvailableSlots_PastDate_ReturnsEmpty()
    {
        var request = new SlotAvailabilityRequest
        {
            RestaurantId = "rest-1",
            Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)),
            PartySize = 2
        };

        var slots = BookingService.GetAvailableSlots(Restaurants, [], request);

        Assert.Empty(slots);
    }

    [Fact]
    public void GetAvailableSlots_OverlappingBooking_SlotMarkedUnavailable()
    {
        var existingBookings = new List<Booking>
        {
            new Booking
            {
                Id = "existing-1",
                RestaurantId = "rest-1",
                TableId = "t1",
                CustomerName = "Existing",
                PartySize = 2,
                Date = FutureDate,
                StartTime = new TimeOnly(18, 0),
                EndTime = new TimeOnly(19, 0),
                Status = "Confirmed"
            },
            new Booking
            {
                Id = "existing-2",
                RestaurantId = "rest-1",
                TableId = "t2",
                CustomerName = "Existing2",
                PartySize = 4,
                Date = FutureDate,
                StartTime = new TimeOnly(18, 0),
                EndTime = new TimeOnly(19, 0),
                Status = "Confirmed"
            },
            new Booking
            {
                Id = "existing-3",
                RestaurantId = "rest-1",
                TableId = "t3",
                CustomerName = "Existing3",
                PartySize = 8,
                Date = FutureDate,
                StartTime = new TimeOnly(18, 0),
                EndTime = new TimeOnly(19, 0),
                Status = "Confirmed"
            }
        };

        var request = new SlotAvailabilityRequest
        {
            RestaurantId = "rest-1",
            Date = FutureDate,
            PartySize = 2
        };

        var slots = BookingService.GetAvailableSlots(Restaurants, existingBookings, request);

        var slot18 = slots.First(s => s.Start.Hour == 18);
        Assert.False(slot18.IsAvailable);

        var slot19 = slots.First(s => s.Start.Hour == 19);
        Assert.True(slot19.IsAvailable);
    }
}
