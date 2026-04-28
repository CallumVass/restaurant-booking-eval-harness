using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class BookingHttpTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> factory;
    private static readonly DateOnly Today = DateOnly.FromDateTime(DateTime.UtcNow);
    private static readonly string TodayStr = Today.ToString("yyyy-MM-dd");
    private static readonly string FutureStr = Today.AddDays(5).ToString("yyyy-MM-dd");

    public BookingHttpTests(WebApplicationFactory<Program> factory)
    {
        this.factory = factory;
    }

    [Fact]
    public async Task OpenApiEndpoint_Returns200()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/openapi/v1.json");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.NotEmpty(body);
        Assert.Contains("openapi", body.ToLowerInvariant());
    }

    [Fact]
    public async Task CreateBooking_InvalidPartySize_Returns400WithCorrectMessage()
    {
        var (client, _, _) = await RegisterAndLogin("httptest_invalidparty@example.com");

        var response = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "ember-table",
            date = FutureStr,
            time = "17:00",
            partySize = 0,
            guestName = "Test",
            guestEmail = "test@example.com"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("InvalidPartySize", error!.Code);
        Assert.Contains("between 1 and 8", error.Message);
    }

    [Fact]
    public async Task CreateBooking_UnknownRestaurant_Returns404WithCorrectMessage()
    {
        var (client, _, _) = await RegisterAndLogin("httptest_unknownrest@example.com");

        var response = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "does-not-exist",
            date = FutureStr,
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
        var (client, _, _) = await RegisterAndLogin("httptest_overlap@example.com");

        var first = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "saffron-court",
            date = FutureStr,
            time = "17:00",
            partySize = 8,
            guestName = "Large Party",
            guestEmail = "test@example.com"
        });
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        var second = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "saffron-court",
            date = FutureStr,
            time = "17:00",
            partySize = 8,
            guestName = "Another Large Party",
            guestEmail = "test@example.com"
        });

        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
        var error = await second.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("OverlappingReservation", error!.Code);
    }

    [Fact]
    public async Task CreateBooking_AdjacentNonOverlapping_BothSucceed()
    {
        var (client, _, _) = await RegisterAndLogin("httptest_adjacent@example.com");

        var first = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "luna-verde",
            date = FutureStr,
            time = "17:00",
            partySize = 2,
            guestName = "Early",
            guestEmail = "test@example.com"
        });
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        var second = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "luna-verde",
            date = FutureStr,
            time = "19:00",
            partySize = 2,
            guestName = "Late",
            guestEmail = "test@example.com"
        });

        Assert.Equal(HttpStatusCode.Created, second.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_PastDate_Returns400()
    {
        var (client, _, _) = await RegisterAndLogin("httptest_pastdate@example.com");
        var pastDate = Today.AddDays(-2).ToString("yyyy-MM-dd");

        var response = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "ember-table",
            date = pastDate,
            time = "17:00",
            partySize = 2,
            guestName = "Test",
            guestEmail = "test@example.com"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("InvalidDate", error!.Code);
    }

    [Fact]
    public async Task CreateBooking_TooFarFutureDate_Returns400()
    {
        var (client, _, _) = await RegisterAndLogin("httptest_farfuture@example.com");
        var farDate = Today.AddDays(31).ToString("yyyy-MM-dd");

        var response = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "ember-table",
            date = farDate,
            time = "17:00",
            partySize = 2,
            guestName = "Test",
            guestEmail = "test@example.com"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("InvalidDate", error!.Code);
    }

    [Fact]
    public async Task CreateBooking_CapacityLimit_Returns409()
    {
        var (client, _, _) = await RegisterAndLogin("httptest_capacity@example.com");

        var first = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "saffron-court",
            date = FutureStr,
            time = "18:00",
            partySize = 4,
            guestName = "Table 1",
            guestEmail = "test@example.com"
        });
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        var second = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "saffron-court",
            date = FutureStr,
            time = "18:00",
            partySize = 4,
            guestName = "Table 2",
            guestEmail = "test@example.com"
        });
        Assert.Equal(HttpStatusCode.Created, second.StatusCode);

        var third = await client.PostAsJsonAsync("/api/bookings", new
        {
            restaurantId = "saffron-court",
            date = FutureStr,
            time = "18:00",
            partySize = 4,
            guestName = "Table 3",
            guestEmail = "test@example.com"
        });

        Assert.Equal(HttpStatusCode.Conflict, third.StatusCode);
        var error = await third.Content.ReadFromJsonAsync<ErrorResponse>();
        Assert.NotNull(error);
        Assert.Equal("OverlappingReservation", error!.Code);
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
