using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class BookingEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> factory;
    private static readonly DateOnly Today = DateOnly.FromDateTime(DateTime.UtcNow);
    private static readonly string TodayStr = Today.ToString("yyyy-MM-dd");

    public BookingEndpointsTests(WebApplicationFactory<Program> factory)
    {
        this.factory = factory;
    }

    [Fact]
    public async Task CreateBooking_Authenticated_Returns201WithUserId()
    {
        var (client, _, user) = await RegisterAndLogin("bookingcreate_auth@example.com");

        var response = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "ember-table",
            date = TodayStr,
            time = "17:00",
            partySize = 2,
            guestName = "Alice",
            guestEmail = "alice@example.com"
        });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var booking = await response.Content.ReadFromJsonAsync<Booking>();
        Assert.NotNull(booking);
        Assert.Equal(user.Id, booking!.UserId);
    }

    [Fact]
    public async Task CreateBooking_Unauthenticated_Returns401()
    {
        var client = CreateClient();

        var response = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "ember-table",
            date = TodayStr,
            time = "17:00",
            partySize = 2,
            guestName = "Guest",
            guestEmail = "guest@example.com"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetMyBookings_Authenticated_ReturnsOnlyOwnBookings()
    {
        var (aliceClient, _, alice) = await RegisterAndLogin("alice_mine@example.com");
        var (bobClient, _, bob) = await RegisterAndLogin("bob_mine@example.com");

        await aliceClient.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "ember-table",
            date = TodayStr,
            time = "17:00",
            partySize = 2,
            guestName = "Alice",
            guestEmail = "alice_mine@example.com"
        });

        await bobClient.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "luna-verde",
            date = TodayStr,
            time = "18:00",
            partySize = 2,
            guestName = "Bob",
            guestEmail = "bob_mine@example.com"
        });

        var aliceMine = await aliceClient.GetAsync("/api/bookings/mine");
        var aliceBookings = await aliceMine.Content.ReadFromJsonAsync<Booking[]>();
        Assert.NotNull(aliceBookings);
        Assert.All(aliceBookings!, b => Assert.Equal(alice.Id, b.UserId));

        var bobMine = await bobClient.GetAsync("/api/bookings/mine");
        var bobBookings = await bobMine.Content.ReadFromJsonAsync<Booking[]>();
        Assert.NotNull(bobBookings);
        Assert.All(bobBookings!, b => Assert.Equal(bob.Id, b.UserId));
    }

    [Fact]
    public async Task GetMyBookings_Unauthenticated_Returns401()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/bookings/mine");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_InvalidPartySize_Returns400()
    {
        var (client, _, _) = await RegisterAndLogin("invalidparty@example.com");

        var response = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "ember-table",
            date = TodayStr,
            time = "17:00",
            partySize = 0,
            guestName = "Test",
            guestEmail = "test@example.com"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("InvalidPartySize", error!.Code);
    }

    [Fact]
    public async Task CreateBooking_UnknownRestaurant_Returns404()
    {
        var (client, _, _) = await RegisterAndLogin("unknownrest@example.com");

        var response = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "nonexistent",
            date = TodayStr,
            time = "17:00",
            partySize = 2,
            guestName = "Test",
            guestEmail = "test@example.com"
        });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("UnknownRestaurant", error!.Code);
    }

    [Fact]
    public async Task CreateBooking_OverlappingReservation_Returns409()
    {
        var (client, _, _) = await RegisterAndLogin("overlap@example.com");

        var first = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "saffron-court",
            date = TodayStr,
            time = "17:00",
            partySize = 8,
            guestName = "Large Party",
            guestEmail = "overlap@example.com"
        });
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        var second = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "saffron-court",
            date = TodayStr,
            time = "17:00",
            partySize = 8,
            guestName = "Another Large Party",
            guestEmail = "overlap@example.com"
        });

        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
        var error = await second.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("OverlappingReservation", error!.Code);
    }

    [Fact]
    public async Task AvailableSlots_ReturnsResults()
    {
        var client = CreateClient();

        var response = await client.GetAsync($"/api/restaurants/ember-table/availability?date={TodayStr}&partySize=2");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var slots = await response.Content.ReadFromJsonAsync<AvailabilitySlot[]>();
        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
    }

    [Fact]
    public async Task ListRestaurants_ReturnsData()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/api/restaurants");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var restaurants = await response.Content.ReadFromJsonAsync<Restaurant[]>();
        Assert.NotNull(restaurants);
        Assert.NotEmpty(restaurants);
    }

    [Fact]
    public async Task ListAllBookings_Public_ReturnsData()
    {
        var client = CreateClient();

        var response = await client.GetAsync("/api/bookings");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private HttpClient CreateClient() => factory.CreateClient(new WebApplicationFactoryClientOptions
    {
        AllowAutoRedirect = false,
    });

    private async Task<(HttpClient Client, string CsrfToken, UserInfo User)> RegisterAndLogin(string email, string password = "Demo1234!")
    {
        var (client, csrfToken, csrfCookie) = await CreateClientWithCsrf();

        var regResponse = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password,
            displayName = "Test User"
        });
        var authCookie = ExtractCookie(regResponse);

        var finalClient = CreateClient();
        finalClient.DefaultRequestHeaders.Add("Cookie", $"{csrfCookie}; {authCookie}");
        finalClient.DefaultRequestHeaders.Add("X-CSRF-TOKEN", csrfToken);

        var user = await regResponse.Content.ReadFromJsonAsync<UserInfo>();
        return (finalClient, csrfToken, user!);
    }

    private async Task<(HttpClient Client, string CsrfToken, string CsrfCookie)> CreateClientWithCsrf()
    {
        var client = CreateClient();
        var csrfResponse = await client.GetAsync("/api/auth/csrf-token");
        var csrfBody = await csrfResponse.Content.ReadFromJsonAsync<CsrfTokenResponse>();
        var csrfCookie = ExtractCookie(csrfResponse);
        client.DefaultRequestHeaders.Add("Cookie", csrfCookie);
        client.DefaultRequestHeaders.Add("X-CSRF-TOKEN", csrfBody!.Token);
        return (client, csrfBody!.Token, csrfCookie);
    }

    private static string ExtractCookie(HttpResponseMessage response)
    {
        var setCookie = response.Headers.GetValues("Set-Cookie").First();
        return setCookie.Split(';')[0];
    }

    private sealed record CsrfTokenResponse(string Token);
}
