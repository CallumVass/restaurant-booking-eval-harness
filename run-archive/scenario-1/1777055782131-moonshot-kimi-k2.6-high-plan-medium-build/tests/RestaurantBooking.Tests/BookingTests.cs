namespace RestaurantBooking.Tests;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api;
using RestaurantBooking.Api.Dtos;
using RestaurantBooking.Domain;
using Xunit;

public class BookingTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public BookingTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetRestaurants_ReturnsSeededRestaurants()
    {
        var response = await _client.GetAsync("/api/restaurants");
        response.EnsureSuccessStatusCode();

        var restaurants = await response.Content.ReadFromJsonAsync<List<RestaurantDto>>();
        Assert.NotNull(restaurants);
        Assert.Equal(2, restaurants.Count);
        Assert.Contains(restaurants, r => r.Name == "Bistro Central");
        Assert.Contains(restaurants, r => r.Name == "Sushi Corner");
    }

    [Fact]
    public async Task GetAvailableSlots_WithValidRequest_ReturnsSlots()
    {
        var restaurants = await _client.GetFromJsonAsync<List<RestaurantDto>>("/api/restaurants");
        var bistro = restaurants!.First(r => r.Name == "Bistro Central");

        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var response = await _client.GetAsync(
            $"/api/restaurants/{bistro.Id}/slots?date={tomorrow:yyyy-MM-dd}&partySize=2");
        response.EnsureSuccessStatusCode();

        var slots = await response.Content.ReadFromJsonAsync<List<string>>();
        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
        Assert.Contains("08:00", slots);
    }

    [Fact]
    public async Task GetAvailableSlots_UnknownRestaurant_Returns404()
    {
        var response = await _client.GetAsync(
            $"/api/restaurants/{Guid.NewGuid()}/slots?date=2099-01-01&partySize=2");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_Success_Returns201()
    {
        var restaurants = await _client.GetFromJsonAsync<List<RestaurantDto>>("/api/restaurants");
        var bistro = restaurants!.First(r => r.Name == "Bistro Central");
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var request = new CreateBookingRequest(
            bistro.Id,
            tomorrow,
            new TimeOnly(10, 0),
            2,
            "Alice");

        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var booking = await response.Content.ReadFromJsonAsync<BookingDto>();
        Assert.NotNull(booking);
        Assert.Equal(bistro.Id, booking.RestaurantId);
        Assert.Equal(2, booking.PartySize);
        Assert.Equal("Alice", booking.CustomerName);
    }

    [Fact]
    public async Task CreateBooking_UnknownRestaurant_Returns400()
    {
        var request = new CreateBookingRequest(
            Guid.NewGuid(),
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            new TimeOnly(10, 0),
            2,
            "Bob");

        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_InvalidPartySize_Returns400()
    {
        var restaurants = await _client.GetFromJsonAsync<List<RestaurantDto>>("/api/restaurants");
        var bistro = restaurants!.First(r => r.Name == "Bistro Central");
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var request = new CreateBookingRequest(
            bistro.Id,
            tomorrow,
            new TimeOnly(10, 0),
            0,
            "Charlie");

        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_InvalidTime_Returns400()
    {
        var restaurants = await _client.GetFromJsonAsync<List<RestaurantDto>>("/api/restaurants");
        var bistro = restaurants!.First(r => r.Name == "Bistro Central");
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var request = new CreateBookingRequest(
            bistro.Id,
            tomorrow,
            new TimeOnly(23, 0),
            2,
            "Dana");

        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_PastDate_Returns400()
    {
        var restaurants = await _client.GetFromJsonAsync<List<RestaurantDto>>("/api/restaurants");
        var bistro = restaurants!.First(r => r.Name == "Bistro Central");
        var yesterday = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1));

        var request = new CreateBookingRequest(
            bistro.Id,
            yesterday,
            new TimeOnly(10, 0),
            2,
            "Eve");

        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_OverlappingReservation_Returns409()
    {
        var restaurants = await _client.GetFromJsonAsync<List<RestaurantDto>>("/api/restaurants");
        var bistro = restaurants!.First(r => r.Name == "Bistro Central");
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var request1 = new CreateBookingRequest(
            bistro.Id,
            tomorrow,
            new TimeOnly(10, 0),
            6,
            "First");
        var response1 = await _client.PostAsJsonAsync("/api/bookings", request1);
        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);

        var request2 = new CreateBookingRequest(
            bistro.Id,
            tomorrow,
            new TimeOnly(10, 0),
            6,
            "Second");
        var response2 = await _client.PostAsJsonAsync("/api/bookings", request2);
        Assert.Equal(HttpStatusCode.Conflict, response2.StatusCode);
    }

    [Fact]
    public void TryBook_NoTableLargeEnough_ReturnsNoAvailableTable()
    {
        var restaurant = new Restaurant
        {
            Id = Guid.NewGuid(),
            Name = "Tiny Place",
            OpeningTime = new TimeOnly(9, 0),
            ClosingTime = new TimeOnly(17, 0),
        };

        var tables = new List<Table>
        {
            new() { Id = Guid.NewGuid(), RestaurantId = restaurant.Id, Capacity = 2 },
        };

        var result = AvailabilityService.TryBook(
            restaurant,
            tables,
            [],
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)),
            new TimeOnly(10, 0),
            5);

        Assert.False(result.IsSuccess);
        Assert.Equal(BookingError.NoAvailableTable, result.Error);
    }

    [Fact]
    public void FindAvailableSlots_ExcludesBookedTables()
    {
        var restaurant = new Restaurant
        {
            Id = Guid.NewGuid(),
            Name = "Test",
            OpeningTime = new TimeOnly(8, 0),
            ClosingTime = new TimeOnly(10, 0),
        };

        var table = new Table
        {
            Id = Guid.NewGuid(),
            RestaurantId = restaurant.Id,
            Capacity = 4,
        };

        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var bookings = new List<Booking>
        {
            new()
            {
                Id = Guid.NewGuid(),
                RestaurantId = restaurant.Id,
                TableId = table.Id,
                Date = date,
                StartTime = new TimeOnly(8, 0),
                EndTime = new TimeOnly(9, 0),
                PartySize = 2,
                CustomerName = "A",
            },
        };

        var slots = AvailabilityService.FindAvailableSlots(
            restaurant, [table], bookings, date, 2);

        Assert.DoesNotContain(new TimeOnly(8, 0), slots);
        Assert.Contains(new TimeOnly(9, 0), slots);
    }
}
