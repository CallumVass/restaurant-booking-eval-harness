using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace RestaurantBooking.Tests;

public class IntegrationTests
{
    private static WebApplicationFactory<Program> CreateFactory() =>
        new WebApplicationFactory<Program>();

    [Fact]
    public async Task GetRestaurants_Returns200_With3SeededRestaurants()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var response = await client.GetAsync("/restaurants");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var restaurants = await response.Content.ReadFromJsonAsync<List<RestaurantDto>>();
        Assert.NotNull(restaurants);
        Assert.Equal(3, restaurants.Count);
    }

    [Fact]
    public async Task GetRestaurants_EachRestaurantHasIdNameAndTables()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var response = await client.GetAsync("/restaurants");

        var restaurants = await response.Content.ReadFromJsonAsync<List<RestaurantDto>>();
        Assert.NotNull(restaurants);

        foreach (var r in restaurants!)
        {
            Assert.NotEqual(Guid.Empty, r.Id);
            Assert.False(string.IsNullOrWhiteSpace(r.Name));
            Assert.NotNull(r.Tables);
            Assert.NotEmpty(r.Tables);

            foreach (var t in r.Tables)
            {
                Assert.NotEqual(Guid.Empty, t.Id);
                Assert.True(t.Capacity > 0);
            }
        }
    }

    [Fact]
    public async Task GetSlots_ValidQuery_Returns200WithSlots()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var restaurants = await GetRestaurants(client);
        var restaurant = restaurants.First();

        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var response = await client.GetAsync($"/restaurants/{restaurant.Id}/slots?date={tomorrow:yyyy-MM-dd}&partySize=2");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var slots = await response.Content.ReadFromJsonAsync<List<string>>();
        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
    }

    [Fact]
    public async Task GetSlots_UnknownRestaurant_Returns404()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var response = await client.GetAsync($"/restaurants/{Guid.NewGuid()}/slots?date={tomorrow:yyyy-MM-dd}&partySize=2");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetSlots_InvalidPartySize_Returns400()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var restaurants = await GetRestaurants(client);
        var restaurant = restaurants.First();
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var response = await client.GetAsync($"/restaurants/{restaurant.Id}/slots?date={tomorrow:yyyy-MM-dd}&partySize=0");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetSlots_NegativePartySize_Returns400()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var restaurants = await GetRestaurants(client);
        var restaurant = restaurants.First();
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var response = await client.GetAsync($"/restaurants/{restaurant.Id}/slots?date={tomorrow:yyyy-MM-dd}&partySize=-1");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetSlots_LargePartySize_ReturnsEmptySlots()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var restaurants = await GetRestaurants(client);
        var restaurant = restaurants.First();
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var response = await client.GetAsync($"/restaurants/{restaurant.Id}/slots?date={tomorrow:yyyy-MM-dd}&partySize=100");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var slots = await response.Content.ReadFromJsonAsync<List<string>>();
        Assert.NotNull(slots);
        Assert.Empty(slots);
    }

    [Fact]
    public async Task CreateBooking_HappyPath_Returns201()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var restaurants = await GetRestaurants(client);
        var restaurant = restaurants.First();

        var futureTime = DateTimeOffset.UtcNow.AddDays(1).Date.Add(TimeSpan.FromHours(12));

        var request = new
        {
            restaurantId = restaurant.Id,
            dateTime = futureTime,
            partySize = 2,
            customerName = "John Doe",
            customerEmail = "john@test.com"
        };

        var response = await client.PostAsJsonAsync("/bookings", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var booking = await response.Content.ReadFromJsonAsync<BookingDto>();
        Assert.NotNull(booking);
        Assert.NotEqual(Guid.Empty, booking!.Id);
        Assert.Equal(restaurant.Id, booking.RestaurantId);
        Assert.Equal(2, booking.PartySize);
        Assert.Equal("John Doe", booking.CustomerName);
        Assert.Equal("john@test.com", booking.CustomerEmail);
        Assert.Equal(restaurant.Name, booking.RestaurantName);
    }

    [Fact]
    public async Task CreateBooking_InvalidPartySize_Returns400()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var restaurants = await GetRestaurants(client);
        var restaurant = restaurants.First();

        var futureTime = DateTimeOffset.UtcNow.AddDays(1).Date.Add(TimeSpan.FromHours(12));

        var request = new
        {
            restaurantId = restaurant.Id,
            dateTime = futureTime,
            partySize = 0,
            customerName = "John Doe",
            customerEmail = "john@test.com"
        };

        var response = await client.PostAsJsonAsync("/bookings", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_PastDateTime_Returns400()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var restaurants = await GetRestaurants(client);
        var restaurant = restaurants.First();

        var pastTime = DateTimeOffset.UtcNow.AddDays(-1);

        var request = new
        {
            restaurantId = restaurant.Id,
            dateTime = pastTime,
            partySize = 2,
            customerName = "John Doe",
            customerEmail = "john@test.com"
        };

        var response = await client.PostAsJsonAsync("/bookings", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_UnknownRestaurant_Returns404()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var futureTime = DateTimeOffset.UtcNow.AddDays(1).Date.Add(TimeSpan.FromHours(12));

        var request = new
        {
            restaurantId = Guid.NewGuid(),
            dateTime = futureTime,
            partySize = 2,
            customerName = "John Doe",
            customerEmail = "john@test.com"
        };

        var response = await client.PostAsJsonAsync("/bookings", request);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_MissingCustomerName_Returns400()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var restaurants = await GetRestaurants(client);
        var restaurant = restaurants.First();
        var futureTime = DateTimeOffset.UtcNow.AddDays(1).Date.Add(TimeSpan.FromHours(12));

        var request = new
        {
            restaurantId = restaurant.Id,
            dateTime = futureTime,
            partySize = 2,
            customerName = "",
            customerEmail = "john@test.com"
        };

        var response = await client.PostAsJsonAsync("/bookings", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_OverlappingBooking_Returns409()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var restaurants = await GetRestaurants(client);
        var restaurant = restaurants.First();
        var futureTime = DateTimeOffset.UtcNow.AddDays(1).Date.Add(TimeSpan.FromHours(12));

        var request = new
        {
            restaurantId = restaurant.Id,
            dateTime = futureTime,
            partySize = 6,
            customerName = "John Doe",
            customerEmail = "john@test.com"
        };

        var response1 = await client.PostAsJsonAsync("/bookings", request);
        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);

        var response2 = await client.PostAsJsonAsync("/bookings", request);
        Assert.Equal(HttpStatusCode.Conflict, response2.StatusCode);
    }

    [Fact]
    public async Task GetBookings_Returns200_WithEmptyListInitially()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var response = await client.GetAsync("/bookings");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var bookings = await response.Content.ReadFromJsonAsync<List<BookingDto>>();
        Assert.NotNull(bookings);
        Assert.Empty(bookings);
    }

    [Fact]
    public async Task GetBookings_AfterCreatingBooking_ReturnsIt()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var restaurants = await GetRestaurants(client);
        var restaurant = restaurants.First();

        var futureTime = DateTimeOffset.UtcNow.AddDays(1).Date.Add(TimeSpan.FromHours(12));

        var createRequest = new
        {
            restaurantId = restaurant.Id,
            dateTime = futureTime,
            partySize = 4,
            customerName = "Jane Doe",
            customerEmail = "jane@test.com"
        };

        var createResponse = await client.PostAsJsonAsync("/bookings", createRequest);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var getResponse = await client.GetAsync("/bookings");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        var bookings = await getResponse.Content.ReadFromJsonAsync<List<BookingDto>>();
        Assert.NotNull(bookings);
        var booking = Assert.Single(bookings!);
        Assert.Equal("Jane Doe", booking.CustomerName);
        Assert.Equal("jane@test.com", booking.CustomerEmail);
        Assert.Equal(4, booking.PartySize);
        Assert.Equal(restaurant.Name, booking.RestaurantName);
    }

    [Fact]
    public async Task GetSlots_PastDate_ReturnsEmptyOrFutureSlots()
    {
        await using var factory = CreateFactory();
        var client = factory.CreateClient();
        var restaurants = await GetRestaurants(client);
        var restaurant = restaurants.First();

        var yesterday = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1));
        var response = await client.GetAsync($"/restaurants/{restaurant.Id}/slots?date={yesterday:yyyy-MM-dd}&partySize=2");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var slots = await response.Content.ReadFromJsonAsync<List<string>>();
        Assert.NotNull(slots);
    }

    private static async Task<List<RestaurantDto>> GetRestaurants(HttpClient client)
    {
        var response = await client.GetAsync("/restaurants");
        var restaurants = await response.Content.ReadFromJsonAsync<List<RestaurantDto>>();
        return restaurants ?? [];
    }
}

public sealed record RestaurantDto(Guid Id, string Name, List<TableDto> Tables);
public sealed record TableDto(Guid Id, int Capacity);
public sealed record BookingDto(
    Guid Id,
    Guid RestaurantId,
    Guid TableId,
    DateTimeOffset DateTime,
    TimeSpan Duration,
    int PartySize,
    string CustomerName,
    string CustomerEmail,
    string RestaurantName);
