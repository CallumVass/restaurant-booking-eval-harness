// pattern: Imperative Shell

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace RestaurantBooking.Tests;

public sealed class ApiEndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> factory;

    public ApiEndpointTests(WebApplicationFactory<Program> factory)
    {
        this.factory = factory;
    }

    [Fact]
    public async Task GetRestaurants_ReturnsRestaurants()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/api/restaurants");

        response.EnsureSuccessStatusCode();
        var restaurants = await response.Content.ReadFromJsonAsync<List<RestaurantDto>>();
        Assert.NotNull(restaurants);
        Assert.Equal(3, restaurants.Count);
    }

    [Fact]
    public async Task GetBookings_ReturnsBookings()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/api/bookings");

        response.EnsureSuccessStatusCode();
        var bookings = await response.Content.ReadFromJsonAsync<List<BookingDto>>();
        Assert.NotNull(bookings);
    }

    [Fact]
    public async Task UnauthenticatedPostBooking_Returns401()
    {
        var client = CreateClient();

        var request = new
        {
            restaurantId = "ember-table",
            date = "2026-05-01",
            time = "18:00:00",
            partySize = 2,
            guestName = "Test User",
            guestEmail = "test@example.com",
        };

        var response = await client.PostAsJsonAsync("/api/bookings", request,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetCsrfToken_ReturnsToken()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/api/auth/csrf-token");

        response.EnsureSuccessStatusCode();
        var tokenResponse = await response.Content.ReadFromJsonAsync<CsrfTokenResponse>();
        Assert.NotNull(tokenResponse);
        Assert.NotNull(tokenResponse.Token);
    }

    [Fact]
    public async Task GetMeUnauthenticated_ReturnsNull()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/api/auth/me");

        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.True(string.IsNullOrEmpty(content) || content.Trim() == "null");
    }

    [Fact]
    public async Task RegisterCreatesUser()
    {
        var client = CreateClient();

        var request = new
        {
            email = "newuser@example.com",
            password = "NewUser123!",
            displayName = "New User",
        };

        var response = await client.PostAsJsonAsync("/api/auth/register", request,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

        response.EnsureSuccessStatusCode();
        var userInfo = await response.Content.ReadFromJsonAsync<UserInfoDto>();
        Assert.NotNull(userInfo);
        Assert.Equal("newuser@example.com", userInfo.Email);
    }

    [Fact]
    public async Task OpenApiEndpoint_ServesValidSpec()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/openapi/v1.json");

        response.EnsureSuccessStatusCode();
        var spec = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.True(spec.TryGetProperty("paths", out _));
        Assert.True(spec.TryGetProperty("components", out _));

        var paths = spec.GetProperty("paths");
        Assert.True(paths.TryGetProperty("/api/auth/register", out _));
        Assert.True(paths.TryGetProperty("/api/auth/login", out _));
        Assert.True(paths.TryGetProperty("/api/auth/logout", out _));
        Assert.True(paths.TryGetProperty("/api/auth/me", out _));
        Assert.True(paths.TryGetProperty("/api/users/me/bookings", out _));
    }

    [Fact]
    public async Task GetAvailability_ReturnsSlots()
    {
        var client = CreateClient();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var response = await client.GetAsync($"/api/restaurants/ember-table/availability?date={today:yyyy-MM-dd}&partySize=2");

        response.EnsureSuccessStatusCode();
        var slots = await response.Content.ReadFromJsonAsync<List<AvailabilitySlotDto>>();
        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
    }

    [Fact]
    public async Task GetAvailabilityUnknownRestaurant_Returns404()
    {
        var client = CreateClient();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var response = await client.GetAsync($"/api/restaurants/nonexistent/availability?date={today:yyyy-MM-dd}&partySize=2");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponseDto>();
        Assert.NotNull(error);
        Assert.Equal("UnknownRestaurant", error.Code);
    }

    [Fact]
    public async Task GetAvailabilityInvalidPartySize_Returns400()
    {
        var client = CreateClient();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var response = await client.GetAsync($"/api/restaurants/ember-table/availability?date={today:yyyy-MM-dd}&partySize=0");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponseDto>();
        Assert.NotNull(error);
        Assert.Equal("InvalidPartySize", error.Code);
    }

    [Fact]
    public async Task GetMyBookingsUnauthenticated_Returns401()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/api/users/me/bookings");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task LoginWithInvalidCredentials_Returns401()
    {
        var client = CreateClient();

        var request = new
        {
            email = "nonexistent@example.com",
            password = "WrongPass123!",
        };

        var response = await client.PostAsJsonAsync("/api/auth/login", request,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private HttpClient CreateClient()
    {
        return factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            HandleCookies = true,
        });
    }

    private sealed record RestaurantDto(string Id, string Name, string Cuisine, string Neighborhood, string Description, List<TableDto> Tables);
    private sealed record TableDto(string Id, int Capacity);
    private sealed record BookingDto(string Id, string RestaurantId, string RestaurantName, string TableId, int PartySize, string Date, string Time, string GuestName, string GuestEmail);
    private sealed record AvailabilitySlotDto(string Time, int AvailableTableCount);
    private sealed record UserInfoDto(string Id, string Email, string? DisplayName);
    private sealed record CsrfTokenResponse(string Token);
    private sealed record ErrorResponseDto(string Code, string Message);
}
