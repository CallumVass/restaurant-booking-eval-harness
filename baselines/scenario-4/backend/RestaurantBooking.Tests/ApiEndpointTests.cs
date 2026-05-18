using System.Net;
using System.Net.Http.Json;
using RestaurantBooking.Api;
using Microsoft.AspNetCore.Mvc.Testing;

namespace RestaurantBooking.Tests;

public sealed class ApiEndpointTests
{
    [Fact]
    public async Task RestaurantsAvailabilityAndOpenApiAreAvailable()
    {
        await using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();

        var restaurants = await client.GetFromJsonAsync<Restaurant[]>("/api/restaurants");
        var openApi = await client.GetStringAsync("/openapi/v1.json");
        var availability = await client.GetAsync($"/api/restaurants/ember-table/availability?date={FutureDate()}&partySize=2");

        Assert.NotNull(restaurants);
        Assert.NotEmpty(restaurants);
        Assert.Contains("/api/auth/login", openApi);
        Assert.Equal(HttpStatusCode.OK, availability.StatusCode);
    }

    [Fact]
    public async Task ProtectedBookingEndpointsRequireAuthentication()
    {
        await using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();

        var list = await client.GetAsync("/api/bookings");
        var create = await PostWithCsrf(client, "/api/bookings", BookingRequest());

        Assert.Equal(HttpStatusCode.Unauthorized, list.StatusCode);
        Assert.Equal(HttpStatusCode.Unauthorized, create.StatusCode);
    }

    [Fact]
    public async Task LoginRejectsInvalidCredentials()
    {
        await using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();

        var response = await PostWithCsrf(client, "/api/auth/login", new AuthRequest(AuthStore.DemoEmail, "wrong-password"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task StateChangingRequestsRequireCsrfToken()
    {
        await using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        await Login(client);

        var response = await client.PostAsJsonAsync("/api/bookings", BookingRequest());
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.NotNull(error);
        Assert.Equal("CsrfValidationFailed", error.Code);
    }

    [Fact]
    public async Task AuthenticatedBookingCreationAndHistoryAreScopedToCurrentUser()
    {
        await using var factory = new WebApplicationFactory<Program>();
        var firstUser = factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        var secondUser = factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        await Login(firstUser);
        await Register(secondUser, $"second-{Guid.NewGuid():N}@restaurant.test");

        var created = await PostWithCsrf(firstUser, "/api/bookings", BookingRequest(restaurantId: "ember-table", time: "17:00:00"));
        var firstHistory = await firstUser.GetFromJsonAsync<Booking[]>("/api/restaurants/ember-table/bookings");
        var secondHistory = await secondUser.GetFromJsonAsync<Booking[]>("/api/restaurants/ember-table/bookings");

        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        Assert.NotNull(firstHistory);
        Assert.Single(firstHistory);
        Assert.NotNull(secondHistory);
        Assert.Empty(secondHistory);
    }

    [Theory]
    [InlineData("/api/bookings", "unknown", "17:00:00", 2, HttpStatusCode.NotFound, "UnknownRestaurant")]
    [InlineData("/api/bookings", "ember-table", "17:00:00", 0, HttpStatusCode.BadRequest, "InvalidPartySize")]
    [InlineData("/api/bookings", "ember-table", "16:30:00", 2, HttpStatusCode.BadRequest, "InvalidTime")]
    public async Task BookingCreationMapsExpectedErrors(string path, string restaurantId, string time, int partySize, HttpStatusCode statusCode, string errorCode)
    {
        await using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        await Login(client);

        var response = await PostWithCsrf(client, path, BookingRequest(restaurantId: restaurantId, time: time, partySize: partySize));
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>();

        Assert.Equal(statusCode, response.StatusCode);
        Assert.NotNull(error);
        Assert.Equal(errorCode, error.Code);
    }

    [Fact]
    public async Task BookingCreationPreventsAtomicOverlappingReservations()
    {
        await using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        await Login(client);
        var request = BookingRequest(restaurantId: "saffron-court", time: "19:00:00", partySize: 8);

        var first = await PostWithCsrf(client, "/api/bookings", request);
        var second = await PostWithCsrf(client, "/api/bookings", request);
        var error = await second.Content.ReadFromJsonAsync<ErrorResponse>();

        Assert.Equal(HttpStatusCode.Created, first.StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
        Assert.NotNull(error);
        Assert.Equal("OverlappingReservation", error.Code);
    }

    private static async Task Login(HttpClient client)
    {
        var response = await PostWithCsrf(client, "/api/auth/login", new AuthRequest(AuthStore.DemoEmail, AuthStore.DemoPassword));
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private static async Task Register(HttpClient client, string email)
    {
        var response = await PostWithCsrf(client, "/api/auth/register", new AuthRequest(email, "Register42!"));
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    private static async Task<HttpResponseMessage> PostWithCsrf<T>(HttpClient client, string path, T body)
    {
        var csrf = await client.GetFromJsonAsync<CsrfResponse>("/api/auth/csrf");
        Assert.NotNull(csrf);
        using var request = new HttpRequestMessage(HttpMethod.Post, path)
        {
            Content = JsonContent.Create(body),
        };
        request.Headers.Add("X-CSRF-TOKEN", csrf.Token);
        return await client.SendAsync(request);
    }

    private static CreateBookingRequest BookingRequest(string restaurantId = "ember-table", string time = "17:00:00", int partySize = 2) =>
        new(restaurantId, FutureDate(), TimeOnly.Parse(time), partySize, "Avery Stone", "avery@example.com");

    private static DateOnly FutureDate() => DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1);
}
