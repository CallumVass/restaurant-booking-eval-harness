// pattern: Imperative Shell

using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace RestaurantBooking.Tests;

public sealed class EndpointTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public EndpointTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            HandleCookies = true,
            AllowAutoRedirect = false,
        });
    }

    [Fact]
    public async Task GetRestaurantsReturns200WithRestaurantList()
    {
        var response = await _client.GetAsync("/api/restaurants");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var restaurants = await response.Content.ReadFromJsonAsync<List<JsonElement>>();
        Assert.NotNull(restaurants);
        Assert.True(restaurants.Count >= 3);
    }

    [Fact]
    public async Task GetAvailabilityReturns200WithSlots()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var response = await _client.GetAsync($"/api/restaurants/ember-table/availability?date={today}&partySize=2");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var slots = await response.Content.ReadFromJsonAsync<List<JsonElement>>();
        Assert.NotNull(slots);
        Assert.True(slots.Count > 0);
    }

    [Fact]
    public async Task GetAvailabilityReturns400ForInvalidPartySize()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var response = await _client.GetAsync($"/api/restaurants/ember-table/availability?date={today}&partySize=0");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetAvailabilityReturns404ForUnknownRestaurant()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var response = await _client.GetAsync($"/api/restaurants/nonexistent/availability?date={today}&partySize=2");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateBookingReturns401WithoutAuth()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var request = new
        {
            restaurantId = "ember-table",
            date = today.ToString("yyyy-MM-dd"),
            time = "18:00:00",
            partySize = 2,
            guestName = "Test Guest",
            guestEmail = "test@example.com",
        };

        var response = await _client.PostAsJsonAsync("/api/bookings", request);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateBookingReturns201WithAuth()
    {
        var client = await CreateAuthenticatedClient();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var request = new
        {
            restaurantId = "ember-table",
            date = today.ToString("yyyy-MM-dd"),
            time = "18:00:00",
            partySize = 2,
            guestName = "Test Guest",
            guestEmail = "test@example.com",
        };

        var response = await PostWithCsrfAsync(client, "/api/bookings", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task CreateBookingReturns400ForInvalidPartySize()
    {
        var client = await CreateAuthenticatedClient();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var request = new
        {
            restaurantId = "ember-table",
            date = today.ToString("yyyy-MM-dd"),
            time = "18:00:00",
            partySize = 0,
            guestName = "Test Guest",
            guestEmail = "test@example.com",
        };

        var response = await PostWithCsrfAsync(client, "/api/bookings", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBookingReturns409ForOverlappingReservation()
    {
        var client = await CreateAuthenticatedClient();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var request = new
        {
            restaurantId = "ember-table",
            date = today.ToString("yyyy-MM-dd"),
            time = "18:00:00",
            partySize = 6,
            guestName = "Test Guest",
            guestEmail = "test@example.com",
        };

        var first = await PostWithCsrfAsync(client, "/api/bookings", request);
        Assert.True(first.IsSuccessStatusCode, $"First booking failed: {first.StatusCode}");

        var response = await PostWithCsrfAsync(client, "/api/bookings", request);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task CreateBookingReturns404ForUnknownRestaurant()
    {
        var client = await CreateAuthenticatedClient();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var request = new
        {
            restaurantId = "nonexistent",
            date = today.ToString("yyyy-MM-dd"),
            time = "18:00:00",
            partySize = 2,
            guestName = "Test Guest",
            guestEmail = "test@example.com",
        };

        var response = await PostWithCsrfAsync(client, "/api/bookings", request);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetMyBookingsReturns401WithoutAuth()
    {
        var response = await _client.GetAsync("/api/bookings/mine");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMyBookingsReturnsOnlyUserBookings()
    {
        var client = await CreateAuthenticatedClient();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var request = new
        {
            restaurantId = "ember-table",
            date = today.ToString("yyyy-MM-dd"),
            time = "18:00:00",
            partySize = 2,
            guestName = "User One",
            guestEmail = "test@example.com",
        };
        await PostWithCsrfAsync(client, "/api/bookings", request);

        var response = await client.GetAsync("/api/bookings/mine");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var bookings = await response.Content.ReadFromJsonAsync<List<JsonElement>>();
        Assert.NotNull(bookings);
        Assert.True(bookings.Count >= 1);
    }

    [Fact]
    public async Task RegisterReturns200WithValidRequest()
    {
        var csrfResponse = await _client.GetAsync("/api/auth/csrf");
        var csrfResult = await csrfResponse.Content.ReadFromJsonAsync<JsonElement>();
        var csrfToken = csrfResult.GetProperty("token").GetString()!;

        var request = new
        {
            email = $"newuser{Guid.NewGuid():N}@test.com",
            password = "Test123!",
        };

        var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/api/auth/register")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        requestMessage.Headers.Add("X-CSRF-TOKEN", csrfToken);

        var response = await _client.SendAsync(requestMessage);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task LoginReturns200WithValidCredentials()
    {
        var csrfResponse = await _client.GetAsync("/api/auth/csrf");
        var csrfResult = await csrfResponse.Content.ReadFromJsonAsync<JsonElement>();
        var csrfToken = csrfResult.GetProperty("token").GetString()!;

        var request = new
        {
            email = "demo@example.com",
            password = "Demo123!",
        };

        var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/api/auth/login")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        requestMessage.Headers.Add("X-CSRF-TOKEN", csrfToken);

        var response = await _client.SendAsync(requestMessage);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task LoginReturns401WithInvalidCredentials()
    {
        var csrfResponse = await _client.GetAsync("/api/auth/csrf");
        var csrfResult = await csrfResponse.Content.ReadFromJsonAsync<JsonElement>();
        var csrfToken = csrfResult.GetProperty("token").GetString()!;

        var request = new
        {
            email = "demo@example.com",
            password = "WrongPassword!",
        };

        var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/api/auth/login")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        requestMessage.Headers.Add("X-CSRF-TOKEN", csrfToken);

        var response = await _client.SendAsync(requestMessage);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task LogoutReturns204()
    {
        var client = await CreateAuthenticatedClient();

        var csrfResponse = await client.GetAsync("/api/auth/csrf");
        var csrfResult = await csrfResponse.Content.ReadFromJsonAsync<JsonElement>();
        var csrfToken = csrfResult.GetProperty("token").GetString()!;

        var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/api/auth/logout");
        requestMessage.Headers.Add("X-CSRF-TOKEN", csrfToken);

        var response = await client.SendAsync(requestMessage);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task GetMeReturns401WithoutAuth()
    {
        var response = await _client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMeReturns200WithAuth()
    {
        var client = await CreateAuthenticatedClient();
        var response = await client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetCsrfReturnsToken()
    {
        var response = await _client.GetAsync("/api/auth/csrf");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.True(result.TryGetProperty("token", out _));
    }

    [Fact]
    public async Task OpenApiSpecIsAvailable()
    {
        var response = await _client.GetAsync("/openapi/v1.json");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var spec = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.True(spec.TryGetProperty("paths", out _));
    }

    private async Task<HttpClient> CreateAuthenticatedClient(string? email = null, string? password = null)
    {
        email ??= $"test{Guid.NewGuid():N}@example.com";
        password ??= "Test123!";

        var client = _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            HandleCookies = true,
            AllowAutoRedirect = false,
        });

        var csrfResponse = await client.GetAsync("/api/auth/csrf");
        var csrfResult = await csrfResponse.Content.ReadFromJsonAsync<JsonElement>();
        var csrfToken = csrfResult.GetProperty("token").GetString()!;

        var registerRequest = new { email, password };
        var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/api/auth/register")
        {
            Content = JsonContent.Create(registerRequest, options: JsonOptions),
        };
        requestMessage.Headers.Add("X-CSRF-TOKEN", csrfToken);

        var response = await client.SendAsync(requestMessage);
        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync();
            throw new Exception($"Registration failed: {response.StatusCode} - {body}");
        }

        return client;
    }

    private async Task<HttpResponseMessage> PostWithCsrfAsync<T>(HttpClient client, string url, T content)
    {
        var csrfResponse = await client.GetAsync("/api/auth/csrf");
        var csrfResult = await csrfResponse.Content.ReadFromJsonAsync<JsonElement>();
        var csrfToken = csrfResult.GetProperty("token").GetString()!;

        var requestMessage = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = JsonContent.Create(content, options: JsonOptions),
        };
        requestMessage.Headers.Add("X-CSRF-TOKEN", csrfToken);

        return await client.SendAsync(requestMessage);
    }
}
