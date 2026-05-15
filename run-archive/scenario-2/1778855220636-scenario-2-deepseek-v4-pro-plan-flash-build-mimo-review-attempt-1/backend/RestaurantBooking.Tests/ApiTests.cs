using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class ApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> factory;

    public ApiTests(WebApplicationFactory<Program> factory)
    {
        this.factory = factory.WithWebHostBuilder(builder =>
            builder.UseSetting("urls", "http://localhost:0"));
    }

    private static HttpClient CreateClient(WebApplicationFactory<Program> f)
    {
        return f.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            HandleCookies = true,
        });
    }

    private static async Task<string> GetCsrfToken(HttpClient client)
    {
        var response = await client.GetAsync("/api/csrf-token");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var result = await response.Content.ReadFromJsonAsync<CsrfTokenResponse>();
        Assert.NotNull(result);
        Assert.NotEmpty(result.Token);
        return result.Token;
    }

    private static HttpRequestMessage JsonPost(string url, object body, string csrfToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = JsonContent.Create(body),
        };
        request.Headers.Add("X-XSRF-TOKEN", csrfToken);
        return request;
    }

    [Fact]
    public async Task ListRestaurants_ReturnsOk()
    {
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/restaurants");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var restaurants = await response.Content.ReadFromJsonAsync<Restaurant[]>();
        Assert.NotNull(restaurants);
        Assert.NotEmpty(restaurants);
    }

    [Fact]
    public async Task ListAvailableSlots_ReturnsSlots()
    {
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/restaurants/ember-table/availability?date=2026-06-14&partySize=2");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var slots = await response.Content.ReadFromJsonAsync<AvailabilitySlot[]>();
        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
    }

    [Fact]
    public async Task ListAvailableSlots_UnknownRestaurant_Returns404()
    {
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/restaurants/unknown/availability?date=2026-06-14&partySize=2");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("UnknownRestaurant", error.Code);
    }

    [Fact]
    public async Task ListAvailableSlots_InvalidPartySize_Returns400()
    {
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/restaurants/ember-table/availability?date=2026-06-14&partySize=20");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("InvalidPartySize", error.Code);
    }

    [Fact]
    public async Task RegisterAndLogin_Flow_Succeeds()
    {
        var client = CreateClient(factory);
        var csrfToken = await GetCsrfToken(client);

        var email = $"test-{Guid.NewGuid():N}@example.com";

        // Register (no CSRF required)
        var registerResponse = await client.SendAsync(JsonPost("/api/auth/register", new
        {
            email,
            password = "test1234",
            name = "Test User",
        }, csrfToken));
        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);
        var registered = await registerResponse.Content.ReadFromJsonAsync<UserInfo>();
        Assert.NotNull(registered);
        Assert.Equal(email, registered.Email);

        // Re-fetch CSRF after register (auth state changed)
        csrfToken = await GetCsrfToken(client);

        // Logout
        var logoutResponse = await client.SendAsync(new HttpRequestMessage(HttpMethod.Post, "/api/auth/logout")
        {
            Headers = { { "X-XSRF-TOKEN", csrfToken } },
        });
        Assert.Equal(HttpStatusCode.OK, logoutResponse.StatusCode);

        // Re-fetch CSRF after logout
        csrfToken = await GetCsrfToken(client);

        // Login
        var loginResponse = await client.SendAsync(JsonPost("/api/auth/login", new
        {
            email,
            password = "test1234",
        }, csrfToken));
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
        var loggedIn = await loginResponse.Content.ReadFromJsonAsync<UserInfo>();
        Assert.NotNull(loggedIn);
        Assert.Equal(email, loggedIn.Email);

        // Re-fetch CSRF after login
        csrfToken = await GetCsrfToken(client);

        // Get current user
        var meResponse = await client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.OK, meResponse.StatusCode);
        var me = await meResponse.Content.ReadFromJsonAsync<UserInfo>();
        Assert.NotNull(me);
        Assert.Equal(email, me.Email);
    }

    [Fact]
    public async Task CreateBooking_WithoutAuth_Returns401()
    {
        var client = CreateClient(factory);

        // Even with CSRF, no auth cookie -> 401
        var csrfToken = await GetCsrfToken(client);
        var response = await client.SendAsync(JsonPost("/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-06-10",
            time = "18:00",
            partySize = 2,
            guestName = "Guest",
            guestEmail = "guest@example.com",
        }, csrfToken));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMyBookings_WithoutAuth_Returns401()
    {
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/my-bookings");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_WithAuth_Succeeds()
    {
        var client = CreateClient(factory);
        var csrfToken = await GetCsrfToken(client);

        var email = $"booking-{Guid.NewGuid():N}@example.com";

        // Register
        var registerResponse = await client.SendAsync(JsonPost("/api/auth/register", new
        {
            email,
            password = "test1234",
            name = "Booking Tester",
        }, csrfToken));
        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);

        // Re-fetch CSRF after register (auth state changed)
        csrfToken = await GetCsrfToken(client);

        // Create booking with CSRF header
        var createResponse = await client.SendAsync(JsonPost("/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-06-10",
            time = "18:00",
            partySize = 2,
            guestName = "Booking Tester",
            guestEmail = email,
        }, csrfToken));
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        var booking = await createResponse.Content.ReadFromJsonAsync<Booking>();
        Assert.NotNull(booking);
        Assert.Equal("ember-table", booking.RestaurantId);

        // Get my bookings
        var myBookingsResponse = await client.GetAsync("/api/my-bookings");
        Assert.Equal(HttpStatusCode.OK, myBookingsResponse.StatusCode);
        var myBookings = await myBookingsResponse.Content.ReadFromJsonAsync<Booking[]>();
        Assert.NotNull(myBookings);
        Assert.Contains(myBookings, b => b.Id == booking.Id);
    }

    [Fact]
    public async Task CreateBooking_WithoutCsrfToken_Returns400()
    {
        var client = CreateClient(factory);
        var csrfToken = await GetCsrfToken(client);

        var email = $"csrf-{Guid.NewGuid():N}@example.com";
        var registerResponse = await client.SendAsync(JsonPost("/api/auth/register", new
        {
            email,
            password = "test1234",
            name = "CSRF Tester",
        }, csrfToken));
        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);

        // Create booking WITHOUT CSRF header — use PostAsJsonAsync which doesn't add the header
        var response = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-06-10",
            time = "18:00",
            partySize = 2,
            guestName = "CSRF Tester",
            guestEmail = email,
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("CSRF", error.Code);
    }

    [Fact]
    public async Task DemoUser_Exists_CanLogin()
    {
        var client = CreateClient(factory);
        var csrfToken = await GetCsrfToken(client);

        var loginResponse = await client.SendAsync(JsonPost("/api/auth/login", new
        {
            email = "demo@example.com",
            password = "demo1234",
        }, csrfToken));
        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
        var user = await loginResponse.Content.ReadFromJsonAsync<UserInfo>();
        Assert.NotNull(user);
        Assert.Equal("demo@example.com", user.Email);

        // Re-fetch CSRF after login
        csrfToken = await GetCsrfToken(client);

        // Verify me endpoint
        var meResponse = await client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.OK, meResponse.StatusCode);
        var me = await meResponse.Content.ReadFromJsonAsync<UserInfo>();
        Assert.NotNull(me);
        Assert.Equal("demo@example.com", me.Email);
    }

    [Fact]
    public async Task Login_InvalidCredentials_Returns401()
    {
        var client = CreateClient(factory);
        var csrfToken = await GetCsrfToken(client);

        var response = await client.SendAsync(JsonPost("/api/auth/login", new
        {
            email = "nonexistent@example.com",
            password = "wrong",
        }, csrfToken));
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMyBookings_ScopedToUser()
    {
        var client = CreateClient(factory);
        var csrfToken = await GetCsrfToken(client);

        // User A registers and creates a booking
        var emailA = $"userA-{Guid.NewGuid():N}@example.com";
        var registerA = await client.SendAsync(JsonPost("/api/auth/register", new
        {
            email = emailA,
            password = "test1234",
            name = "User A",
        }, csrfToken));
        Assert.Equal(HttpStatusCode.OK, registerA.StatusCode);

        // Re-fetch CSRF after register
        csrfToken = await GetCsrfToken(client);

        var createA = await client.SendAsync(JsonPost("/api/bookings", new
        {
            restaurantId = "luna-verde",
            date = "2026-06-10",
            time = "17:00",
            partySize = 2,
            guestName = "User A",
            guestEmail = emailA,
        }, csrfToken));
        Assert.Equal(HttpStatusCode.Created, createA.StatusCode);
        var bookingA = await createA.Content.ReadFromJsonAsync<Booking>();
        Assert.NotNull(bookingA);

        // Logout User A
        var logoutResponse = await client.SendAsync(new HttpRequestMessage(HttpMethod.Post, "/api/auth/logout")
        {
            Headers = { { "X-XSRF-TOKEN", csrfToken } },
        });
        Assert.Equal(HttpStatusCode.OK, logoutResponse.StatusCode);

        // Register User B
        csrfToken = await GetCsrfToken(client);

        var emailB = $"userB-{Guid.NewGuid():N}@example.com";
        var registerB = await client.SendAsync(JsonPost("/api/auth/register", new
        {
            email = emailB,
            password = "test1234",
            name = "User B",
        }, csrfToken));
        Assert.Equal(HttpStatusCode.OK, registerB.StatusCode);

        // User B's my-bookings should NOT include User A's booking
        var myBookingsB = await client.GetAsync("/api/my-bookings");
        Assert.Equal(HttpStatusCode.OK, myBookingsB.StatusCode);
        var bookingsB = await myBookingsB.Content.ReadFromJsonAsync<Booking[]>();
        Assert.NotNull(bookingsB);
        Assert.DoesNotContain(bookingsB, b => b.Id == bookingA.Id);
    }

    [Fact]
    public async Task OverlappingReservation_Returns409()
    {
        var client = CreateClient(factory);
        var csrfToken = await GetCsrfToken(client);

        var email = $"overlap-{Guid.NewGuid():N}@example.com";
        var registerResponse = await client.SendAsync(JsonPost("/api/auth/register", new
        {
            email,
            password = "test1234",
            name = "Overlap Tester",
        }, csrfToken));
        Assert.Equal(HttpStatusCode.OK, registerResponse.StatusCode);

        // Re-fetch CSRF after register
        csrfToken = await GetCsrfToken(client);

        // Create first booking at 17:00, party size 6 (only ember-6 table fits)
        var req1 = await client.SendAsync(JsonPost("/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-06-10",
            time = "17:00",
            partySize = 6,
            guestName = "Overlap Tester",
            guestEmail = email,
        }, csrfToken));
        Assert.Equal(HttpStatusCode.Created, req1.StatusCode);

        // Try creating overlapping booking — same time, same party size => same table (only ember-6 fits 6)
        var req2 = await client.SendAsync(JsonPost("/api/bookings", new
        {
            restaurantId = "ember-table",
            date = "2026-06-10",
            time = "17:00",
            partySize = 6,
            guestName = "Overlap Tester",
            guestEmail = email,
        }, csrfToken));

        Assert.Equal(HttpStatusCode.Conflict, req2.StatusCode);
        var error = await req2.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("OverlappingReservation", error.Code);
    }
}

internal sealed record CsrfTokenResponse(string Token);
