using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class ApiTests : IDisposable
{
    private readonly WebApplicationFactory<Program> _factory;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public ApiTests()
    {
        _factory = new WebApplicationFactory<Program>();
    }

    public void Dispose()
    {
        _factory.Dispose();
    }

    private HttpClient CreateClient()
    {
        return _factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false
        });
    }

    private async Task<string> GetCsrfToken(HttpClient client)
    {
        var response = await client.GetAsync("/api/auth/csrf");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        return response.Headers.GetValues("X-CSRF-TOKEN").First();
    }

    private static StringContent JsonContent<T>(T value)
    {
        var json = JsonSerializer.Serialize(value, JsonOptions);
        return new StringContent(json, Encoding.UTF8, "application/json");
    }

    private async Task<HttpClient> CreateAuthenticatedClient()
    {
        var client = CreateClient();
        var csrfToken = await GetCsrfToken(client);

        var loginContent = JsonContent(new { email = "demo@example.com", password = "Demo1234!" });
        loginContent.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var loginResponse = await client.PostAsync("/api/auth/login", loginContent);
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);

        return client;
    }

    private async Task<(HttpClient Client, string UserId)> CreateRegisteredUser(string email)
    {
        var client = CreateClient();
        var csrfToken = await GetCsrfToken(client);

        var registerContent = JsonContent(new { name = "Test User", email, password = "Password123!" });
        registerContent.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var registerResponse = await client.PostAsync("/api/auth/register", registerContent);
        Assert.Equal(HttpStatusCode.Created, registerResponse.StatusCode);

        var user = await registerResponse.Content.ReadFromJsonAsync<AuthEndpoints.UserResponse>(JsonOptions);
        Assert.NotNull(user);

        return (client, user.Id);
    }

    // ===== A. Existing endpoint smoke tests =====

    [Fact]
    public async Task GetRestaurants_Returns200_With3Restaurants()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/restaurants");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var restaurants = await response.Content.ReadFromJsonAsync<List<Restaurant>>(JsonOptions);
        Assert.NotNull(restaurants);
        Assert.Equal(3, restaurants.Count);
    }

    [Fact]
    public async Task GetBookings_Returns200()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/bookings");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var bookings = await response.Content.ReadFromJsonAsync<List<Booking>>(JsonOptions);
        Assert.NotNull(bookings);
    }

    [Fact]
    public async Task GetAvailability_Returns200_WithSlots()
    {
        var client = CreateClient();
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));
        var response = await client.GetAsync($"/api/restaurants/ember-table/availability?date={tomorrow:yyyy-MM-dd}&partySize=2");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var slots = await response.Content.ReadFromJsonAsync<List<AvailabilitySlot>>(JsonOptions);
        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
    }

    // ===== B. Error mapping tests =====

    [Fact]
    public async Task CreateBooking_UnknownRestaurant_Returns404()
    {
        var client = await CreateAuthenticatedClient();
        var csrfToken = await GetCsrfToken(client);
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var content = JsonContent(new CreateBookingRequest("nonexistent", tomorrow, new TimeOnly(17, 0), 2, "Test", "test@test.com"));
        content.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response = await client.PostAsync("/api/bookings", content);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("UnknownRestaurant", error.Code);
    }

    [Fact]
    public async Task CreateBooking_InvalidPartySize_TooSmall_Returns400()
    {
        var client = await CreateAuthenticatedClient();
        var csrfToken = await GetCsrfToken(client);
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var content = JsonContent(new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 0, "Test", "test@test.com"));
        content.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response = await client.PostAsync("/api/bookings", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("InvalidPartySize", error.Code);
    }

    [Fact]
    public async Task CreateBooking_InvalidPartySize_TooLarge_Returns400()
    {
        var client = await CreateAuthenticatedClient();
        var csrfToken = await GetCsrfToken(client);
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var content = JsonContent(new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 9, "Test", "test@test.com"));
        content.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response = await client.PostAsync("/api/bookings", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("InvalidPartySize", error.Code);
    }

    [Fact]
    public async Task CreateBooking_PastDate_Returns400()
    {
        var client = await CreateAuthenticatedClient();
        var csrfToken = await GetCsrfToken(client);
        var yesterday = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-1));

        var content = JsonContent(new CreateBookingRequest("ember-table", yesterday, new TimeOnly(17, 0), 2, "Test", "test@test.com"));
        content.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response = await client.PostAsync("/api/bookings", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("InvalidDate", error.Code);
    }

    [Fact]
    public async Task CreateBooking_InvalidTime_Returns400()
    {
        var client = await CreateAuthenticatedClient();
        var csrfToken = await GetCsrfToken(client);
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var content = JsonContent(new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(16, 30), 2, "Test", "test@test.com"));
        content.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response = await client.PostAsync("/api/bookings", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("InvalidTime", error.Code);
    }

    [Fact]
    public async Task CreateBooking_OverlappingReservation_Returns409()
    {
        var client = await CreateAuthenticatedClient();
        var csrfToken = await GetCsrfToken(client);
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        // Create first booking at 17:00 with party 8 on saffron-court
        // Only saffron-8 (capacity 8) can seat a party of 8
        var content1 = JsonContent(new CreateBookingRequest("saffron-court", tomorrow, new TimeOnly(17, 0), 8, "Test", "test@test.com"));
        content1.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response1 = await client.PostAsync("/api/bookings", content1);
        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);

        // Try same party at same time — saffron-8 is occupied, no other table fits 8
        csrfToken = await GetCsrfToken(client);
        var content2 = JsonContent(new CreateBookingRequest("saffron-court", tomorrow, new TimeOnly(17, 0), 8, "Test2", "test2@test.com"));
        content2.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response2 = await client.PostAsync("/api/bookings", content2);

        Assert.Equal(HttpStatusCode.Conflict, response2.StatusCode);
        var error = await response2.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("OverlappingReservation", error.Code);
    }

    [Fact]
    public async Task CreateBooking_NoTableForPartySize_Returns400()
    {
        var client = await CreateAuthenticatedClient();
        var csrfToken = await GetCsrfToken(client);
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        // ember-table's largest table is ember-6 (capacity 6), party of 7 cannot be seated
        var content = JsonContent(new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 7, "Test", "test@test.com"));
        content.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response = await client.PostAsync("/api/bookings", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("NoTableForPartySize", error.Code);
    }

    [Fact]
    public async Task CreateBooking_AdjacentNonOverlapping_Returns201()
    {
        var client = await CreateAuthenticatedClient();
        var csrfToken = await GetCsrfToken(client);
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        // First booking at 17:00 for party of 4 on ember-table => ember-4
        var content1 = JsonContent(new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 4, "Test", "test@test.com"));
        content1.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response1 = await client.PostAsync("/api/bookings", content1);
        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);

        // Second booking at 19:00 for party of 4 — should get ember-4 (non-overlapping since 17:00-19:00 vs 19:00-21:00)
        csrfToken = await GetCsrfToken(client);
        var content2 = JsonContent(new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(19, 0), 4, "Test2", "test2@test.com"));
        content2.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response2 = await client.PostAsync("/api/bookings", content2);

        Assert.Equal(HttpStatusCode.Created, response2.StatusCode);
        var booking = await response2.Content.ReadFromJsonAsync<Booking>(JsonOptions);
        Assert.NotNull(booking);
        Assert.Equal("ember-4", booking.TableId);
    }

    // ===== C. Auth boundary tests =====

    [Fact]
    public async Task CreateBooking_WithoutAuth_Returns401()
    {
        var client = CreateClient();
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var content = JsonContent(new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 2, "Test", "test@test.com"));
        var response = await client.PostAsync("/api/bookings", content);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_WithAuth_Returns201_IncludesUserId()
    {
        var email = $"test-{Guid.NewGuid():N}@example.com";
        var (client, userId) = await CreateRegisteredUser(email);
        var csrfToken = await GetCsrfToken(client);
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var content = JsonContent(new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 2, "Test", email));
        content.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response = await client.PostAsync("/api/bookings", content);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var booking = await response.Content.ReadFromJsonAsync<Booking>(JsonOptions);
        Assert.NotNull(booking);
        Assert.Equal(userId, booking.UserId);
    }

    [Fact]
    public async Task GetMyBookings_WithoutAuth_Returns401()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/bookings/mine");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMyBookings_WithAuth_ReturnsOwnBookings()
    {
        var client = await CreateAuthenticatedClient();
        var csrfToken = await GetCsrfToken(client);
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var content = JsonContent(new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 2, "Demo", "demo@example.com"));
        content.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var createResponse = await client.PostAsync("/api/bookings", content);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var response = await client.GetAsync("/api/bookings/mine");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var bookings = await response.Content.ReadFromJsonAsync<List<Booking>>(JsonOptions);
        Assert.NotNull(bookings);
        Assert.NotEmpty(bookings);
        Assert.All(bookings, b => Assert.Equal("demo@example.com", b.GuestEmail));
    }

    [Fact]
    public async Task Register_ValidData_Returns201_WithAuthCookie()
    {
        var client = CreateClient();
        var csrfToken = await GetCsrfToken(client);
        var email = $"new-{Guid.NewGuid():N}@example.com";

        var content = JsonContent(new { name = "New User", email, password = "Password123!" });
        content.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response = await client.PostAsync("/api/auth/register", content);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var user = await response.Content.ReadFromJsonAsync<AuthEndpoints.UserResponse>(JsonOptions);
        Assert.NotNull(user);
        Assert.Equal(email, user.Email);

        var meResponse = await client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.OK, meResponse.StatusCode);
    }

    [Fact]
    public async Task Register_DuplicateEmail_Returns409()
    {
        var client = CreateClient();
        var csrfToken = await GetCsrfToken(client);
        var email = $"dup-{Guid.NewGuid():N}@example.com";

        var content1 = JsonContent(new { name = "User", email, password = "Password123!" });
        content1.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response1 = await client.PostAsync("/api/auth/register", content1);
        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);

        csrfToken = await GetCsrfToken(client);
        var content2 = JsonContent(new { name = "User2", email, password = "Password456!" });
        content2.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response2 = await client.PostAsync("/api/auth/register", content2);

        Assert.Equal(HttpStatusCode.Conflict, response2.StatusCode);
        var error = await response2.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("DuplicateEmail", error.Code);
    }

    [Fact]
    public async Task Login_WrongPassword_Returns401()
    {
        var client = CreateClient();
        var csrfToken = await GetCsrfToken(client);

        var content = JsonContent(new { email = "demo@example.com", password = "WrongPassword!" });
        content.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response = await client.PostAsync("/api/auth/login", content);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_ValidCredentials_Returns200_WithAuthCookie()
    {
        var client = CreateClient();
        var csrfToken = await GetCsrfToken(client);

        var content = JsonContent(new { email = "demo@example.com", password = "Demo1234!" });
        content.Headers.Add("X-CSRF-TOKEN", csrfToken);
        var response = await client.PostAsync("/api/auth/login", content);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var user = await response.Content.ReadFromJsonAsync<AuthEndpoints.UserResponse>(JsonOptions);
        Assert.NotNull(user);
        Assert.Equal("demo@example.com", user.Email);

        var meResponse = await client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.OK, meResponse.StatusCode);
    }

    [Fact]
    public async Task GetMe_Authenticated_Returns200()
    {
        var client = await CreateAuthenticatedClient();

        var response = await client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var user = await response.Content.ReadFromJsonAsync<AuthEndpoints.UserResponse>(JsonOptions);
        Assert.NotNull(user);
        Assert.Equal("demo@example.com", user.Email);
    }

    [Fact]
    public async Task GetMe_Unauthenticated_Returns401()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ===== D. User-scoped booking isolation =====

    [Fact]
    public async Task Bookings_Mine_IsScopedByUser()
    {
        var emailA = $"userA-{Guid.NewGuid():N}@example.com";
        var emailB = $"userB-{Guid.NewGuid():N}@example.com";

        var (clientA, userIdA) = await CreateRegisteredUser(emailA);
        var (clientB, userIdB) = await CreateRegisteredUser(emailB);

        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        // User A creates a booking
        var csrfA = await GetCsrfToken(clientA);
        var content = JsonContent(new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 2, "User A", emailA));
        content.Headers.Add("X-CSRF-TOKEN", csrfA);
        var createResponse = await clientA.PostAsync("/api/bookings", content);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        // User B's /mine should not include User A's booking
        var mineB = await clientB.GetAsync("/api/bookings/mine");
        Assert.Equal(HttpStatusCode.OK, mineB.StatusCode);
        var bookingsB = await mineB.Content.ReadFromJsonAsync<List<Booking>>(JsonOptions);
        Assert.NotNull(bookingsB);
        Assert.DoesNotContain(bookingsB, b => b.GuestEmail == emailA);

        // User A's /mine should include their booking
        var mineA = await clientA.GetAsync("/api/bookings/mine");
        Assert.Equal(HttpStatusCode.OK, mineA.StatusCode);
        var bookingsA = await mineA.Content.ReadFromJsonAsync<List<Booking>>(JsonOptions);
        Assert.NotNull(bookingsA);
        Assert.Contains(bookingsA, b => b.GuestEmail == emailA);
    }

    // ===== E. CSRF protection =====

    [Fact]
    public async Task CreateBooking_WithoutCsrfToken_Returns400()
    {
        var client = await CreateAuthenticatedClient();
        var tomorrow = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1));

        var content = JsonContent(new CreateBookingRequest("ember-table", tomorrow, new TimeOnly(17, 0), 2, "Test", "test@test.com"));
        var response = await client.PostAsync("/api/bookings", content);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("AntiforgeryValidationFailed", error.Code);
    }
}
