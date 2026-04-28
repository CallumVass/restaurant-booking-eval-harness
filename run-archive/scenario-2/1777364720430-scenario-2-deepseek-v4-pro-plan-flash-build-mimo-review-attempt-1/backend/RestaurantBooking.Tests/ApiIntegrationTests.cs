using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class ApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>>, IAsyncLifetime
{
    private readonly WebApplicationFactory<Program> factory;
    private IServiceScope? scope;
    private BookingStore? store;

    public ApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        this.factory = factory;
    }

    public async Task InitializeAsync()
    {
        // Create a fresh scope and reset the BookingStore between tests
        scope = factory.Services.CreateScope();
        store = scope.ServiceProvider.GetRequiredService<BookingStore>();
        store.Clear();
        await Task.CompletedTask;
    }

    public async Task DisposeAsync()
    {
        scope?.Dispose();
        await Task.CompletedTask;
    }

    private HttpClient CreateClient() => factory.CreateClient(new WebApplicationFactoryClientOptions
    {
        AllowAutoRedirect = false,
    });

    private async Task<(string Token, string HeaderName)> GetCsrfToken(HttpClient client)
    {
        var response = await client.GetAsync("/api/antiforgery/token");
        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        var token = body.GetProperty("token").GetString()!;
        var headerName = body.GetProperty("headerName").GetString()!;
        return (token, headerName);
    }

    private async Task<HttpClient> CreateAuthenticatedClient()
    {
        var client = CreateClient();
        var (csrfToken, csrfHeader) = await GetCsrfToken(client);
        var loginResponse = await client.PostAsync("/api/auth/login",
            new StringContent(
                JsonSerializer.Serialize(new { email = "demo@example.com", password = "Demo1234!" }),
                System.Text.Encoding.UTF8,
                "application/json")
            {
                Headers = { { csrfHeader, csrfToken } }
            });
        loginResponse.EnsureSuccessStatusCode();
        return client;
    }

    private async Task<HttpResponseMessage> PostWithCsrf(HttpClient client, string url, object body)
    {
        var (csrfToken, csrfHeader) = await GetCsrfToken(client);
        var content = new StringContent(
            JsonSerializer.Serialize(body),
            System.Text.Encoding.UTF8,
            "application/json")
        {
            Headers = { { csrfHeader, csrfToken } }
        };
        return await client.PostAsync(url, content);
    }

    // ── Existing behavior ──

    [Fact]
    public async Task GetRestaurants_Returns200WithThreeRestaurants()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/restaurants");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var restaurants = await response.Content.ReadFromJsonAsync<Restaurant[]>();
        Assert.Equal(3, restaurants!.Length);
    }

    [Fact]
    public async Task GetBookings_Returns200EmptyInitially()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/bookings");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var bookings = await response.Content.ReadFromJsonAsync<Booking[]>();
        Assert.Empty(bookings!);
    }

    [Fact]
    public async Task GetAvailability_WithValidParams_Returns200()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/restaurants/ember-table/availability?date=2026-05-01&partySize=2");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var slots = await response.Content.ReadFromJsonAsync<AvailabilitySlot[]>();
        Assert.NotEmpty(slots!);
    }

    [Fact]
    public async Task GetAvailability_UnknownRestaurant_Returns404()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/restaurants/unknown/availability?date=2026-05-01&partySize=2");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetAvailability_InvalidPartySize_Returns400()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/restaurants/ember-table/availability?date=2026-05-01&partySize=0");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetAvailability_PastDate_Returns400()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/restaurants/ember-table/availability?date=2020-01-01&partySize=2");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_WithValidData_Returns201()
    {
        var client = await CreateAuthenticatedClient();

        var response = await PostWithCsrf(client, "/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-05-02",
            time = "17:00:00",
            partySize = 2,
            guestName = "Test User",
            guestEmail = "test@example.com",
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var booking = await response.Content.ReadFromJsonAsync<Booking>();
        Assert.NotNull(booking);
        Assert.Equal("ember-table", booking!.RestaurantId);
    }

    [Fact]
    public async Task CreateBooking_InvalidPartySize_Returns400()
    {
        var client = await CreateAuthenticatedClient();

        var response = await PostWithCsrf(client, "/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-05-02",
            time = "17:00:00",
            partySize = 0,
            guestName = "Test User",
            guestEmail = "test@example.com",
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_InvalidTime_Returns400()
    {
        var client = await CreateAuthenticatedClient();

        var response = await PostWithCsrf(client, "/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-05-02",
            time = "16:30:00",
            partySize = 2,
            guestName = "Test User",
            guestEmail = "test@example.com",
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_UnknownRestaurant_Returns404()
    {
        var client = await CreateAuthenticatedClient();

        var response = await PostWithCsrf(client, "/api/bookings", new
        {
            restaurantId = "unknown",
            date = "2026-05-02",
            time = "17:00:00",
            partySize = 2,
            guestName = "Test User",
            guestEmail = "test@example.com",
        });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_OverlappingReservation_Returns409()
    {
        var client = await CreateAuthenticatedClient();

        // First booking occupies ember-6 for party of 6 at 17:00
        var response1 = await PostWithCsrf(client, "/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-05-03",
            time = "17:00:00",
            partySize = 6,
            guestName = "User A",
            guestEmail = "a@example.com",
        });
        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);

        // Second 6-person booking at same time overlaps (only one 6-seat table)
        var response2 = await PostWithCsrf(client, "/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-05-03",
            time = "17:00:00",
            partySize = 6,
            guestName = "User B",
            guestEmail = "b@example.com",
        });

        Assert.Equal(HttpStatusCode.Conflict, response2.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_AdjacentNonOverlapping_Succeeds()
    {
        var client = await CreateAuthenticatedClient();

        // Book 17:00-19:00
        var response1 = await PostWithCsrf(client, "/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-05-04",
            time = "17:00:00",
            partySize = 2,
            guestName = "User A",
            guestEmail = "a@example.com",
        });
        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);

        // Book 19:00-21:00 (adjacent, non-overlapping)
        var response2 = await PostWithCsrf(client, "/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-05-04",
            time = "19:00:00",
            partySize = 2,
            guestName = "User B",
            guestEmail = "b@example.com",
        });

        Assert.Equal(HttpStatusCode.Created, response2.StatusCode);
    }

    [Fact]
    public async Task GetBookings_ShowsCreatedBooking()
    {
        var client = await CreateAuthenticatedClient();

        await PostWithCsrf(client, "/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-05-05",
            time = "17:00:00",
            partySize = 2,
            guestName = "Test User",
            guestEmail = "test@example.com",
        });

        var response = await client.GetAsync("/api/bookings");
        var bookings = await response.Content.ReadFromJsonAsync<Booking[]>();
        Assert.Contains(bookings!, b => b.GuestName == "Test User");
    }

    [Fact]
    public async Task OpenApiEndpoint_ReturnsValidJson()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/openapi/v1.json");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var doc = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.True(doc.TryGetProperty("paths", out _));
    }

    // ── Auth behavior ──

    [Fact]
    public async Task CreateBooking_WithoutAuth_Returns401()
    {
        var client = CreateClient();
        var response = await client.PostAsync("/api/bookings",
            new StringContent("{}", System.Text.Encoding.UTF8, "application/json"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMyBookings_WithoutAuth_Returns401()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/bookings/mine");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMyBookings_WithAuth_ReturnsUserBookingsOnly()
    {
        var client = await CreateAuthenticatedClient();

        await PostWithCsrf(client, "/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-05-06",
            time = "17:00:00",
            partySize = 2,
            guestName = "Demo User",
            guestEmail = "demo@example.com",
        });

        var response = await client.GetAsync("/api/bookings/mine");
        var myBookings = await response.Content.ReadFromJsonAsync<Booking[]>();
        Assert.NotEmpty(myBookings!);
        Assert.All(myBookings!, b => Assert.Equal("Demo User", b.GuestName));
    }

    [Fact]
    public async Task TwoUsers_CannotSeeEachOthersBookings()
    {
        // Demo user creates a booking
        var client1 = await CreateAuthenticatedClient();
        await PostWithCsrf(client1, "/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-05-07",
            time = "17:00:00",
            partySize = 2,
            guestName = "Demo User",
            guestEmail = "demo@example.com",
        });

        // Guest user logs in
        var client2 = CreateClient();
        var (csrfToken2, csrfHeader2) = await GetCsrfToken(client2);
        var loginResponse = await client2.PostAsync("/api/auth/login",
            new StringContent(
                JsonSerializer.Serialize(new { email = "guest@example.com", password = "Guest1234!" }),
                System.Text.Encoding.UTF8,
                "application/json")
            {
                Headers = { { csrfHeader2, csrfToken2 } }
            });
        loginResponse.EnsureSuccessStatusCode();

        var guestBookings = await client2.GetAsync("/api/bookings/mine");
        var bookings = await guestBookings.Content.ReadFromJsonAsync<Booking[]>();
        Assert.Empty(bookings!);
    }

    [Fact]
    public async Task GetMyBookings_Empty_ForUserWithNoBookings()
    {
        var client = CreateClient();
        var (csrfToken, csrfHeader) = await GetCsrfToken(client);
        var loginResponse = await client.PostAsync("/api/auth/login",
            new StringContent(
                JsonSerializer.Serialize(new { email = "guest@example.com", password = "Guest1234!" }),
                System.Text.Encoding.UTF8,
                "application/json")
            {
                Headers = { { csrfHeader, csrfToken } }
            });
        loginResponse.EnsureSuccessStatusCode();

        var response = await client.GetAsync("/api/bookings/mine");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var bookings = await response.Content.ReadFromJsonAsync<Booking[]>();
        Assert.Empty(bookings!);
    }

    [Fact]
    public async Task Login_WithValidCredentials_Returns200()
    {
        var client = CreateClient();
        var (csrfToken, csrfHeader) = await GetCsrfToken(client);

        var response = await client.PostAsync("/api/auth/login",
            new StringContent(
                JsonSerializer.Serialize(new { email = "demo@example.com", password = "Demo1234!" }),
                System.Text.Encoding.UTF8,
                "application/json")
            {
                Headers = { { csrfHeader, csrfToken } }
            });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var userInfo = await response.Content.ReadFromJsonAsync<UserInfo>();
        Assert.NotNull(userInfo);
        Assert.Equal("demo@example.com", userInfo!.Email);
    }

    [Fact]
    public async Task Login_WithInvalidPassword_Returns401()
    {
        var client = CreateClient();
        var (csrfToken, csrfHeader) = await GetCsrfToken(client);

        var response = await client.PostAsync("/api/auth/login",
            new StringContent(
                JsonSerializer.Serialize(new { email = "demo@example.com", password = "wrongpassword" }),
                System.Text.Encoding.UTF8,
                "application/json")
            {
                Headers = { { csrfHeader, csrfToken } }
            });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Register_CreatesUserAndReturns201()
    {
        var client = CreateClient();
        var (csrfToken, csrfHeader) = await GetCsrfToken(client);
        var uniqueEmail = $"newuser_{Guid.NewGuid():N}@example.com";

        var response = await client.PostAsync("/api/auth/register",
            new StringContent(
                JsonSerializer.Serialize(new { email = uniqueEmail, password = "Password123!" }),
                System.Text.Encoding.UTF8,
                "application/json")
            {
                Headers = { { csrfHeader, csrfToken } }
            });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task Me_WithoutAuth_Returns401()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Me_WithAuth_ReturnsUserInfo()
    {
        var client = await CreateAuthenticatedClient();
        var response = await client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var userInfo = await response.Content.ReadFromJsonAsync<UserInfo>();
        Assert.NotNull(userInfo);
        Assert.Equal("demo@example.com", userInfo!.Email);
    }

    [Fact]
    public async Task Logout_ClearsSession()
    {
        var client = await CreateAuthenticatedClient();

        var (csrfToken, csrfHeader) = await GetCsrfToken(client);
        var logoutResponse = await client.PostAsync("/api/auth/logout",
            new StringContent("{}", System.Text.Encoding.UTF8, "application/json")
            {
                Headers = { { csrfHeader, csrfToken } }
            });
        Assert.Equal(HttpStatusCode.OK, logoutResponse.StatusCode);

        var meResponse = await client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.Unauthorized, meResponse.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_StoresUserId()
    {
        var client = await CreateAuthenticatedClient();

        var response = await PostWithCsrf(client, "/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-05-08",
            time = "17:00:00",
            partySize = 2,
            guestName = "Auth User",
            guestEmail = "auth@example.com",
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var booking = await response.Content.ReadFromJsonAsync<Booking>();
        Assert.NotNull(booking);
        Assert.NotNull(booking!.UserId);
    }
}
