using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api;

namespace RestaurantBooking.Tests;

public sealed class AuthEndpointsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> factory;

    public AuthEndpointsTests(WebApplicationFactory<Program> factory)
    {
        this.factory = factory;
    }

    [Fact]
    public async Task Register_Returns200AndSetsCookie()
    {
        var (client, csrfToken) = await CreateClientWithCsrf();
        var response = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email = "newuser@example.com",
            password = "Demo1234!",
            displayName = "New User"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains(response.Headers, h => h.Key == "Set-Cookie");

        var user = await response.Content.ReadFromJsonAsync<UserInfo>();
        Assert.NotNull(user);
        Assert.Equal("newuser@example.com", user!.Email);
        Assert.Equal("New User", user.DisplayName);
        Assert.NotEmpty(user.Id);
    }

    [Fact]
    public async Task Register_DuplicateEmail_Returns409()
    {
        var (client, csrfToken) = await CreateClientWithCsrf();
        await client.PostAsJsonAsync("/api/auth/register", new
        {
            email = "dupe@example.com",
            password = "Demo1234!",
            displayName = "First"
        });

        var (client2, csrfToken2) = await CreateClientWithCsrf();
        var response2 = await client2.PostAsJsonAsync("/api/auth/register", new
        {
            email = "dupe@example.com",
            password = "Demo1234!",
            displayName = "Second"
        });

        Assert.Equal(HttpStatusCode.Conflict, response2.StatusCode);
    }

    [Fact]
    public async Task Login_WithValidCredentials_Returns200AndSetsCookie()
    {
        var (client, csrfToken) = await CreateClientWithCsrf();
        var email = "logintest@example.com";
        await client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password = "Demo1234!",
            displayName = "Login Test"
        });

        var (loginClient, loginCsrf) = await CreateClientWithCsrf();
        var loginResponse = await loginClient.PostAsJsonAsync("/api/auth/login", new
        {
            email,
            password = "Demo1234!"
        });

        Assert.Equal(HttpStatusCode.OK, loginResponse.StatusCode);
        Assert.Contains(loginResponse.Headers, h => h.Key == "Set-Cookie");

        var user = await loginResponse.Content.ReadFromJsonAsync<UserInfo>();
        Assert.NotNull(user);
        Assert.Equal(email, user!.Email);
    }

    [Fact]
    public async Task Login_WithWrongPassword_Returns401()
    {
        var (client, csrfToken) = await CreateClientWithCsrf();
        var email = "wrongpw@example.com";
        await client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password = "Demo1234!",
            displayName = "Wrong PW"
        });

        var (loginClient, loginCsrf) = await CreateClientWithCsrf();
        var loginResponse = await loginClient.PostAsJsonAsync("/api/auth/login", new
        {
            email,
            password = "WrongPassword!"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, loginResponse.StatusCode);
    }

    [Fact]
    public async Task Login_WithUnknownEmail_Returns401()
    {
        var (client, csrfToken) = await CreateClientWithCsrf();
        var loginResponse = await client.PostAsJsonAsync("/api/auth/login", new
        {
            email = "nonexistent@example.com",
            password = "Demo1234!"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, loginResponse.StatusCode);
    }

    [Fact]
    public async Task Me_Authenticated_Returns200WithUserInfo()
    {
        var (client, csrfToken, user) = await RegisterAndLogin("meauth_auth@example.com");

        var meResponse = await client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.OK, meResponse.StatusCode);
        var me = await meResponse.Content.ReadFromJsonAsync<UserInfo>();
        Assert.NotNull(me);
        Assert.Equal("meauth_auth@example.com", me!.Email);
    }

    [Fact]
    public async Task Me_Unauthenticated_Returns401()
    {
        var client = CreateClient();
        var meResponse = await client.GetAsync("/api/auth/me");

        Assert.Equal(HttpStatusCode.Unauthorized, meResponse.StatusCode);
    }

    [Fact]
    public async Task Logout_ClearsCookie()
    {
        var (client, csrfToken, user) = await RegisterAndLogin("logouttest_auth@example.com");

        var logoutResponse = await client.PostAsync("/api/auth/logout", null);

        Assert.Equal(HttpStatusCode.OK, logoutResponse.StatusCode);

        var setCookie = logoutResponse.Headers.GetValues("Set-Cookie").FirstOrDefault();
        Assert.NotNull(setCookie);
        Assert.Contains(".AspNetCore.Cookies=; expires=", setCookie, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task GetCsrfToken_ReturnsTokenAndSetsCookie()
    {
        var client = CreateClient();
        var response = await client.GetAsync("/api/auth/csrf-token");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<CsrfTokenResponse>();
        Assert.NotNull(body);
        Assert.NotEmpty(body!.Token);

        Assert.Contains(response.Headers, h =>
            h.Key == "Set-Cookie" && h.Value.Any(v => v.Contains(".AspNetCore.Antiforgery")));
    }

    private HttpClient CreateClient() => factory.CreateClient(new WebApplicationFactoryClientOptions
    {
        AllowAutoRedirect = false,
    });

    private async Task<(HttpClient Client, string CsrfToken)> CreateClientWithCsrf()
    {
        var client = CreateClient();
        var csrfResponse = await client.GetAsync("/api/auth/csrf-token");
        var csrfBody = await csrfResponse.Content.ReadFromJsonAsync<CsrfTokenResponse>();
        var csrfCookie = ExtractCookie(csrfResponse);
        client.DefaultRequestHeaders.Add("Cookie", csrfCookie);
        client.DefaultRequestHeaders.Add("X-CSRF-TOKEN", csrfBody!.Token);
        return (client, csrfBody!.Token);
    }

    private async Task<(HttpClient Client, string CsrfToken, UserInfo User)> RegisterAndLogin(string email, string password = "Demo1234!")
    {
        var (client, csrfToken) = await CreateClientWithCsrf();
        var registerResponse = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email,
            password,
            displayName = "Test User"
        });

        var authCookie = ExtractCookie(registerResponse);
        client.DefaultRequestHeaders.Remove("Cookie");

        var (client2, csrfToken2) = await CreateClientWithCsrf();
        client2.DefaultRequestHeaders.Add("X-CSRF-TOKEN", csrfToken2);

        var loginResponse = await client2.PostAsJsonAsync("/api/auth/login", new
        {
            email,
            password
        });

        var loginCookie = ExtractCookie(loginResponse);
        client2.DefaultRequestHeaders.Remove("Cookie");
        client2.DefaultRequestHeaders.Add("Cookie", loginCookie);

        var user = await loginResponse.Content.ReadFromJsonAsync<UserInfo>();
        return (client2, csrfToken2, user!);
    }

    private static string ExtractCookie(HttpResponseMessage response)
    {
        var setCookie = response.Headers.GetValues("Set-Cookie").First();
        return setCookie.Split(';')[0];
    }

    private sealed record CsrfTokenResponse(string Token);
}
