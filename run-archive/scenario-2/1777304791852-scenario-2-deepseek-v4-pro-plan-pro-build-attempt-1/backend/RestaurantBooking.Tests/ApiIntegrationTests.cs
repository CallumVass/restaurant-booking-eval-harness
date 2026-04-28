using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class ApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Public_endpoints_are_accessible_unauthenticated()
    {
        var client = _factory.CreateClient();

        var restaurants = await client.GetAsync("/api/restaurants");
        Assert.Equal(HttpStatusCode.OK, restaurants.StatusCode);

        var availability = await client.GetAsync(
            "/api/restaurants/ember-table/availability?date=2026-05-15&partySize=2");
        Assert.Equal(HttpStatusCode.OK, availability.StatusCode);
    }

    [Fact]
    public async Task Booking_creation_requires_authentication()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/bookings", new CreateBookingRequest(
            "ember-table",
            new DateOnly(2026, 5, 15),
            new TimeOnly(18, 0),
            2,
            "Test Guest",
            "test@example.com"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Booking_list_requires_authentication()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/bookings");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Authenticated_user_can_create_booking()
    {
        var client = _factory.CreateClient();
        await LoginAsync(client, "demo@example.com", "Demo123!");

        var response = await client.PostAsJsonAsync("/api/bookings", new CreateBookingRequest(
            "ember-table",
            new DateOnly(2026, 5, 15),
            new TimeOnly(19, 0),
            2,
            "Test Guest",
            "test@example.com"));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var booking = await response.Content.ReadFromJsonAsync<Booking>();
        Assert.NotNull(booking);
        Assert.Equal("ember-table", booking!.RestaurantId);
    }

    [Fact]
    public async Task User_sees_only_own_bookings()
    {
        var client1 = _factory.CreateClient();
        await RegisterAndLoginAsync(client1, "user1@example.com", "Pass1!");

        var response1 = await client1.PostAsJsonAsync("/api/bookings", new CreateBookingRequest(
            "ember-table",
            new DateOnly(2026, 5, 16),
            new TimeOnly(17, 0),
            2,
            "User One",
            "user1@example.com"));
        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);

        var client2 = _factory.CreateClient();
        await RegisterAndLoginAsync(client2, "user2@example.com", "Pass2!");

        var response2 = await client2.PostAsJsonAsync("/api/bookings", new CreateBookingRequest(
            "luna-verde",
            new DateOnly(2026, 5, 17),
            new TimeOnly(18, 0),
            4,
            "User Two",
            "user2@example.com"));
        Assert.Equal(HttpStatusCode.Created, response2.StatusCode);

        var bookings1 = await client1.GetFromJsonAsync<List<Booking>>("/api/bookings");
        Assert.NotNull(bookings1);
        Assert.Single(bookings1!);
        Assert.Equal("User One", bookings1![0].GuestName);

        var bookings2 = await client2.GetFromJsonAsync<List<Booking>>("/api/bookings");
        Assert.NotNull(bookings2);
        Assert.Single(bookings2!);
        Assert.Equal("User Two", bookings2![0].GuestName);
    }

    [Fact]
    public async Task Invalid_party_size_returns_400()
    {
        var client = _factory.CreateClient();
        await LoginAsync(client, "demo@example.com", "Demo123!");

        var response = await client.PostAsJsonAsync("/api/bookings", new CreateBookingRequest(
            "ember-table",
            new DateOnly(2026, 5, 15),
            new TimeOnly(18, 0),
            0,
            "Test Guest",
            "test@example.com"));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("InvalidPartySize", error!.Code);
    }

    [Fact]
    public async Task Invalid_time_returns_400()
    {
        var client = _factory.CreateClient();
        await LoginAsync(client, "demo@example.com", "Demo123!");

        var response = await client.PostAsJsonAsync("/api/bookings", new CreateBookingRequest(
            "ember-table",
            new DateOnly(2026, 5, 15),
            new TimeOnly(16, 30),
            2,
            "Test Guest",
            "test@example.com"));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Overlapping_reservation_returns_409()
    {
        var client = _factory.CreateClient();
        await LoginAsync(client, "demo@example.com", "Demo123!");

        var first = await client.PostAsJsonAsync("/api/bookings", new CreateBookingRequest(
            "ember-table",
            new DateOnly(2026, 5, 15),
            new TimeOnly(17, 0),
            6,
            "First Guest",
            "first@example.com"));
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        var second = await client.PostAsJsonAsync("/api/bookings", new CreateBookingRequest(
            "ember-table",
            new DateOnly(2026, 5, 15),
            new TimeOnly(18, 0),
            6,
            "Second Guest",
            "second@example.com"));
        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
    }

    [Fact]
    public async Task Unknown_restaurant_returns_404()
    {
        var client = _factory.CreateClient();
        await LoginAsync(client, "demo@example.com", "Demo123!");

        var response = await client.PostAsJsonAsync("/api/bookings", new CreateBookingRequest(
            "nonexistent",
            new DateOnly(2026, 5, 15),
            new TimeOnly(18, 0),
            2,
            "Test Guest",
            "test@example.com"));

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Login_with_wrong_password_returns_401()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(
            "demo@example.com", "WrongPassword"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_with_unknown_email_returns_401()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(
            "nobody@example.com", "Whatever"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Register_then_login_and_me_works()
    {
        var client = _factory.CreateClient();

        var register = await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(
            "fresh@example.com", "Fresh1!"));
        Assert.Equal(HttpStatusCode.OK, register.StatusCode);

        var me = await client.GetFromJsonAsync<UserInfo>("/api/auth/me");
        Assert.NotNull(me);
        Assert.Equal("fresh@example.com", me!.Email);
        Assert.True(me.IsAuthenticated);
    }

    [Fact]
    public async Task OpenAPI_document_is_accessible()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/openapi/v1.json");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Logout_clears_session()
    {
        var client = _factory.CreateClient();
        await LoginAsync(client, "demo@example.com", "Demo123!");

        var preLogout = await client.GetFromJsonAsync<UserInfo>("/api/auth/me");
        Assert.True(preLogout!.IsAuthenticated);

        await client.PostAsync("/api/auth/logout", null);

        var postLogout = await client.GetFromJsonAsync<UserInfo>("/api/auth/me");
        Assert.False(postLogout!.IsAuthenticated);
    }

    [Fact]
    public async Task Register_logout_login_roundtrip()
    {
        var client = _factory.CreateClient();

        var register = await client.PostAsJsonAsync("/api/auth/register",
            new RegisterRequest("roundtrip@example.com", "Test1!"));
        Assert.Equal(HttpStatusCode.OK, register.StatusCode);

        await client.PostAsync("/api/auth/logout", null);

        var login = await client.PostAsJsonAsync("/api/auth/login",
            new LoginRequest("roundtrip@example.com", "Test1!"));
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);

        var me = await client.GetFromJsonAsync<UserInfo>("/api/auth/me");
        Assert.True(me!.IsAuthenticated);
    }

    [Fact]
    public async Task Login_seeded_user_works()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/login",
            new LoginRequest("demo@example.com", "Demo123!"));
        response.EnsureSuccessStatusCode();
    }

    private static async Task LoginAsync(HttpClient client, string email, string password)
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(email, password));
        response.EnsureSuccessStatusCode();
    }

    private static async Task RegisterAndLoginAsync(HttpClient client, string email, string password)
    {
        var response = await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest(email, password));
        response.EnsureSuccessStatusCode();
    }
}
