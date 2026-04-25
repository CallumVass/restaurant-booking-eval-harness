using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Api.Tests;

public class ApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetRestaurants_ReturnsSeededRestaurants()
    {
        var response = await _client.GetAsync("/api/restaurants");
        response.EnsureSuccessStatusCode();

        var restaurants = await response.Content.ReadFromJsonAsync<List<RestaurantSummary>>();
        Assert.NotNull(restaurants);
        Assert.Equal(3, restaurants.Count);
        Assert.Contains(restaurants, r => r.Name == "Bella Napoli");
        Assert.Contains(restaurants, r => r.Name == "Sakura Garden");
        Assert.Contains(restaurants, r => r.Name == "The Steakhouse");
    }

    [Fact]
    public async Task CreateBooking_ValidRequest_ReturnsCreated()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var request = new BookingRequest(1, "Alice", "alice@test.com", 2, tomorrow, new TimeOnly(18, 0));

        var response = await _client.PostAsJsonAsync("/api/bookings", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<BookingResult>();
        Assert.NotNull(result);
        Assert.Equal("Alice", result.CustomerName);
    }

    [Fact]
    public async Task CreateBooking_InvalidPartySize_ReturnsBadRequest()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var request = new BookingRequest(1, "Alice", "alice@test.com", 0, tomorrow, new TimeOnly(18, 0));

        var response = await _client.PostAsJsonAsync("/api/bookings", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_OverlappingReservation_ReturnsConflict()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var request1 = new BookingRequest(1, "Alice", "alice@test.com", 8, tomorrow, new TimeOnly(18, 0));
        var request2 = new BookingRequest(1, "Bob", "bob@test.com", 8, tomorrow, new TimeOnly(18, 30));

        var response1 = await _client.PostAsJsonAsync("/api/bookings", request1);
        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);

        var response2 = await _client.PostAsJsonAsync("/api/bookings", request2);

        Assert.Equal(HttpStatusCode.Conflict, response2.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_UnknownRestaurant_ReturnsBadRequest()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var request = new BookingRequest(999, "Alice", "alice@test.com", 2, tomorrow, new TimeOnly(18, 0));

        var response = await _client.PostAsJsonAsync("/api/bookings", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_PastDate_ReturnsBadRequest()
    {
        var pastDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1));
        var request = new BookingRequest(1, "Alice", "alice@test.com", 2, pastDate, new TimeOnly(18, 0));

        var response = await _client.PostAsJsonAsync("/api/bookings", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetTimeslots_ReturnsAvailableSlots()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var response = await _client.GetAsync($"/api/timeslots?restaurantId=1&date={tomorrow:yyyy-MM-dd}&partySize=2");

        response.EnsureSuccessStatusCode();
        var slots = await response.Content.ReadFromJsonAsync<List<TimeSlot>>();
        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
    }

    [Fact]
    public async Task GetTimeslots_UnknownRestaurant_ReturnsBadRequest()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var response = await _client.GetAsync($"/api/timeslots?restaurantId=999&date={tomorrow:yyyy-MM-dd}&partySize=2");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetBookings_ReturnsExistingBookings()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var request = new BookingRequest(1, "Alice", "alice@test.com", 2, tomorrow, new TimeOnly(18, 0));
        await _client.PostAsJsonAsync("/api/bookings", request);

        var response = await _client.GetAsync($"/api/bookings?restaurantId=1&date={tomorrow:yyyy-MM-dd}");
        response.EnsureSuccessStatusCode();

        var bookings = await response.Content.ReadFromJsonAsync<List<BookingResult>>();
        Assert.NotNull(bookings);
        Assert.NotEmpty(bookings);
    }
}
