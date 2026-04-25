using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api.Bookings;

namespace RestaurantBooking.Api.Tests;

public sealed class BookingApiTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    private static readonly Guid HarborBistroId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() }
    };

    [Fact]
    public async Task Lists_seeded_restaurants()
    {
        var client = factory.CreateClient();

        var restaurants = await client.GetFromJsonAsync<RestaurantSummary[]>("/api/restaurants");

        Assert.NotNull(restaurants);
        Assert.Contains(restaurants, restaurant => restaurant.Name == "Harbor Bistro" && restaurant.MaxPartySize == 6);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(7)]
    public async Task Rejects_invalid_party_size(int partySize)
    {
        var client = factory.CreateClient();
        var request = NewRequest(partySize, new DateTimeOffset(2030, 1, 5, 17, 0, 0, TimeSpan.Zero));

        var response = await client.PostAsJsonAsync("/api/bookings", request);
        var error = await ReadErrorAsync(response);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal(BookingErrorCode.InvalidPartySize, error?.Code);
    }

    [Theory]
    [InlineData("2020-01-05T17:00:00Z")]
    [InlineData("2030-01-05T16:30:00Z")]
    [InlineData("2030-01-05T17:15:00Z")]
    public async Task Rejects_invalid_booking_times(string startsAt)
    {
        var client = factory.CreateClient();
        var request = NewRequest(2, DateTimeOffset.Parse(startsAt));

        var response = await client.PostAsJsonAsync("/api/bookings", request);
        var error = await ReadErrorAsync(response);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal(BookingErrorCode.InvalidDateTime, error?.Code);
    }

    [Fact]
    public async Task Rejects_unknown_restaurant()
    {
        var client = factory.CreateClient();
        var request = NewRequest(2, new DateTimeOffset(2030, 1, 5, 17, 0, 0, TimeSpan.Zero)) with
        {
            RestaurantId = Guid.Parse("99999999-9999-9999-9999-999999999999")
        };

        var response = await client.PostAsJsonAsync("/api/bookings", request);
        var error = await ReadErrorAsync(response);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Equal(BookingErrorCode.UnknownRestaurant, error?.Code);
    }

    [Fact]
    public async Task Prevents_overlapping_reservations_when_no_capable_table_is_free()
    {
        var client = factory.CreateClient();
        var startsAt = new DateTimeOffset(2030, 1, 6, 18, 0, 0, TimeSpan.Zero);

        var first = await client.PostAsJsonAsync("/api/bookings", NewRequest(6, startsAt));
        var second = await client.PostAsJsonAsync("/api/bookings", NewRequest(6, startsAt.AddMinutes(30)));
        var error = await ReadErrorAsync(second);

        Assert.Equal(HttpStatusCode.Created, first.StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, second.StatusCode);
        Assert.Equal(BookingErrorCode.OverlappingReservation, error?.Code);
    }

    [Fact]
    public async Task Allows_exact_edge_non_overlap()
    {
        var client = factory.CreateClient();
        var startsAt = new DateTimeOffset(2030, 1, 7, 18, 0, 0, TimeSpan.Zero);

        var first = await client.PostAsJsonAsync("/api/bookings", NewRequest(6, startsAt));
        var second = await client.PostAsJsonAsync("/api/bookings", NewRequest(6, startsAt.Add(BookingRules.BookingDuration)));

        Assert.Equal(HttpStatusCode.Created, first.StatusCode);
        Assert.Equal(HttpStatusCode.Created, second.StatusCode);
    }

    [Fact]
    public async Task Availability_excludes_reserved_overlapping_slots()
    {
        var client = factory.CreateClient();
        var startsAt = new DateTimeOffset(2030, 1, 8, 18, 0, 0, TimeSpan.Zero);
        await client.PostAsJsonAsync("/api/bookings", NewRequest(6, startsAt));

        var slots = await client.GetFromJsonAsync<AvailabilitySlot[]>($"/api/restaurants/{HarborBistroId}/availability?date=2030-01-08&partySize=6");

        Assert.NotNull(slots);
        Assert.DoesNotContain(slots, slot => slot.StartsAt == startsAt);
        Assert.Contains(slots, slot => slot.StartsAt == startsAt.Add(BookingRules.BookingDuration));
    }

    [Fact]
    public async Task Lists_existing_bookings_after_confirmation()
    {
        var client = factory.CreateClient();
        var startsAt = new DateTimeOffset(2030, 1, 9, 19, 0, 0, TimeSpan.Zero);
        var response = await client.PostAsJsonAsync("/api/bookings", NewRequest(4, startsAt));
        var confirmation = await response.Content.ReadFromJsonAsync<BookingConfirmation>();

        var bookings = await client.GetFromJsonAsync<BookingConfirmation[]>("/api/bookings");

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(confirmation);
        Assert.NotNull(bookings);
        Assert.Contains(bookings, booking => booking.Id == confirmation.Id);
    }

    private static BookingRequest NewRequest(int partySize, DateTimeOffset startsAt) => new(
        HarborBistroId,
        "Ada Lovelace",
        partySize,
        startsAt);

    private static Task<BookingError?> ReadErrorAsync(HttpResponseMessage response) =>
        response.Content.ReadFromJsonAsync<BookingError>(JsonOptions);
}
