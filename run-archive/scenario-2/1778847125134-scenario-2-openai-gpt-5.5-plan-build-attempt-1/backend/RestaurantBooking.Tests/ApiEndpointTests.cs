using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class ApiEndpointTests : IDisposable
{
    private readonly WebApplicationFactory<Program> factory = new();
    private readonly JsonSerializerOptions jsonOptions = new(JsonSerializerDefaults.Web);

    public void Dispose()
    {
        factory.Dispose();
    }

    [Fact]
    public async Task OpenApiAndPublicRestaurantAndAvailabilityEndpointsWork()
    {
        var client = factory.CreateClient();

        var openApi = await client.GetAsync("/openapi/v1.json");
        var restaurants = await client.GetFromJsonAsync<Restaurant[]>("/api/restaurants", jsonOptions);
        var availability = await client.GetAsync($"/api/restaurants/ember-table/availability?date={DateOnly.FromDateTime(DateTime.UtcNow):yyyy-MM-dd}&partySize=2");

        Assert.Equal(HttpStatusCode.OK, openApi.StatusCode);
        Assert.NotEmpty(restaurants!);
        Assert.Equal(HttpStatusCode.OK, availability.StatusCode);
    }

    [Fact]
    public async Task BookingCreationRequiresAuthenticationAndCsrf()
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        var request = ValidBooking();

        var unauthenticated = await client.PostAsJsonAsync("/api/bookings", request, jsonOptions);
        await Login(client, "demo@example.com", "Password123!");
        var missingCsrf = await client.PostAsJsonAsync("/api/bookings", request, jsonOptions);

        Assert.Equal(HttpStatusCode.Unauthorized, unauthenticated.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, missingCsrf.StatusCode);
    }

    [Fact]
    public async Task AuthenticatedBookingHistoryIsScopedToCurrentUserAndRestaurant()
    {
        var first = factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        var second = factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        await Login(first, "demo@example.com", "Password123!");
        await Login(second, "riley@example.com", "Password123!");

        var created = await PostWithCsrf(first, "/api/bookings", ValidBooking(guestEmail: "demo@example.com"));
        var firstHistory = await first.GetFromJsonAsync<Booking[]>("/api/restaurants/ember-table/bookings", jsonOptions);
        var secondHistory = await second.GetFromJsonAsync<Booking[]>("/api/restaurants/ember-table/bookings", jsonOptions);

        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
        Assert.Single(firstHistory!);
        Assert.Empty(secondHistory!);
    }

    [Fact]
    public async Task InvalidLoginAndBusinessErrorsMapToUsefulHttpStatuses()
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });

        var invalidLogin = await PostWithCsrf(client, "/api/auth/login", new AuthRequest("demo@example.com", "wrong-password"));
        await Login(client, "demo@example.com", "Password123!");
        var invalidParty = await PostWithCsrf(client, "/api/bookings", ValidBooking(partySize: 9));
        var unknownRestaurant = await PostWithCsrf(client, "/api/bookings", ValidBooking(restaurantId: "missing"));

        Assert.Equal(HttpStatusCode.BadRequest, invalidLogin.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, invalidParty.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, unknownRestaurant.StatusCode);
    }

    [Fact]
    public async Task AtomicConflictPreventionReturnsConflict()
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { HandleCookies = true });
        await Login(client, "demo@example.com", "Password123!");

        var first = await PostWithCsrf(client, "/api/bookings", ValidBooking(partySize: 6));
        var second = await PostWithCsrf(client, "/api/bookings", ValidBooking(partySize: 6));

        Assert.Equal(HttpStatusCode.Created, first.StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
    }

    private async Task Login(HttpClient client, string email, string password)
    {
        var response = await PostWithCsrf(client, "/api/auth/login", new AuthRequest(email, password));
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private async Task<HttpResponseMessage> PostWithCsrf<T>(HttpClient client, string url, T body)
    {
        using var csrfResponse = await client.GetAsync("/api/auth/csrf");
        var csrf = await csrfResponse.Content.ReadFromJsonAsync<CsrfResponse>(jsonOptions);
        using var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = JsonContent.Create(body, options: jsonOptions),
        };
        request.Headers.Add("X-CSRF-TOKEN", csrf!.Token);
        return await client.SendAsync(request);
    }

    private static CreateBookingRequest ValidBooking(string restaurantId = "ember-table", int partySize = 2, string guestEmail = "guest@example.com") =>
        new(restaurantId, DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1), new TimeOnly(17, 0), partySize, "Avery Stone", guestEmail);
}
