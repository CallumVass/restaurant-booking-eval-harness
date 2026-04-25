using System.Net;
using System.Net.Http.Json;
using Backend.Api;
using Backend.Data;
using Backend.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Backend.Tests;

public class ApiTests : IAsyncLifetime
{
    private IHost _host = null!;
    private HttpClient _client = null!;

    public async Task InitializeAsync()
    {
        _host = await new HostBuilder()
            .ConfigureWebHost(webBuilder =>
            {
                webBuilder
                    .UseTestServer()
                    .ConfigureServices(services =>
                    {
                        services.AddSingleton<InMemoryStore>();
                        services.AddRouting();
                    })
                    .Configure(app =>
                    {
                        app.UseRouting();
                        app.UseEndpoints(endpoints =>
                        {
                            endpoints.MapRestaurantsEndpoints();
                            endpoints.MapBookingsEndpoints();
                        });
                    });
            })
            .StartAsync();

        _client = _host.GetTestClient();
    }

    public Task DisposeAsync()
    {
        _host.Dispose();
        return Task.CompletedTask;
    }

    private InMemoryStore Store => _host.Services.GetRequiredService<InMemoryStore>();

    [Fact]
    public async Task GetRestaurants_ReturnsList()
    {
        var response = await _client.GetAsync("/api/restaurants");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var restaurants = await response.Content.ReadFromJsonAsync<List<Dictionary<string, object>>>();
        Assert.NotNull(restaurants);
        Assert.NotEmpty(restaurants);
    }

    [Fact]
    public async Task GetRestaurantById_UnknownId_ReturnsNotFound()
    {
        var response = await _client.GetAsync($"/api/restaurants/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetAvailableSlots_ValidRequest_ReturnsSlots()
    {
        var restaurant = Store.Restaurants.Values.First();
        var futureDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var response = await _client.GetAsync(
            $"/api/restaurants/{restaurant.Id}/slots?date={futureDate:yyyy-MM-dd}&partySize=2");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetAvailableSlots_InvalidPartySize_ReturnsBadRequest()
    {
        var restaurant = Store.Restaurants.Values.First();
        var futureDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var response = await _client.GetAsync(
            $"/api/restaurants/{restaurant.Id}/slots?date={futureDate:yyyy-MM-dd}&partySize=25");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_ValidRequest_ReturnsCreated()
    {
        var restaurant = Store.Restaurants.Values.First();
        var table = restaurant.Tables.First();
        var futureDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var request = new
        {
            restaurantId = restaurant.Id,
            tableId = table.Id,
            date = futureDate.ToString("yyyy-MM-dd"),
            startTime = "12:00",
            partySize = 2,
            guestName = "Alice",
        };

        var response = await _client.PostAsJsonAsync("/api/bookings", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_Overlapping_ReturnsBadRequest()
    {
        var restaurant = Store.Restaurants.Values.First();
        var table = restaurant.Tables.First();
        var futureDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var request = new
        {
            restaurantId = restaurant.Id,
            tableId = table.Id,
            date = futureDate.ToString("yyyy-MM-dd"),
            startTime = "12:00",
            partySize = 2,
            guestName = "Alice",
        };

        await _client.PostAsJsonAsync("/api/bookings", request);

        var response = await _client.PostAsJsonAsync("/api/bookings", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_UnknownRestaurant_ReturnsBadRequest()
    {
        var futureDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var request = new
        {
            restaurantId = Guid.NewGuid(),
            tableId = Guid.NewGuid(),
            date = futureDate.ToString("yyyy-MM-dd"),
            startTime = "12:00",
            partySize = 2,
            guestName = "Alice",
        };

        var response = await _client.PostAsJsonAsync("/api/bookings", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetBookings_ReturnsList()
    {
        var response = await _client.GetAsync("/api/bookings");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
