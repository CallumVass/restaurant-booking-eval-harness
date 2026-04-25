using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using RestaurantBooking.Api.Features.Availability;
using RestaurantBooking.Api.Features.Bookings;
using RestaurantBooking.Api.Features.Restaurants;

namespace RestaurantBooking.Tests;

public sealed class BookingApiTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient client = factory.CreateClient();

    [Fact]
    public async Task Restaurants_are_listed_with_table_metadata()
    {
        var restaurants = await client.GetFromJsonAsync<RestaurantResponse[]>("/api/restaurants");

        Assert.NotNull(restaurants);
        Assert.Contains(restaurants, restaurant => restaurant.Id == "harbor" && restaurant.Tables.Count > 0);
    }

    [Fact]
    public async Task Availability_rejects_invalid_party_size()
    {
        var response = await client.GetAsync("/api/restaurants/harbor/availability?date=2026-05-01&partySize=0");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Availability_rejects_invalid_date()
    {
        var response = await client.GetAsync("/api/restaurants/harbor/availability?date=2025-12-31&partySize=2");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Availability_rejects_unknown_restaurant()
    {
        var response = await client.GetAsync("/api/restaurants/missing/availability?date=2026-05-01&partySize=2");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Availability_filters_overlapping_seed_booking()
    {
        var slots = await client.GetFromJsonAsync<SlotResponse[]>("/api/restaurants/harbor/availability?date=2026-05-01&partySize=4");

        Assert.NotNull(slots);
        var sixPm = Assert.Single(slots, slot => slot.StartTime == "18:00");
        Assert.Equal(2, sixPm.AvailableTables);
    }

    [Fact]
    public async Task Booking_rejects_invalid_time()
    {
        var response = await client.PostAsJsonAsync("/api/bookings", ValidRequest() with { StartTime = "18:15" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Booking_rejects_unknown_restaurant()
    {
        var response = await client.PostAsJsonAsync("/api/bookings", ValidRequest() with { RestaurantId = "missing" });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Booking_rejects_invalid_party_size()
    {
        var response = await client.PostAsJsonAsync("/api/bookings", ValidRequest() with { PartySize = 0 });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Booking_rejects_party_too_large()
    {
        var response = await client.PostAsJsonAsync("/api/bookings", ValidRequest() with { PartySize = 12 });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Booking_prevents_overlapping_reservations_but_allows_adjacent_reservations()
    {
        var first = await client.PostAsJsonAsync("/api/bookings", ValidRequest() with { RestaurantId = "garden", Date = new DateOnly(2026, 6, 2), StartTime = "18:00", PartySize = 8 });
        Assert.Equal(HttpStatusCode.Created, first.StatusCode);

        var overlap = await client.PostAsJsonAsync("/api/bookings", ValidRequest() with { RestaurantId = "garden", Date = new DateOnly(2026, 6, 2), StartTime = "18:30", PartySize = 8 });
        Assert.Equal(HttpStatusCode.BadRequest, overlap.StatusCode);

        var adjacent = await client.PostAsJsonAsync("/api/bookings", ValidRequest() with { RestaurantId = "garden", Date = new DateOnly(2026, 6, 2), StartTime = "19:30", PartySize = 8 });
        Assert.Equal(HttpStatusCode.Created, adjacent.StatusCode);
    }

    [Fact]
    public async Task Created_bookings_appear_in_booking_list()
    {
        var create = await client.PostAsJsonAsync("/api/bookings", ValidRequest() with { RestaurantId = "ember", Date = new DateOnly(2026, 7, 3), StartTime = "20:00" });
        create.EnsureSuccessStatusCode();
        var booking = await create.Content.ReadFromJsonAsync<BookingResponse>();

        var bookings = await client.GetFromJsonAsync<BookingResponse[]>("/api/bookings");

        Assert.NotNull(booking);
        Assert.NotNull(bookings);
        Assert.Contains(bookings, candidate => candidate.Id == booking.Id);
    }

    private static CreateBookingRequest ValidRequest() => new("harbor", new DateOnly(2026, 5, 2), "18:00", 2, "Ada Lovelace", "ada@example.test");
}
