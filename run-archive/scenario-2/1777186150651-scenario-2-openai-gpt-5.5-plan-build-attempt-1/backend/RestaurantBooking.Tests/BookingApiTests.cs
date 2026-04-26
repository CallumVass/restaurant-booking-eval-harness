using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class BookingApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> factory;

    public BookingApiTests(WebApplicationFactory<Program> factory) => this.factory = factory;

    [Fact]
    public async Task ListsRestaurantsAndAvailabilityThroughHttp()
    {
        using var client = factory.CreateClient();

        var restaurants = await client.GetFromJsonAsync<Restaurant[]>("/api/restaurants");
        Assert.NotNull(restaurants);
        Assert.NotEmpty(restaurants);

        var date = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1).ToString("O");
        var slots = await client.GetFromJsonAsync<AvailabilitySlot[]>($"/api/restaurants/{restaurants[0].Id}/availability?date={date}&partySize=2");

        Assert.NotNull(slots);
        Assert.NotEmpty(slots);
    }

    [Fact]
    public async Task OpenApiDocumentIncludesAuthAndBookings()
    {
        using var client = factory.CreateClient();

        var document = await client.GetStringAsync("/openapi/v1.json");

        Assert.Contains("/api/auth/login", document, StringComparison.Ordinal);
        Assert.Contains("/api/bookings", document, StringComparison.Ordinal);
    }

    [Fact]
    public async Task UnauthenticatedBookingCreateIsRejected()
    {
        using var client = factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/bookings", Request("ember-table"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task LoginRejectsInvalidCredentials()
    {
        using var client = factory.CreateClient();
        var csrf = await GetCsrfToken(client);

        using var request = new HttpRequestMessage(HttpMethod.Post, "/api/auth/login")
        {
            Content = JsonContent.Create(new AuthRequest("demo@example.com", "wrong-password")),
        };
        request.Headers.Add("X-CSRF-TOKEN", csrf);

        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task StateChangingRequestsRequireCsrfToken()
    {
        using var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/login", new AuthRequest(DemoUsers.Email, DemoUsers.Password));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/restaurants/ember-table/availability?date={0}&partySize=0", HttpStatusCode.BadRequest, "InvalidPartySize")]
    [InlineData("/api/restaurants/missing/availability?date={0}&partySize=2", HttpStatusCode.NotFound, "UnknownRestaurant")]
    public async Task AvailabilityMapsBusinessErrors(string path, HttpStatusCode statusCode, string code)
    {
        using var client = factory.CreateClient();
        var date = DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1).ToString("O");

        var response = await client.GetAsync(string.Format(path, date));
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();

        Assert.Equal(statusCode, response.StatusCode);
        Assert.Equal(code, error!.Code);
    }

    [Fact]
    public async Task AuthenticatedUserCanCreateAndListOnlyOwnBookings()
    {
        using var first = factory.CreateClient();
        using var second = factory.CreateClient();
        var firstCsrf = await Login(first, DemoUsers.Email, DemoUsers.Password);
        var secondCsrf = await Register(second, $"guest-{Guid.NewGuid():N}@example.com", "Password123!");

        var createResponse = await SendJson(first, HttpMethod.Post, "/api/bookings", Request("luna-verde"), firstCsrf);
        var secondCreateResponse = await SendJson(second, HttpMethod.Post, "/api/bookings", Request("saffron-court"), secondCsrf);

        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        Assert.Equal(HttpStatusCode.Created, secondCreateResponse.StatusCode);

        var firstBookings = await first.GetFromJsonAsync<BookingDetails[]>("/api/bookings?restaurantId=luna-verde");
        var secondBookings = await second.GetFromJsonAsync<BookingDetails[]>("/api/bookings?restaurantId=luna-verde");

        Assert.Single(firstBookings!);
        Assert.Empty(secondBookings!);
    }

    [Fact]
    public async Task OverlappingReservationReturnsConflictThroughHttp()
    {
        using var client = factory.CreateClient();
        var csrf = await Register(client, $"conflict-{Guid.NewGuid():N}@example.com", "Password123!");
        var request = Request("ember-table", partySize: 6, daysOffset: 2);

        var first = await SendJson(client, HttpMethod.Post, "/api/bookings", request, csrf);
        var second = await SendJson(client, HttpMethod.Post, "/api/bookings", request, csrf);
        var error = await second.Content.ReadFromJsonAsync<ErrorResponse>();

        Assert.Equal(HttpStatusCode.Created, first.StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
        Assert.Equal("OverlappingReservation", error!.Code);
    }

    [Fact]
    public async Task ConcurrentCreatesAllowOnlyOneOverlappingBooking()
    {
        using var first = factory.CreateClient();
        using var second = factory.CreateClient();
        var firstCsrf = await Register(first, $"race-a-{Guid.NewGuid():N}@example.com", "Password123!");
        var secondCsrf = await Register(second, $"race-b-{Guid.NewGuid():N}@example.com", "Password123!");
        var request = Request("saffron-court", partySize: 8, daysOffset: 3);

        var responses = await Task.WhenAll(
            SendJson(first, HttpMethod.Post, "/api/bookings", request, firstCsrf),
            SendJson(second, HttpMethod.Post, "/api/bookings", request, secondCsrf));

        Assert.Single(responses, response => response.StatusCode == HttpStatusCode.Created);
        Assert.Single(responses, response => response.StatusCode == HttpStatusCode.Conflict);
    }

    private static CreateBookingRequest Request(string restaurantId, int partySize = 2, int daysOffset = 1) =>
        new(restaurantId, DateOnly.FromDateTime(DateTime.UtcNow).AddDays(daysOffset), new TimeOnly(17, 0), partySize, "Avery Stone", "avery@example.com");

    private static async Task<string> Login(HttpClient client, string email, string password)
    {
        var csrf = await GetCsrfToken(client);
        var response = await SendJson(client, HttpMethod.Post, "/api/auth/login", new AuthRequest(email, password), csrf);

        response.EnsureSuccessStatusCode();
        return await GetCsrfToken(client);
    }

    private static async Task<string> Register(HttpClient client, string email, string password)
    {
        var csrf = await GetCsrfToken(client);
        var response = await SendJson(client, HttpMethod.Post, "/api/auth/register", new AuthRequest(email, password), csrf);

        response.EnsureSuccessStatusCode();
        return await GetCsrfToken(client);
    }

    private static async Task<string> GetCsrfToken(HttpClient client)
    {
        var response = await client.GetFromJsonAsync<CsrfResponse>("/api/auth/csrf");
        return response!.Token;
    }

    private static Task<HttpResponseMessage> SendJson<T>(HttpClient client, HttpMethod method, string path, T body, string csrf)
    {
        var request = new HttpRequestMessage(method, path)
        {
            Content = JsonContent.Create(body),
        };
        request.Headers.Add("X-CSRF-TOKEN", csrf);
        return client.SendAsync(request);
    }
}
