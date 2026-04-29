using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class HttpIntegrationTests
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) },
    };

    private static readonly DateOnly Today = DateOnly.FromDateTime(DateTime.UtcNow);
    private static readonly string TomorrowString = Today.AddDays(1).ToString("yyyy-MM-dd");
    private static readonly string PastDateString = Today.AddDays(-1).ToString("yyyy-MM-dd");

    private static HttpClient CreateClient()
    {
        var dbName = $"HttpTestDb_{Guid.NewGuid():N}";
        var factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor is not null)
                    services.Remove(descriptor);
                services.AddDbContext<AppDbContext>(opts =>
                    opts.UseInMemoryDatabase(dbName));
            });
        });
        return factory.CreateClient();
    }

    [Fact]
    public async Task ListRestaurants_Returns200WithThreeRestaurants()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/restaurants");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var restaurants = await response.Content.ReadFromJsonAsync<Restaurant[]>(JsonOptions);
        Assert.NotNull(restaurants);
        Assert.Equal(3, restaurants.Length);
        Assert.Contains(restaurants, r => r.Id == "ember-table" && r.Name == "Ember Table");
        Assert.Contains(restaurants, r => r.Id == "luna-verde" && r.Name == "Luna Verde");
        Assert.Contains(restaurants, r => r.Id == "saffron-court" && r.Name == "Saffron Court");
        foreach (var restaurant in restaurants)
        {
            Assert.NotEmpty(restaurant.Id);
            Assert.NotEmpty(restaurant.Name);
            Assert.NotEmpty(restaurant.Tables);
        }
    }

    [Fact]
    public async Task AvailableSlots_WithValidParams_Returns200()
    {
        var client = CreateClient();
        var response = await client.GetAsync(
            $"/api/restaurants/ember-table/availability?date={TomorrowString}&partySize=2");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var slots = await response.Content.ReadFromJsonAsync<AvailabilitySlot[]>(JsonOptions);
        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
    }

    [Fact]
    public async Task AvailableSlots_UnknownRestaurant_Returns404()
    {
        var client = CreateClient();
        var response = await client.GetAsync(
            $"/api/restaurants/non-existent/availability?date={TomorrowString}&partySize=2");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);

        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("UnknownRestaurant", error.Code);
        Assert.NotEmpty(error.Message);
    }

    [Fact]
    public async Task AvailableSlots_InvalidPartySize_Returns400()
    {
        var client = CreateClient();
        var response = await client.GetAsync(
            $"/api/restaurants/ember-table/availability?date={TomorrowString}&partySize=0");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("InvalidPartySize", error.Code);
        Assert.NotEmpty(error.Message);
    }

    [Fact]
    public async Task AvailableSlots_PastDate_Returns400()
    {
        var client = CreateClient();
        var response = await client.GetAsync(
            $"/api/restaurants/ember-table/availability?date={PastDateString}&partySize=2");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("InvalidDate", error.Code);
        Assert.NotEmpty(error.Message);
    }

    [Fact]
    public async Task AvailableSlots_PartyExceedsCapacity_Returns400()
    {
        var client = CreateClient();
        var response = await client.GetAsync(
            $"/api/restaurants/ember-table/availability?date={TomorrowString}&partySize=7");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("NoTableForPartySize", error.Code);
        Assert.NotEmpty(error.Message);
    }

    [Fact]
    public async Task AvailableSlots_ReturnsCorrectTableCount()
    {
        var client = CreateClient();
        var response = await client.GetAsync(
            $"/api/restaurants/ember-table/availability?date={TomorrowString}&partySize=2");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var slots = await response.Content.ReadFromJsonAsync<AvailabilitySlot[]>(JsonOptions);
        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
        foreach (var slot in slots)
        {
            Assert.True(slot.AvailableTableCount > 0,
                $"Slot {slot.Time} should have at least one available table");
            Assert.True(slot.AvailableTableCount <= 4,
                $"Slot {slot.Time} should have at most 4 tables for party size 2 at Ember Table");
        }
    }

    [Fact]
    public async Task OpenApiDocument_Available_ContainsExpectedPaths()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/openapi/v1.json");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var doc = await response.Content.ReadFromJsonAsync<JsonDocument>();
        Assert.NotNull(doc);

        var paths = doc.RootElement.GetProperty("paths");
        Assert.True(paths.TryGetProperty("/api/restaurants", out _), "Expected /api/restaurants path");
        Assert.True(paths.TryGetProperty("/api/auth/me", out _), "Expected /api/auth/me path");
        Assert.True(paths.TryGetProperty("/api/bookings/mine", out _), "Expected /api/bookings/mine path");
        Assert.True(
            paths.TryGetProperty("/api/restaurants/{restaurantId}/availability", out _),
            "Expected /api/restaurants/{restaurantId}/availability path");
    }

    [Fact]
    public async Task Restaurants_Public_Returns200WithoutAuth()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/restaurants");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Availability_Public_Returns200WithoutAuth()
    {
        var client = CreateClient();
        var response = await client.GetAsync(
            $"/api/restaurants/ember-table/availability?date={TomorrowString}&partySize=2");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
