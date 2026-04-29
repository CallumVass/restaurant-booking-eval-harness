using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class AuthIntegrationTests
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) },
    };

    private static readonly DateOnly Today = DateOnly.FromDateTime(DateTime.UtcNow);
    private static readonly string TomorrowString = Today.AddDays(1).ToString("yyyy-MM-dd");

    private sealed class CookieHandler(HttpMessageHandler inner, CookieContainer container) : DelegatingHandler(inner)
    {
        private readonly CookieContainer _container = container;

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken ct)
        {
            var uri = request.RequestUri ?? new Uri("http://localhost/");
            var cookieHeader = _container.GetCookieHeader(uri);
            if (!string.IsNullOrEmpty(cookieHeader))
                request.Headers.Add("Cookie", cookieHeader);

            var response = await base.SendAsync(request, ct);

            if (response.Headers.TryGetValues("Set-Cookie", out var setCookieHeaders))
            {
                foreach (var setCookie in setCookieHeaders)
                {
                    try { _container.SetCookies(uri, setCookie); } catch { }
                }
            }

            return response;
        }
    }

    private static HttpClient CreateClient(WebApplicationFactory<Program> factory, CookieContainer cookies)
    {
        var handler = new CookieHandler(factory.Server.CreateHandler(), cookies);
        return new HttpClient(handler) { BaseAddress = new Uri("http://localhost") };
    }

    private static async Task<string> GetCsrfTokenAsync(HttpClient client)
    {
        var response = await client.GetAsync("/api/antiforgery/token");
        response.EnsureSuccessStatusCode();
        var json = await response.Content.ReadFromJsonAsync<JsonElement>(JsonOptions);
        return json.GetProperty("token").GetString()!;
    }

    private static WebApplicationFactory<Program> CreateFactory()
    {
        var dbName = $"AuthTestDb_{Guid.NewGuid():N}";
        return new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor is not null)
                    services.Remove(descriptor);
                services.AddDbContext<AppDbContext>(opts =>
                    opts.UseInMemoryDatabase(dbName));
            });
        });
    }

    private static async Task<UserInfo> LoginAsync(HttpClient client, string email, string password)
    {
        var csrf = await GetCsrfTokenAsync(client);
        var loginRequest = new LoginRequest(email, password);
        var msg = new HttpRequestMessage(HttpMethod.Post, "/api/auth/login")
        {
            Content = JsonContent.Create(loginRequest, options: JsonOptions),
        };
        msg.Headers.Add("X-CSRF-TOKEN", csrf);
        var response = await client.SendAsync(msg);
        response.EnsureSuccessStatusCode();
        return (await response.Content.ReadFromJsonAsync<UserInfo>(JsonOptions))!;
    }

    // ==================== REGISTRATION ====================

    [Fact]
    public async Task Register_ValidRequest_Returns200()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        var csrf = await GetCsrfTokenAsync(client);
        var request = new RegisterRequest("newuser@example.com", "NewUser123!");
        var msg = new HttpRequestMessage(HttpMethod.Post, "/api/auth/register")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        msg.Headers.Add("X-CSRF-TOKEN", csrf);

        var response = await client.SendAsync(msg);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var userInfo = await response.Content.ReadFromJsonAsync<UserInfo>(JsonOptions);
        Assert.NotNull(userInfo);
        Assert.Equal("newuser@example.com", userInfo.Email);
        Assert.NotEmpty(userInfo.Id);

        var loggedInUser = await LoginAsync(client, "newuser@example.com", "NewUser123!");
        Assert.Equal(userInfo.Id, loggedInUser.Id);
    }

    [Fact]
    public async Task Register_DuplicateEmail_Returns400()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        var csrf1 = await GetCsrfTokenAsync(client);
        var request1 = new RegisterRequest("dup@example.com", "Demo1234!");
        var msg1 = new HttpRequestMessage(HttpMethod.Post, "/api/auth/register")
        {
            Content = JsonContent.Create(request1, options: JsonOptions),
        };
        msg1.Headers.Add("X-CSRF-TOKEN", csrf1);
        var response1 = await client.SendAsync(msg1);
        Assert.Equal(HttpStatusCode.OK, response1.StatusCode);

        var csrf2 = await GetCsrfTokenAsync(client);
        var request2 = new RegisterRequest("dup@example.com", "OtherPass1!");
        var msg2 = new HttpRequestMessage(HttpMethod.Post, "/api/auth/register")
        {
            Content = JsonContent.Create(request2, options: JsonOptions),
        };
        msg2.Headers.Add("X-CSRF-TOKEN", csrf2);
        var response2 = await client.SendAsync(msg2);

        Assert.Equal(HttpStatusCode.BadRequest, response2.StatusCode);
        var error = await response2.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("DuplicateEmail", error.Code);
    }

    [Fact]
    public async Task Register_InvalidEmail_Returns400()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        var csrf = await GetCsrfTokenAsync(client);
        var request = new RegisterRequest("not-an-email", "Demo1234!");
        var msg = new HttpRequestMessage(HttpMethod.Post, "/api/auth/register")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        msg.Headers.Add("X-CSRF-TOKEN", csrf);

        var response = await client.SendAsync(msg);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("InvalidEmail", error.Code);
    }

    // ==================== LOGIN ====================

    [Fact]
    public async Task Login_ValidCredentials_Returns200AndSetsCookie()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        var csrf = await GetCsrfTokenAsync(client);
        var request = new LoginRequest("alice@example.com", "Demo1234!");
        var msg = new HttpRequestMessage(HttpMethod.Post, "/api/auth/login")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        msg.Headers.Add("X-CSRF-TOKEN", csrf);

        var response = await client.SendAsync(msg);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var cookiesForUri = cookies.GetCookies(new Uri("http://localhost/"));
        var identityCookie = cookiesForUri
            .FirstOrDefault(c => c.Name.StartsWith(".AspNetCore.Identity.Application", StringComparison.Ordinal));
        Assert.NotNull(identityCookie);
        Assert.True(identityCookie.HttpOnly);
    }

    [Fact]
    public async Task Login_WrongPassword_Returns401()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        var csrf = await GetCsrfTokenAsync(client);
        var request = new LoginRequest("alice@example.com", "WrongPassword1!");
        var msg = new HttpRequestMessage(HttpMethod.Post, "/api/auth/login")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        msg.Headers.Add("X-CSRF-TOKEN", csrf);

        var response = await client.SendAsync(msg);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_UnknownEmail_Returns401()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        var csrf = await GetCsrfTokenAsync(client);
        var request = new LoginRequest("nonexistent@example.com", "Password123!");
        var msg = new HttpRequestMessage(HttpMethod.Post, "/api/auth/login")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        msg.Headers.Add("X-CSRF-TOKEN", csrf);

        var response = await client.SendAsync(msg);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ==================== ME ====================

    [Fact]
    public async Task Me_Authenticated_ReturnsUserInfo()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        var user = await LoginAsync(client, "alice@example.com", "Demo1234!");

        var meResponse = await client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.OK, meResponse.StatusCode);

        var meInfo = await meResponse.Content.ReadFromJsonAsync<UserInfo>(JsonOptions);
        Assert.NotNull(meInfo);
        Assert.Equal(user.Id, meInfo.Id);
        Assert.Equal("alice@example.com", meInfo.Email);
    }

    [Fact]
    public async Task Me_Anonymous_Returns200WithNullBody()
    {
        using var factory = CreateFactory();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadAsStringAsync();
        Assert.True(string.IsNullOrEmpty(content) || content.Trim() == "null",
            $"Expected empty/null body but got: '{content}'");
    }

    // ==================== LOGOUT ====================

    [Fact]
    public async Task Logout_ClearsCookie_ThenMeIsAnonymous()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        await LoginAsync(client, "alice@example.com", "Demo1234!");

        var csrf = await GetCsrfTokenAsync(client);
        var logoutMsg = new HttpRequestMessage(HttpMethod.Post, "/api/auth/logout");
        logoutMsg.Headers.Add("X-CSRF-TOKEN", csrf);
        var logoutResponse = await client.SendAsync(logoutMsg);
        Assert.Equal(HttpStatusCode.OK, logoutResponse.StatusCode);

        var meResponse = await client.GetAsync("/api/auth/me");
        var content = await meResponse.Content.ReadAsStringAsync();
        Assert.True(string.IsNullOrEmpty(content) || content.Trim() == "null",
            $"Expected empty/null body but got: '{content}'");
    }

    // ==================== BOOKING AUTH BOUNDARIES ====================

    [Fact]
    public async Task CreateBooking_Unauthenticated_Returns401()
    {
        using var factory = CreateFactory();
        var client = factory.CreateClient();
        var request = new CreateBookingRequest(
            "ember-table", Today, new TimeOnly(17, 0), 2, "Avery Stone", "avery@example.com");

        var response = await client.PostAsJsonAsync("/api/bookings", request, JsonOptions);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_MissingCsrf_Returns400()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        await LoginAsync(client, "alice@example.com", "Demo1234!");

        var request = new CreateBookingRequest(
            "ember-table", Today, new TimeOnly(17, 0), 2, "Avery Stone", "avery@example.com");
        var msg = new HttpRequestMessage(HttpMethod.Post, "/api/bookings")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        var response = await client.SendAsync(msg);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("CsrfTokenMissing", error.Code);
    }

    [Fact]
    public async Task CreateBooking_AuthenticatedWithCsrf_Returns201()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        var user = await LoginAsync(client, "alice@example.com", "Demo1234!");

        var csrf = await GetCsrfTokenAsync(client);
        var request = new CreateBookingRequest(
            "ember-table", Today, new TimeOnly(17, 0), 2, "Avery Stone", "avery@example.com");
        var msg = new HttpRequestMessage(HttpMethod.Post, "/api/bookings")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        msg.Headers.Add("X-CSRF-TOKEN", csrf);
        var response = await client.SendAsync(msg);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var booking = await response.Content.ReadFromJsonAsync<Booking>(JsonOptions);
        Assert.NotNull(booking);
        Assert.NotEmpty(booking.Id);
        Assert.Equal("ember-table", booking.RestaurantId);
        Assert.Equal(user.Id, booking.UserId);
    }

    // ==================== BOOKING HISTORY ====================

    [Fact]
    public async Task ListBookingsMine_Unauthenticated_Returns401()
    {
        using var factory = CreateFactory();
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/bookings/mine");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ListBookingsMine_Authenticated_ReturnsOwnBookings()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        var user = await LoginAsync(client, "alice@example.com", "Demo1234!");
        var csrf = await GetCsrfTokenAsync(client);

        var createRequest = new CreateBookingRequest(
            "ember-table", Today, new TimeOnly(17, 0), 2, "Alice", "alice@example.com");
        var createMsg = new HttpRequestMessage(HttpMethod.Post, "/api/bookings")
        {
            Content = JsonContent.Create(createRequest, options: JsonOptions),
        };
        createMsg.Headers.Add("X-CSRF-TOKEN", csrf);
        var createResponse = await client.SendAsync(createMsg);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var listResponse = await client.GetAsync("/api/bookings/mine");
        Assert.Equal(HttpStatusCode.OK, listResponse.StatusCode);

        var bookings = await listResponse.Content.ReadFromJsonAsync<Booking[]>(JsonOptions);
        Assert.NotNull(bookings);
        Assert.NotEmpty(bookings);
        Assert.All(bookings, b => Assert.Equal(user.Id, b.UserId));
    }

    [Fact]
    public async Task ListBookingsMine_UserIsolation()
    {
        using var factory = CreateFactory();

        // Alice creates a booking
        var aliceCookies = new CookieContainer();
        var aliceClient = CreateClient(factory, aliceCookies);
        var aliceUser = await LoginAsync(aliceClient, "alice@example.com", "Demo1234!");

        var aliceCsrf = await GetCsrfTokenAsync(aliceClient);
        var aliceBookingReq = new CreateBookingRequest(
            "ember-table", Today, new TimeOnly(17, 0), 2, "Alice", "alice@example.com");
        var aliceMsg = new HttpRequestMessage(HttpMethod.Post, "/api/bookings")
        {
            Content = JsonContent.Create(aliceBookingReq, options: JsonOptions),
        };
        aliceMsg.Headers.Add("X-CSRF-TOKEN", aliceCsrf);
        var aliceCreateResponse = await aliceClient.SendAsync(aliceMsg);
        Assert.Equal(HttpStatusCode.Created, aliceCreateResponse.StatusCode);
        var aliceBooking = await aliceCreateResponse.Content.ReadFromJsonAsync<Booking>(JsonOptions);
        Assert.NotNull(aliceBooking);

        // Bob creates a booking
        var bobCookies = new CookieContainer();
        var bobClient = CreateClient(factory, bobCookies);
        await LoginAsync(bobClient, "bob@example.com", "Demo1234!");

        var bobCsrf = await GetCsrfTokenAsync(bobClient);
        var bobBookingReq = new CreateBookingRequest(
            "luna-verde", Today, new TimeOnly(18, 0), 2, "Bob", "bob@example.com");
        var bobMsg = new HttpRequestMessage(HttpMethod.Post, "/api/bookings")
        {
            Content = JsonContent.Create(bobBookingReq, options: JsonOptions),
        };
        bobMsg.Headers.Add("X-CSRF-TOKEN", bobCsrf);
        var bobCreateResponse = await bobClient.SendAsync(bobMsg);
        Assert.Equal(HttpStatusCode.Created, bobCreateResponse.StatusCode);
        var bobBooking = await bobCreateResponse.Content.ReadFromJsonAsync<Booking>(JsonOptions);
        Assert.NotNull(bobBooking);

        // Alice sees only her booking
        var aliceListResponse = await aliceClient.GetAsync("/api/bookings/mine");
        var aliceBookings = await aliceListResponse.Content.ReadFromJsonAsync<Booking[]>(JsonOptions);
        Assert.NotNull(aliceBookings);
        Assert.Contains(aliceBookings, b => b.Id == aliceBooking.Id);
        Assert.DoesNotContain(aliceBookings, b => b.Id == bobBooking.Id);

        // Bob sees only his booking
        var bobListResponse = await bobClient.GetAsync("/api/bookings/mine");
        var bobBookings = await bobListResponse.Content.ReadFromJsonAsync<Booking[]>(JsonOptions);
        Assert.NotNull(bobBookings);
        Assert.Contains(bobBookings, b => b.Id == bobBooking.Id);
        Assert.DoesNotContain(bobBookings, b => b.Id == aliceBooking.Id);
    }

    // ==================== PUBLIC ENDPOINT ACCESSIBILITY ====================

    [Fact]
    public async Task Restaurants_PublicAccess_Returns200()
    {
        using var factory = CreateFactory();
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/restaurants");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Availability_PublicAccess_Returns200()
    {
        using var factory = CreateFactory();
        var client = factory.CreateClient();
        var response = await client.GetAsync(
            $"/api/restaurants/ember-table/availability?date={TomorrowString}&partySize=2");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    // ==================== DOMAIN ERROR MAPPING UNDER AUTH ====================

    [Fact]
    public async Task CreateBooking_WithAuth_InvalidPartySize_Returns400()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        await LoginAsync(client, "alice@example.com", "Demo1234!");
        var csrf = await GetCsrfTokenAsync(client);

        var request = new CreateBookingRequest(
            "ember-table", Today, new TimeOnly(17, 0), 0, "Avery", "avery@example.com");
        var msg = new HttpRequestMessage(HttpMethod.Post, "/api/bookings")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        msg.Headers.Add("X-CSRF-TOKEN", csrf);
        var response = await client.SendAsync(msg);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("InvalidPartySize", error.Code);
    }

    [Fact]
    public async Task CreateBooking_WithAuth_UnknownRestaurant_Returns404()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        await LoginAsync(client, "alice@example.com", "Demo1234!");
        var csrf = await GetCsrfTokenAsync(client);

        var request = new CreateBookingRequest(
            "unknown-place", Today, new TimeOnly(17, 0), 2, "Avery", "avery@example.com");
        var msg = new HttpRequestMessage(HttpMethod.Post, "/api/bookings")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        msg.Headers.Add("X-CSRF-TOKEN", csrf);
        var response = await client.SendAsync(msg);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var error = await response.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("UnknownRestaurant", error.Code);
    }

    [Fact]
    public async Task CreateBooking_WithAuth_OverlappingReservation_Returns409()
    {
        using var factory = CreateFactory();
        var cookies = new CookieContainer();
        var client = CreateClient(factory, cookies);

        await LoginAsync(client, "alice@example.com", "Demo1234!");
        var csrf = await GetCsrfTokenAsync(client);

        var request = new CreateBookingRequest(
            "saffron-court", Today, new TimeOnly(17, 0), 8, "Alice", "alice@example.com");

        var msg1 = new HttpRequestMessage(HttpMethod.Post, "/api/bookings")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        msg1.Headers.Add("X-CSRF-TOKEN", csrf);
        var response1 = await client.SendAsync(msg1);
        Assert.Equal(HttpStatusCode.Created, response1.StatusCode);

        csrf = await GetCsrfTokenAsync(client);
        var msg2 = new HttpRequestMessage(HttpMethod.Post, "/api/bookings")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        msg2.Headers.Add("X-CSRF-TOKEN", csrf);
        var response2 = await client.SendAsync(msg2);

        Assert.Equal(HttpStatusCode.Conflict, response2.StatusCode);
        var error = await response2.Content.ReadFromJsonAsync<ErrorResponse>(JsonOptions);
        Assert.NotNull(error);
        Assert.Equal("OverlappingReservation", error.Code);
    }

    // ==================== OPENAPI ====================

    [Fact]
    public async Task OpenApiDocument_IncludesAuthPaths()
    {
        using var factory = CreateFactory();
        var client = factory.CreateClient();
        var response = await client.GetAsync("/openapi/v1.json");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var doc = await response.Content.ReadFromJsonAsync<JsonDocument>();
        Assert.NotNull(doc);

        var paths = doc.RootElement.GetProperty("paths");
        Assert.True(paths.TryGetProperty("/api/auth/register", out _));
        Assert.True(paths.TryGetProperty("/api/auth/login", out _));
        Assert.True(paths.TryGetProperty("/api/auth/logout", out _));
        Assert.True(paths.TryGetProperty("/api/auth/me", out _));
        Assert.True(paths.TryGetProperty("/api/bookings/mine", out _));
    }

    // ==================== SEEDED DEMO USERS ====================

    [Fact]
    public async Task SeededDemoUsers_CanLogin()
    {
        using var factory = CreateFactory();

        var aliceCookies = new CookieContainer();
        var aliceClient = CreateClient(factory, aliceCookies);
        var aliceUser = await LoginAsync(aliceClient, "alice@example.com", "Demo1234!");
        Assert.Equal("alice@example.com", aliceUser.Email);

        var bobCookies = new CookieContainer();
        var bobClient = CreateClient(factory, bobCookies);
        var bobUser = await LoginAsync(bobClient, "bob@example.com", "Demo1234!");
        Assert.Equal("bob@example.com", bobUser.Email);
    }

    // ==================== CSRF ON ALL STATE-CHANGING ENDPOINTS ====================

    [Fact]
    public async Task CsrfRequired_OnLogin()
    {
        using var factory = CreateFactory();
        var client = factory.CreateClient();
        var request = new LoginRequest("alice@example.com", "Demo1234!");
        var msg = new HttpRequestMessage(HttpMethod.Post, "/api/auth/login")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        var response = await client.SendAsync(msg);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CsrfRequired_OnRegister()
    {
        using var factory = CreateFactory();
        var client = factory.CreateClient();
        var request = new RegisterRequest("test@example.com", "Test1234!");
        var msg = new HttpRequestMessage(HttpMethod.Post, "/api/auth/register")
        {
            Content = JsonContent.Create(request, options: JsonOptions),
        };
        var response = await client.SendAsync(msg);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CsrfRequired_OnLogout()
    {
        using var factory = CreateFactory();
        var client = factory.CreateClient();
        var msg = new HttpRequestMessage(HttpMethod.Post, "/api/auth/logout");
        var response = await client.SendAsync(msg);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
