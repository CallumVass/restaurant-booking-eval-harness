using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class ApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ApiTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
        });
    }

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    [Fact]
    public async Task GetRestaurants_ReturnsOk()
    {
        var response = await _client.GetAsync("/api/restaurants");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("ember-table", body);
    }

    [Fact]
    public async Task GetAvailability_ReturnsOk()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);
        var response = await _client.GetAsync(
            $"/api/restaurants/ember-table/availability?date={tomorrow}&partySize=2");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetBookings_Unauthenticated_Returns401()
    {
        var response = await _client.GetAsync("/api/bookings");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_Unauthenticated_Returns401()
    {
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);
        var request = new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 2, "Guest", "g@example.com");
        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Register_WithValidData_ReturnsOk()
    {
        var email = $"test-{Guid.NewGuid():N}@example.com";
        var response = await _client.PostAsJsonAsync("/api/auth/register", new { Email = email, Password = "Password1!" });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains(email, body);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsOk()
    {
        var email = $"login-{Guid.NewGuid():N}@example.com";
        var password = "Password1!";

        await _client.PostAsJsonAsync("/api/auth/register", new { Email = email, Password = password });
        var response = await _client.PostAsJsonAsync("/api/auth/login", new { Email = email, Password = password });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorized()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login",
            new { Email = "nonexistent@example.com", Password = "WrongPassword1!" });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMe_Unauthenticated_Returns401()
    {
        var response = await _client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMe_Authenticated_ReturnsUserInfo()
    {
        var email = $"me-{Guid.NewGuid():N}@example.com";
        await _client.PostAsJsonAsync("/api/auth/register", new { Email = email, Password = "Password1!" });

        var response = await _client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains(email, body);
    }

    [Fact]
    public async Task CreateBooking_Authenticated_ReturnsCreated()
    {
        var email = $"booker-{Guid.NewGuid():N}@example.com";
        await _client.PostAsJsonAsync("/api/auth/register", new { Email = email, Password = "Password1!" });

        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);
        var request = new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 2, "Test Guest", email);

        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task GetBookings_Authenticated_ReturnsOnlyUserBookings()
    {
        var email1 = $"user1-{Guid.NewGuid():N}@example.com";
        var email2 = $"user2-{Guid.NewGuid():N}@example.com";

        await _client.PostAsJsonAsync("/api/auth/register", new { Email = email1, Password = "Password1!" });
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);

        var request1 = new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 2, "User One", email1);
        await _client.PostAsJsonAsync("/api/bookings", request1);

        var bookingsResponse = await _client.GetAsync("/api/bookings");
        var body = await bookingsResponse.Content.ReadAsStringAsync();
        Assert.Contains(email1, body);

        // Register as user2 - they should not see user1's bookings
        await _client.PostAsJsonAsync("/api/auth/register", new { Email = email2, Password = "Password1!" });
        var bookingsResponse2 = await _client.GetAsync("/api/bookings");
        var body2 = await bookingsResponse2.Content.ReadAsStringAsync();
        Assert.DoesNotContain(email1, body2);
    }

    [Fact]
    public async Task CreateBooking_InvalidPartySize_ReturnsBadRequest()
    {
        var email = $"party-{Guid.NewGuid():N}@example.com";
        await _client.PostAsJsonAsync("/api/auth/register", new { Email = email, Password = "Password1!" });

        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);
        var request = new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 0, "Guest", email);
        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_UnknownRestaurant_ReturnsNotFound()
    {
        var email = $"rest-{Guid.NewGuid():N}@example.com";
        await _client.PostAsJsonAsync("/api/auth/register", new { Email = email, Password = "Password1!" });

        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);
        var request = new CreateBookingRequest("nonexistent", tomorrow, new TimeOnly(17, 0), 2, "Guest", email);
        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_InvalidDate_ReturnsBadRequest()
    {
        var email = $"date-{Guid.NewGuid():N}@example.com";
        await _client.PostAsJsonAsync("/api/auth/register", new { Email = email, Password = "Password1!" });

        var yesterday = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(-1);
        var request = new CreateBookingRequest("ember-table", yesterday, new TimeOnly(17, 0), 2, "Guest", email);
        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_InvalidTime_ReturnsBadRequest()
    {
        var email = $"time-{Guid.NewGuid():N}@example.com";
        await _client.PostAsJsonAsync("/api/auth/register", new { Email = email, Password = "Password1!" });

        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);
        var request = new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(16, 30), 2, "Guest", email);
        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_ValidTime_ReturnsCreated()
    {
        var email = $"validtime-{Guid.NewGuid():N}@example.com";
        await _client.PostAsJsonAsync("/api/auth/register", new { Email = email, Password = "Password1!" });

        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);
        var request = new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 2, "Guest", email);
        var response = await _client.PostAsJsonAsync("/api/bookings", request);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task GetCsrfToken_ReturnsToken()
    {
        var response = await _client.GetAsync("/api/auth/csrf");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("token", body);
    }

    [Fact]
    public async Task Logout_ReturnsOk()
    {
        var email = $"logout-{Guid.NewGuid():N}@example.com";
        await _client.PostAsJsonAsync("/api/auth/register", new { Email = email, Password = "Password1!" });
        var response = await _client.PostAsJsonAsync("/api/auth/logout", new { });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
