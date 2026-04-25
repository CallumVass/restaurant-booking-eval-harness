// pattern: Imperative Shell

using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api.Domain;
using RestaurantBooking.Api.Features.Bookings;
using RestaurantBooking.Api.Features.Restaurants;
using RestaurantBooking.Api.Infrastructure;

namespace RestaurantBooking.Tests.Api;

public class BookingApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private readonly WebApplicationFactory<Program> _factory;

    public BookingApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task ListRestaurants_ReturnsSeededRestaurants()
    {
        var response = await _client.GetAsync("/api/restaurants");
        response.EnsureSuccessStatusCode();
        var restaurants = await response.Content.ReadFromJsonAsync<List<RestaurantDto>>();
        Assert.NotNull(restaurants);
        Assert.True(restaurants.Count >= 2);
    }

    [Fact]
    public async Task CreateBooking_WithInvalidPartySize_ReturnsBadRequest()
    {
        var restaurants = await GetRestaurantsAsync();
        var restaurant = restaurants.First();

        var request = new CreateBookingRequest(
            restaurant.Id,
            DateTime.UtcNow.Date.AddDays(1).AddHours(12),
            0,
            "Test",
            "test@example.com"
        );

        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_WithPastDate_ReturnsBadRequest()
    {
        var restaurants = await GetRestaurantsAsync();
        var restaurant = restaurants.First();

        var request = new CreateBookingRequest(
            restaurant.Id,
            DateTime.UtcNow.Date.AddDays(-1).AddHours(12),
            2,
            "Test",
            "test@example.com"
        );

        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_WithUnknownRestaurant_ReturnsBadRequest()
    {
        var request = new CreateBookingRequest(
            Guid.NewGuid(),
            DateTime.UtcNow.Date.AddDays(1).AddHours(12),
            2,
            "Test",
            "test@example.com"
        );

        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_WithOverlappingReservation_ReturnsConflict()
    {
        var restaurants = await GetRestaurantsAsync();
        var restaurant = restaurants.First();
        var slotTime = DateTime.UtcNow.Date.AddDays(1).AddHours(12);

        var request = new CreateBookingRequest(
            restaurant.Id, slotTime, 2, "First", "first@example.com"
        );

        var firstResponse = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.Created, firstResponse.StatusCode);

        // Same restaurant, same time, same party size should conflict if no other table
        var secondRequest = new CreateBookingRequest(
            restaurant.Id, slotTime, 2, "Second", "second@example.com"
        );
        var secondResponse = await _client.PostAsJsonAsync("/api/bookings", secondRequest);

        // If restaurant has multiple tables, this may succeed; we validate conflict logic elsewhere
        // but we test the conflict path by filling all tables
        if (secondResponse.StatusCode == HttpStatusCode.Created)
        {
            // Fill remaining tables
            while (true)
            {
                var resp = await _client.PostAsJsonAsync("/api/bookings", secondRequest with { CustomerName = Guid.NewGuid().ToString() });
                if (resp.StatusCode == HttpStatusCode.Conflict)
                    break;
                Assert.Equal(HttpStatusCode.Created, resp.StatusCode);
            }
        }
        else
        {
            Assert.Equal(HttpStatusCode.Conflict, secondResponse.StatusCode);
        }
    }

    [Fact]
    public async Task CreateBooking_Valid_ReturnsCreated()
    {
        var restaurants = await GetRestaurantsAsync();
        var restaurant = restaurants.First();
        var slotTime = DateTime.UtcNow.Date.AddDays(1).AddHours(12);

        var request = new CreateBookingRequest(
            restaurant.Id, slotTime, 2, "Valid", "valid@example.com"
        );

        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var booking = await response.Content.ReadFromJsonAsync<BookingDto>();
        Assert.NotNull(booking);
        Assert.Equal(restaurant.Id, booking.RestaurantId);
    }

    [Fact]
    public async Task ListBookings_ReturnsCreatedBookings()
    {
        var restaurants = await GetRestaurantsAsync();
        var restaurant = restaurants.First();
        var slotTime = DateTime.UtcNow.Date.AddDays(1).AddHours(14);

        var request = new CreateBookingRequest(
            restaurant.Id, slotTime, 2, "ListTest", "list@example.com"
        );

        var createResponse = await _client.PostAsJsonAsync("/api/bookings", request);
        createResponse.EnsureSuccessStatusCode();

        var listResponse = await _client.GetAsync("/api/bookings");
        listResponse.EnsureSuccessStatusCode();
        var bookings = await listResponse.Content.ReadFromJsonAsync<List<BookingDto>>();
        Assert.NotNull(bookings);
        Assert.Contains(bookings, b => b.CustomerName == "ListTest");
    }

    [Fact]
    public async Task GetAvailableSlots_ReturnsSlots()
    {
        var restaurants = await GetRestaurantsAsync();
        var restaurant = restaurants.First();
        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var response = await _client.GetAsync($"/api/restaurants/{restaurant.Id}/available-slots?date={date:yyyy-MM-dd}&partySize=2");
        response.EnsureSuccessStatusCode();
        var slots = await response.Content.ReadFromJsonAsync<List<AvailableSlotDto>>();
        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
    }

    private async Task<List<RestaurantDto>> GetRestaurantsAsync()
    {
        var response = await _client.GetAsync("/api/restaurants");
        response.EnsureSuccessStatusCode();
        var restaurants = await response.Content.ReadFromJsonAsync<List<RestaurantDto>>();
        Assert.NotNull(restaurants);
        return restaurants;
    }
}

public record AvailableSlotDto(DateTime StartTime, DateTime EndTime);
