using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Json;

namespace RestaurantBooking.Api.Tests;

public class ApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetRestaurants_ReturnsSeededData()
    {
        var response = await _client.GetAsync("/api/restaurants");

        response.EnsureSuccessStatusCode();
        var restaurants = await response.Content.ReadFromJsonAsync<List<RestaurantDto>>();
        Assert.NotNull(restaurants);
        Assert.True(restaurants.Count >= 3);
    }

    [Fact]
    public async Task GetRestaurant_ExistingId_ReturnsRestaurant()
    {
        var response = await _client.GetAsync("/api/restaurants/r1");

        response.EnsureSuccessStatusCode();
        var restaurant = await response.Content.ReadFromJsonAsync<RestaurantDto>();
        Assert.NotNull(restaurant);
        Assert.Equal("The Golden Fork", restaurant.Name);
    }

    [Fact]
    public async Task GetRestaurant_NonExistingId_Returns404()
    {
        var response = await _client.GetAsync("/api/restaurants/nonexistent");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetAvailability_ValidRequest_ReturnsSlots()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var response = await _client.GetAsync($"/api/restaurants/r1/availability?date={tomorrow}&partySize=2");

        response.EnsureSuccessStatusCode();
        var slots = await response.Content.ReadFromJsonAsync<List<AvailableSlotDto>>();
        Assert.NotNull(slots);
        Assert.True(slots.Count > 0);
    }

    [Fact]
    public async Task GetAvailability_InvalidPartySize_ReturnsBadRequest()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var response = await _client.GetAsync($"/api/restaurants/r1/availability?date={tomorrow}&partySize=0");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetAvailability_NonExistingRestaurant_Returns404()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var response = await _client.GetAsync($"/api/restaurants/nonexistent/availability?date={tomorrow}&partySize=2");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_ValidRequest_ReturnsCreated()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var request = new
        {
            restaurantId = "r1",
            customerName = "Test User",
            partySize = 2,
            date = tomorrow.ToString("yyyy-MM-dd"),
            startTime = "12:00",
            endTime = "13:00"
        };

        var response = await _client.PostAsJsonAsync("/api/bookings", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var booking = await response.Content.ReadFromJsonAsync<BookingDto>();
        Assert.NotNull(booking);
        Assert.Equal("Test User", booking.CustomerName);
    }

    [Fact]
    public async Task CreateBooking_OverlappingReservation_ReturnsBadRequest()
    {
        var targetDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7));
        var request = new
        {
            restaurantId = "r1",
            customerName = "Overlap User",
            partySize = 8,
            date = targetDate.ToString("yyyy-MM-dd"),
            startTime = "12:00",
            endTime = "13:00"
        };

        var firstResponse = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.Created, firstResponse.StatusCode);

        var secondResponse = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.BadRequest, secondResponse.StatusCode);
    }

    [Fact]
    public async Task GetBookings_ValidRestaurant_ReturnsList()
    {
        var response = await _client.GetAsync("/api/bookings?restaurantId=r1");

        response.EnsureSuccessStatusCode();
        var bookings = await response.Content.ReadFromJsonAsync<List<BookingDto>>();
        Assert.NotNull(bookings);
    }

    [Fact]
    public async Task GetBooking_NonExistingId_Returns404()
    {
        var response = await _client.GetAsync("/api/bookings/nonexistent");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_NonExistingRestaurant_ReturnsBadRequest()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var request = new
        {
            restaurantId = "nonexistent",
            customerName = "Test User",
            partySize = 2,
            date = tomorrow.ToString("yyyy-MM-dd"),
            startTime = "12:00",
            endTime = "13:00"
        };

        var response = await _client.PostAsJsonAsync("/api/bookings", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("RestaurantNotFound", body);
    }
}

public record RestaurantDto(string Id, string Name, string Address, string CuisineType, string OpeningTime, string ClosingTime);
public record AvailableSlotDto(object Slot, string TableId, string TableLocation, int TableSeats);
public record BookingDto(string Id, string RestaurantId, string TableId, string CustomerName, int PartySize, string Date, string StartTime, string EndTime, string CreatedAt);
