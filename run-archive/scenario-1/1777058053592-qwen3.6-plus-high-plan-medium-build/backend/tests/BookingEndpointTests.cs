using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Domain;
using Xunit;

namespace RestaurantBooking.Tests;

public class BookingEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public BookingEndpointTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetRestaurants_ReturnsRestaurants()
    {
        var response = await _client.GetAsync("/api/restaurants", CancellationToken.None);
        response.EnsureSuccessStatusCode();

        var restaurants = await response.Content.ReadFromJsonAsync<List<Restaurant>>(CancellationToken.None);
        Assert.NotNull(restaurants);
        Assert.NotEmpty(restaurants);
    }

    [Fact]
    public async Task CreateBooking_ValidRequest_Returns201()
    {
        var restaurants = await GetRestaurants();
        var restaurant = restaurants.First();

        var request = new BookingRequest(
            restaurant.Id,
            "John Doe",
            "john@test.com",
            2,
            DateTime.UtcNow.Date.AddDays(1).AddHours(12));

        var response = await _client.PostAsJsonAsync("/api/bookings", request, CancellationToken.None);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var booking = await response.Content.ReadFromJsonAsync<Booking>(CancellationToken.None);
        Assert.NotNull(booking);
        Assert.Equal(restaurant.Id, booking.RestaurantId);
    }

    [Fact]
    public async Task CreateBooking_UnknownRestaurant_Returns404()
    {
        var request = new BookingRequest(
            Guid.NewGuid(),
            "John Doe",
            "john@test.com",
            2,
            DateTime.UtcNow.Date.AddDays(1).AddHours(12));

        var response = await _client.PostAsJsonAsync("/api/bookings", request, CancellationToken.None);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_InvalidPartySize_Returns400()
    {
        var restaurants = await GetRestaurants();
        var restaurant = restaurants.First();

        var request = new BookingRequest(
            restaurant.Id,
            "John Doe",
            "john@test.com",
            0,
            DateTime.UtcNow.Date.AddDays(1).AddHours(12));

        var response = await _client.PostAsJsonAsync("/api/bookings", request, CancellationToken.None);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_PastDate_Returns400()
    {
        var restaurants = await GetRestaurants();
        var restaurant = restaurants.First();

        var request = new BookingRequest(
            restaurant.Id,
            "John Doe",
            "john@test.com",
            2,
            DateTime.UtcNow.AddHours(-5));

        var response = await _client.PostAsJsonAsync("/api/bookings", request, CancellationToken.None);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_Conflict_Returns409()
    {
        var restaurants = await GetRestaurants();
        var restaurant = restaurants.First();
        var slotTime = DateTime.UtcNow.Date.AddDays(1).AddHours(14);

        var firstRequest = new BookingRequest(
            restaurant.Id,
            "John Doe",
            "john@test.com",
            2,
            slotTime);

        var firstResponse = await _client.PostAsJsonAsync("/api/bookings", firstRequest, CancellationToken.None);
        firstResponse.EnsureSuccessStatusCode();

        var conflictRequest = new BookingRequest(
            restaurant.Id,
            "Jane Doe",
            "jane@test.com",
            2,
            slotTime);

        var conflictResponse = await _client.PostAsJsonAsync("/api/bookings", conflictRequest, CancellationToken.None);

        Assert.Equal(HttpStatusCode.Conflict, conflictResponse.StatusCode);
    }

    [Fact]
    public async Task GetAvailableSlots_ValidRequest_ReturnsSlots()
    {
        var restaurants = await GetRestaurants();
        var restaurant = restaurants.First();
        var date = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(1));

        var response = await _client.GetAsync($"/api/restaurants/{restaurant.Id}/slots?date={date:yyyy-MM-dd}&partySize=2", CancellationToken.None);
        response.EnsureSuccessStatusCode();

        var slots = await response.Content.ReadFromJsonAsync<List<TimeSlot>>(CancellationToken.None);
        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
    }

    [Fact]
    public async Task GetAvailableSlots_UnknownRestaurant_Returns404()
    {
        var date = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(1));
        var response = await _client.GetAsync($"/api/restaurants/{Guid.NewGuid()}/slots?date={date:yyyy-MM-dd}&partySize=2", CancellationToken.None);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetAvailableSlots_InvalidPartySize_Returns400()
    {
        var restaurants = await GetRestaurants();
        var restaurant = restaurants.First();
        var date = DateOnly.FromDateTime(DateTime.UtcNow.Date.AddDays(1));

        var response = await _client.GetAsync($"/api/restaurants/{restaurant.Id}/slots?date={date:yyyy-MM-dd}&partySize=0", CancellationToken.None);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ListBookings_ReturnsBookings()
    {
        var response = await _client.GetAsync("/api/bookings", CancellationToken.None);
        response.EnsureSuccessStatusCode();

        var bookings = await response.Content.ReadFromJsonAsync<List<Booking>>(CancellationToken.None);
        Assert.NotNull(bookings);
    }

    private async Task<List<Restaurant>> GetRestaurants()
    {
        var response = await _client.GetAsync("/api/restaurants", CancellationToken.None);
        response.EnsureSuccessStatusCode();
        var restaurants = await response.Content.ReadFromJsonAsync<List<Restaurant>>(CancellationToken.None);
        return restaurants!;
    }
}
