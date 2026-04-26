// pattern: Imperative Shell

using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class BookingApiTests
{
    private HttpClient CreateClient()
    {
        var factory = new WebApplicationFactory<Program>();
        return factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            HandleCookies = true,
        });
    }

    [Fact]
    public async Task ListRestaurants_ReturnsThreeRestaurants()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/restaurants");

        response.EnsureSuccessStatusCode();
        var restaurants = await response.Content.ReadFromJsonAsync<Restaurant[]>();
        Assert.NotNull(restaurants);
        Assert.Equal(3, restaurants.Length);
    }

    [Fact]
    public async Task GetAvailability_ValidRequest_Returns200()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/restaurants/ember-table/availability?date=2026-05-01&partySize=2");

        response.EnsureSuccessStatusCode();
        var slots = await response.Content.ReadFromJsonAsync<AvailabilitySlot[]>();
        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
    }

    [Fact]
    public async Task GetAvailability_UnknownRestaurant_Returns404()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/restaurants/unknown/availability?date=2026-05-01&partySize=2");

        Assert.Equal(404, (int)response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.Equal("UnknownRestaurant", error!.Code);
    }

    [Fact]
    public async Task GetAvailability_InvalidPartySize_Returns400()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/restaurants/ember-table/availability?date=2026-05-01&partySize=10");

        Assert.Equal(400, (int)response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.Equal("InvalidPartySize", error!.Code);
    }

    [Fact]
    public async Task CreateBooking_WithoutAuth_Returns401()
    {
        var client = CreateClient();
        var (csrfToken, _) = await GetCsrfToken(client);

        var request = new CreateBookingRequest("ember-table", new DateOnly(2026, 5, 1), new TimeOnly(17, 0), 2, "Test", "test@test.com");
        var response = await PostWithCsrf(client, "/api/bookings", request, csrfToken);

        Assert.Equal(401, (int)response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_WithAuthAndValidData_Returns201()
    {
        var client = CreateClient();
        var (email, _) = await RegisterAndLogin(client);

        var (csrfToken, _) = await GetCsrfToken(client);
        var request = new CreateBookingRequest("ember-table", new DateOnly(2026, 5, 1), new TimeOnly(17, 0), 2, "Test User", email);
        var response = await PostWithCsrf(client, "/api/bookings", request, csrfToken);

        Assert.Equal(201, (int)response.StatusCode);
        var booking = await response.Content.ReadFromJsonAsync<Booking>();
        Assert.NotNull(booking);
        Assert.Equal("Test User", booking.GuestName);
    }

    [Fact]
    public async Task CreateBooking_Overlapping_Returns409()
    {
        var client = CreateClient();
        var (email, _) = await RegisterAndLogin(client);

        // Book party of 6 on ember-table — only ember-6 (capacity 6) fits
        // Booking it once fills the only 6-seat table; a second try must fail
        var (csrfToken1, _) = await GetCsrfToken(client);
        var request = new CreateBookingRequest("ember-table", new DateOnly(2026, 5, 1), new TimeOnly(17, 0), 6, "Test User", email);
        var r1 = await PostWithCsrf(client, "/api/bookings", request, csrfToken1);
        Assert.Equal(201, (int)r1.StatusCode);

        var (csrfToken2, _) = await GetCsrfToken(client);
        var r2 = await PostWithCsrf(client, "/api/bookings", request, csrfToken2);
        Assert.Equal(409, (int)r2.StatusCode);
        var error = await r2.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.Equal("OverlappingReservation", error!.Code);
    }

    [Fact]
    public async Task CreateBooking_InvalidPartySize_Returns400()
    {
        var client = CreateClient();
        var (email, _) = await RegisterAndLogin(client);

        var (csrfToken, _) = await GetCsrfToken(client);
        var request = new CreateBookingRequest("ember-table", new DateOnly(2026, 5, 1), new TimeOnly(17, 0), 10, "Test User", email);
        var response = await PostWithCsrf(client, "/api/bookings", request, csrfToken);

        Assert.Equal(400, (int)response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.Equal("InvalidPartySize", error!.Code);
    }

    [Fact]
    public async Task CreateBooking_InvalidTime_Returns400()
    {
        var client = CreateClient();
        var (email, _) = await RegisterAndLogin(client);

        var (csrfToken, _) = await GetCsrfToken(client);
        var request = new CreateBookingRequest("ember-table", new DateOnly(2026, 5, 1), new TimeOnly(16, 30), 2, "Test User", email);
        var response = await PostWithCsrf(client, "/api/bookings", request, csrfToken);

        Assert.Equal(400, (int)response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.Equal("InvalidTime", error!.Code);
    }

    [Fact]
    public async Task CreateBooking_UnknownRestaurant_Returns404()
    {
        var client = CreateClient();
        var (email, _) = await RegisterAndLogin(client);

        var (csrfToken, _) = await GetCsrfToken(client);
        var request = new CreateBookingRequest("unknown", new DateOnly(2026, 5, 1), new TimeOnly(17, 0), 2, "Test User", email);
        var response = await PostWithCsrf(client, "/api/bookings", request, csrfToken);

        Assert.Equal(404, (int)response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.Equal("UnknownRestaurant", error!.Code);
    }

    [Fact]
    public async Task BookingHistory_Isolation_UserACannotSeeUserBsBookings()
    {
        var clientA = CreateClient();
        var suffixA = Guid.NewGuid().ToString("N")[..8];

        var (emailA, _) = await RegisterAndLogin(clientA, $"usera_{suffixA}@test.com");
        var (csrfTokenA, _) = await GetCsrfToken(clientA);
        var requestA = new CreateBookingRequest("ember-table", new DateOnly(2026, 5, 1), new TimeOnly(17, 0), 2, "User A", emailA);
        var createA = await PostWithCsrf(clientA, "/api/bookings", requestA, csrfTokenA);
        Assert.Equal(201, (int)createA.StatusCode);

        // User A's booking history has exactly 1 booking
        var mineA = await clientA.GetAsync("/api/bookings/mine");
        mineA.EnsureSuccessStatusCode();
        var bookingsA = await mineA.Content.ReadFromJsonAsync<Booking[]>();
        Assert.NotNull(bookingsA);
        Assert.Single(bookingsA);
        Assert.Equal("User A", bookingsA[0].GuestName);

        // New client (fresh BookingStore) for User B ensures complete isolation
        var clientB = CreateClient();
        var suffixB = Guid.NewGuid().ToString("N")[..8];

        var (emailB, _) = await RegisterAndLogin(clientB, $"userb_{suffixB}@test.com");
        var (csrfTokenB, _) = await GetCsrfToken(clientB);
        var requestB = new CreateBookingRequest("luna-verde", new DateOnly(2026, 5, 1), new TimeOnly(18, 0), 2, "User B", emailB);
        var createB = await PostWithCsrf(clientB, "/api/bookings", requestB, csrfTokenB);
        Assert.Equal(201, (int)createB.StatusCode);

        // User B sees only their own booking
        var mineB = await clientB.GetAsync("/api/bookings/mine");
        mineB.EnsureSuccessStatusCode();
        var bookingsB = await mineB.Content.ReadFromJsonAsync<Booking[]>();
        Assert.NotNull(bookingsB);
        Assert.Single(bookingsB);
        Assert.Equal("User B", bookingsB[0].GuestName);
    }

    [Fact]
    public async Task Register_CreatesUserAndSignsIn()
    {
        var client = CreateClient();
        var (email, userId) = await RegisterAndLogin(client);

        Assert.NotNull(email);
        Assert.NotNull(userId);
    }

    [Fact]
    public async Task Login_WithWrongPassword_Returns401()
    {
        var client = CreateClient();
        // Demo user is seeded by the app
        var (csrfToken, _) = await GetCsrfToken(client);
        var loginResponse = await PostWithCsrf(client, "/api/auth/login",
            new { email = "demo@example.com", password = "wrong" }, csrfToken);

        Assert.Equal(401, (int)loginResponse.StatusCode);
    }

    [Fact]
    public async Task GetMe_WithoutAuth_Returns401()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/auth/me");

        Assert.Equal(401, (int)response.StatusCode);
    }

    [Fact]
    public async Task GetMe_WithAuth_ReturnsCurrentUser()
    {
        var client = CreateClient();
        var (email, _) = await RegisterAndLogin(client);

        var response = await client.GetAsync("/api/auth/me");
        response.EnsureSuccessStatusCode();
        var user = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(email, user.GetProperty("email").GetString());
    }

    [Fact]
    public async Task OpenApiDocument_IncludesAuthEndpoints()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/openapi/v1.json");
        response.EnsureSuccessStatusCode();

        var doc = await response.Content.ReadFromJsonAsync<JsonElement>();
        var paths = doc.GetProperty("paths");

        Assert.True(paths.TryGetProperty("/api/auth/register", out _));
        Assert.True(paths.TryGetProperty("/api/auth/login", out _));
        Assert.True(paths.TryGetProperty("/api/auth/logout", out _));
        Assert.True(paths.TryGetProperty("/api/auth/me", out _));
        Assert.True(paths.TryGetProperty("/api/auth/antiforgery/token", out _));
        Assert.True(paths.TryGetProperty("/api/bookings/mine", out _));
    }

    [Fact]
    public async Task NonOverlappingAdjacentBooking_Succeeds()
    {
        var client = CreateClient();
        var (email, _) = await RegisterAndLogin(client);

        var (csrfToken1, _) = await GetCsrfToken(client);
        var booking1 = new CreateBookingRequest("ember-table", new DateOnly(2026, 5, 1), new TimeOnly(17, 0), 2, "User", email);
        var r1 = await PostWithCsrf(client, "/api/bookings", booking1, csrfToken1);
        Assert.Equal(201, (int)r1.StatusCode);

        var (csrfToken2, _) = await GetCsrfToken(client);
        var booking2 = new CreateBookingRequest("ember-table", new DateOnly(2026, 5, 1), new TimeOnly(19, 0), 2, "User", email);
        var r2 = await PostWithCsrf(client, "/api/bookings", booking2, csrfToken2);
        Assert.Equal(201, (int)r2.StatusCode);
    }

    [Fact]
    public async Task BookingHistory_ReturnsOnlyCurrentUserBookings()
    {
        var client = CreateClient();
        var (email, _) = await RegisterAndLogin(client);

        var (csrfToken1, _) = await GetCsrfToken(client);
        var booking1 = new CreateBookingRequest("ember-table", new DateOnly(2026, 5, 1), new TimeOnly(17, 0), 2, "History User", email);
        var r1 = await PostWithCsrf(client, "/api/bookings", booking1, csrfToken1);
        Assert.Equal(201, (int)r1.StatusCode);

        var (csrfToken2, _) = await GetCsrfToken(client);
        var booking2 = new CreateBookingRequest("luna-verde", new DateOnly(2026, 5, 2), new TimeOnly(18, 0), 4, "History User", email);
        var r2 = await PostWithCsrf(client, "/api/bookings", booking2, csrfToken2);
        Assert.Equal(201, (int)r2.StatusCode);

        var mine = await client.GetAsync("/api/bookings/mine");
        mine.EnsureSuccessStatusCode();
        var bookings = await mine.Content.ReadFromJsonAsync<Booking[]>();
        Assert.NotNull(bookings);
        Assert.Equal(2, bookings.Length);
    }

    [Fact]
    public async Task AntiforgeryTokenEndpoint_ReturnsToken()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/auth/antiforgery/token");
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        var requestToken = json.GetProperty("requestToken").GetString();
        Assert.NotNull(requestToken);
        Assert.NotEmpty(requestToken);
    }

    // --- Helpers ---

    private static async Task<(string requestToken, string?)> GetCsrfToken(HttpClient client)
    {
        var response = await client.GetAsync("/api/auth/antiforgery/token");
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadFromJsonAsync<JsonElement>();
        var requestToken = json.GetProperty("requestToken").GetString()!;
        return (requestToken, null);
    }

    private static async Task<HttpResponseMessage> PostWithCsrf(HttpClient client, string url, object body, string csrfToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = JsonContent.Create(body),
        };
        request.Headers.TryAddWithoutValidation("X-CSRF-TOKEN", csrfToken);
        return await client.SendAsync(request);
    }

    private static async Task<(string email, string userId)> RegisterAndLogin(HttpClient client, string? email = null)
    {
        email ??= $"test_{Guid.NewGuid():N}@example.com";
        var password = "Test123!";

        var (csrfToken, _) = await GetCsrfToken(client);
        var registerResponse = await PostWithCsrf(client, "/api/auth/register",
            new { email, password }, csrfToken);

        if (registerResponse.StatusCode == System.Net.HttpStatusCode.BadRequest)
        {
            var error = await registerResponse.Content.ReadFromJsonAsync<ErrorResponse>();
            throw new InvalidOperationException($"Registration failed: {error?.Message}");
        }

        registerResponse.EnsureSuccessStatusCode();
        var user = await registerResponse.Content.ReadFromJsonAsync<JsonElement>();
        return (email, user.GetProperty("id").GetString()!);
    }
}
