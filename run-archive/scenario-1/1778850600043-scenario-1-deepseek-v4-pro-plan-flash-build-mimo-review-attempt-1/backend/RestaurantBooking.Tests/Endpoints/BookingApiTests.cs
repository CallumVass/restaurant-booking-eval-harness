using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api.Dtos;

namespace RestaurantBooking.Tests.Endpoints;

public class BookingApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public BookingApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetRestaurants_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/restaurants");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var restaurants = await response.Content.ReadFromJsonAsync<List<RestaurantResponse>>();
        Assert.NotNull(restaurants);
        Assert.NotEmpty(restaurants);
    }

    [Fact]
    public async Task GetRestaurantById_Existing_ReturnsOk()
    {
        var response = await _client.GetAsync($"/api/restaurants/{KnownIds.ItalianRestaurantId}");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var restaurant = await response.Content.ReadFromJsonAsync<RestaurantResponse>();
        Assert.NotNull(restaurant);
        Assert.Equal("La Trattoria", restaurant.Name);
    }

    [Fact]
    public async Task GetRestaurantById_NotFound_Returns404()
    {
        var response = await _client.GetAsync($"/api/restaurants/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetAvailableSlots_ValidRequest_ReturnsOk()
    {
        var response = await _client.GetAsync(
            $"/api/restaurants/{KnownIds.ItalianRestaurantId}/slots?date={FutureDateString()}&partySize=2");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var slots = await response.Content.ReadFromJsonAsync<List<AvailableSlotResponse>>();
        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
    }

    [Fact]
    public async Task GetAvailableSlots_InvalidPartySize_ReturnsBadRequest()
    {
        var response = await _client.GetAsync(
            $"/api/restaurants/{KnownIds.ItalianRestaurantId}/slots?date={FutureDateString()}&partySize=0");
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetAvailableSlots_UnknownRestaurant_ReturnsNotFound()
    {
        var response = await _client.GetAsync(
            $"/api/restaurants/{Guid.NewGuid()}/slots?date={FutureDateString()}&partySize=2");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_ValidRequest_ReturnsCreated()
    {
        var request = new CreateBookingRequest(
            KnownIds.ItalianRestaurantId,
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(2)),
            new TimeOnly(12, 0),
            2,
            "Jane Doe",
            "jane@example.com",
            null);

        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_OverlappingSlots_ReturnsConflict()
    {
        var baseDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(3));

        // Book the 6-person table (only one exists at La Trattoria)
        var request = new CreateBookingRequest(
            KnownIds.ItalianRestaurantId,
            baseDate,
            new TimeOnly(12, 0),
            6,
            "First",
            "first@example.com",
            null);

        var firstResponse = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.Created, firstResponse.StatusCode);

        // Same time with same party size should conflict (no other 6-person table)
        var secondRequest = request with { CustomerName = "Second", CustomerEmail = "second@example.com" };
        var secondResponse = await _client.PostAsJsonAsync("/api/bookings", secondRequest);
        Assert.Equal(HttpStatusCode.Conflict, secondResponse.StatusCode);
    }

    [Fact]
    public async Task GetBookings_ByEmail_ReturnsMatching()
    {
        var email = "findme@example.com";
        var request = new CreateBookingRequest(
            KnownIds.ItalianRestaurantId,
            DateOnly.FromDateTime(DateTime.UtcNow.AddDays(4)),
            new TimeOnly(13, 0),
            2,
            "Find Me",
            email,
            null);

        await _client.PostAsJsonAsync("/api/bookings", request);

        var response = await _client.GetAsync($"/api/bookings?email={email}");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var bookings = await response.Content.ReadFromJsonAsync<List<BookingResponse>>();
        Assert.NotNull(bookings);
        Assert.NotEmpty(bookings);
        Assert.All(bookings, b => Assert.Equal(email, b.CustomerEmail));
    }

    private static string FutureDateString() =>
        DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)).ToString("yyyy-MM-dd");
}

internal static class KnownIds
{
    public static readonly Guid ItalianRestaurantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
}
