// pattern: Mixed (unavoidable - test file)

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace RestaurantBooking.Tests.Integration;

public class BookingApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private static int _testCounter;

    public BookingApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    private TimeOnly NextTime() => new TimeOnly(11, 30).AddMinutes(30 * Interlocked.Increment(ref _testCounter));

    [Fact]
    public async Task ListRestaurants_ReturnsSeedData()
    {
        var response = await _client.GetAsync("/api/restaurants");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();
        var restaurants = JsonSerializer.Deserialize<List<JsonElement>>(json);
        Assert.NotNull(restaurants);
        Assert.Equal(3, restaurants.Count);
    }

    [Fact]
    public async Task CreateBooking_ValidRequest_ReturnsCreated()
    {
        var restaurantId = await GetFirstRestaurantId();
        var time = NextTime();

        var request = MakeRequest(restaurantId, time, 2);
        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();
        var booking = JsonSerializer.Deserialize<JsonElement>(json);
        Assert.Equal(2, booking.GetProperty("partySize").GetInt32());
    }

    [Fact]
    public async Task CreateBooking_UnknownRestaurant_ReturnsNotFound()
    {
        var request = MakeRequest(Guid.NewGuid(), NextTime(), 2);
        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_InvalidPartySize_ReturnsBadRequest()
    {
        var restaurantId = await GetFirstRestaurantId();
        var request = MakeRequest(restaurantId, NextTime(), 0);
        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_PastDate_ReturnsBadRequest()
    {
        var restaurantId = await GetFirstRestaurantId();
        var request = new
        {
            RestaurantId = restaurantId.ToString(),
            Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1)).ToString("yyyy-MM-dd"),
            Time = "12:00",
            PartySize = 2,
            GuestName = "John",
            GuestEmail = "john@test.com"
        };
        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_OverlappingReservation_ReturnsConflict()
    {
        var restaurantId = await GetFirstRestaurantId();
        var time = NextTime();

        var request = MakeRequest(restaurantId, time, 2);
        var response1 = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);

        var request2 = MakeRequest(restaurantId, time, 2, "Jane", "jane@test.com");
        var response2 = await _client.PostAsJsonAsync("/api/bookings", request2);
        Assert.Equal(HttpStatusCode.Conflict, response2.StatusCode);
    }

    [Fact]
    public async Task GetAvailability_ValidRequest_ReturnsSlots()
    {
        var restaurantId = await GetFirstRestaurantId();

        var date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var response = await _client.GetAsync(
            $"/api/restaurants/{restaurantId}/availability?date={date:yyyy-MM-dd}&partySize=2");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetAvailability_UnknownRestaurant_ReturnsNotFound()
    {
        var response = await _client.GetAsync(
            $"/api/restaurants/{Guid.NewGuid()}/availability?date=2026-05-01&partySize=2");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    private object MakeRequest(Guid restaurantId, TimeOnly time, int partySize,
        string name = "John", string email = "john@test.com") => new
        {
            RestaurantId = restaurantId.ToString(),
            Date = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)).ToString("yyyy-MM-dd"),
            Time = time.ToString("HH:mm:ss"),
            PartySize = partySize,
            GuestName = name,
            GuestEmail = email
        };

    private async Task<Guid> GetFirstRestaurantId()
    {
        var response = await _client.GetAsync("/api/restaurants");
        var json = await response.Content.ReadAsStringAsync();
        var restaurants = JsonSerializer.Deserialize<List<JsonElement>>(json);
        return restaurants![0].GetProperty("id").GetGuid();
    }
}
