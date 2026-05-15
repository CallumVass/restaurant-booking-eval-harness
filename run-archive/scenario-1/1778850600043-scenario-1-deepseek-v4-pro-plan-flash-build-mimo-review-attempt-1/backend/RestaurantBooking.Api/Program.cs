using RestaurantBooking.Api.Data;
using RestaurantBooking.Api.Domain;
using RestaurantBooking.Api.Dtos;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<InMemoryStore>();
builder.Services.AddSingleton<BookingService>();
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

SeedData.Initialize(app.Services.GetRequiredService<InMemoryStore>());

app.MapOpenApi();

app.UseCors();

// --- RESTAURANTS ---

app.MapGet("/api/restaurants", () =>
{
    var store = app.Services.GetRequiredService<InMemoryStore>();
    var restaurants = store.Restaurants.Values
        .Select(r => new RestaurantResponse(
            r.Id, r.Name, r.Description, r.Cuisine, r.Address,
            r.Tables.Count,
            r.Tables.Min(t => t.Capacity),
            r.Tables.Max(t => t.Capacity)))
        .OrderBy(r => r.Name)
        .ToList();
    return Results.Ok(restaurants);
})
.WithName("GetRestaurants")
.WithTags("Restaurants")
.Produces<List<RestaurantResponse>>(StatusCodes.Status200OK);

app.MapGet("/api/restaurants/{id:guid}", (Guid id) =>
{
    var store = app.Services.GetRequiredService<InMemoryStore>();
    if (!store.Restaurants.TryGetValue(id, out var restaurant))
        return Results.NotFound(new BookingErrorResponse("NOT_FOUND", "Restaurant not found"));

    return Results.Ok(new RestaurantResponse(
        restaurant.Id, restaurant.Name, restaurant.Description,
        restaurant.Cuisine, restaurant.Address,
        restaurant.Tables.Count,
        restaurant.Tables.Min(t => t.Capacity),
        restaurant.Tables.Max(t => t.Capacity)));
})
.WithName("GetRestaurantById")
.WithTags("Restaurants")
.Produces<RestaurantResponse>(StatusCodes.Status200OK)
.Produces<BookingErrorResponse>(StatusCodes.Status404NotFound);

// --- AVAILABLE SLOTS ---

app.MapGet("/api/restaurants/{restaurantId:guid}/slots", (Guid restaurantId, DateOnly date, int partySize) =>
{
    var store = app.Services.GetRequiredService<InMemoryStore>();
    var bookingService = app.Services.GetRequiredService<BookingService>();

    if (!store.Restaurants.TryGetValue(restaurantId, out _))
        return Results.NotFound(new BookingErrorResponse("NOT_FOUND", "Restaurant not found"));

    if (partySize < 1)
        return Results.BadRequest(new BookingErrorResponse("INVALID_PARTY_SIZE", "Party size must be at least 1"));

    if (partySize > 20)
        return Results.BadRequest(new BookingErrorResponse("INVALID_PARTY_SIZE", "Party size cannot exceed 20"));

    var today = DateOnly.FromDateTime(DateTime.UtcNow);
    if (date < today)
        return Results.BadRequest(new BookingErrorResponse("INVALID_DATE", "Date cannot be in the past"));

    if (date > today.AddDays(60))
        return Results.BadRequest(new BookingErrorResponse("INVALID_DATE", "Date cannot be more than 60 days in the future"));

    var slots = bookingService.GetAvailableSlots(restaurantId, date, partySize);
    return Results.Ok(slots);
})
.WithName("GetAvailableSlots")
.WithTags("Slots")
.Produces<List<AvailableSlotResponse>>(StatusCodes.Status200OK)
.Produces<BookingErrorResponse>(StatusCodes.Status404NotFound)
.Produces<BookingErrorResponse>(StatusCodes.Status400BadRequest);

// --- CREATE BOOKING ---

app.MapPost("/api/bookings", (CreateBookingRequest request) =>
{
    var bookingService = app.Services.GetRequiredService<BookingService>();
    var (booking, error) = bookingService.CreateBooking(request);

    if (error is not null)
    {
        return error switch
        {
            BookingError.RestaurantNotFound => Results.NotFound(new BookingErrorResponse("NOT_FOUND", "Restaurant not found")),
            BookingError.InvalidPartySize e => Results.BadRequest(new BookingErrorResponse("INVALID_PARTY_SIZE",
                e.Requested < 1 ? "Party size must be at least 1" : $"Party size {e.Requested} exceeds maximum capacity {e.MaxCapacity}")),
            BookingError.InvalidDate e => Results.BadRequest(new BookingErrorResponse("INVALID_DATE", e.Reason)),
            BookingError.InvalidTime e => Results.BadRequest(new BookingErrorResponse("INVALID_TIME", e.Reason)),
            BookingError.NoAvailableTable => Results.Conflict(new BookingErrorResponse("NO_AVAILABLE_TABLE", "No table available for the requested time and party size")),
            BookingError.OverlappingBooking => Results.Conflict(new BookingErrorResponse("OVERLAPPING", "This table already has a booking at the requested time")),
            _ => Results.StatusCode(500)
        };
    }

    return Results.Created($"/api/bookings", new BookingResponse(
        booking!.Id, booking.RestaurantId, booking.Date, booking.StartTime,
        booking.EndTime, booking.PartySize, booking.CustomerName,
        booking.CustomerEmail, booking.Notes, booking.CreatedAtUtc));
})
.WithName("CreateBooking")
.WithTags("Bookings")
.Produces<BookingResponse>(StatusCodes.Status201Created)
.Produces<BookingErrorResponse>(StatusCodes.Status400BadRequest)
.Produces<BookingErrorResponse>(StatusCodes.Status404NotFound)
.Produces<BookingErrorResponse>(StatusCodes.Status409Conflict);

// --- GET BOOKINGS ---

app.MapGet("/api/bookings", (string email) =>
{
    var bookingService = app.Services.GetRequiredService<BookingService>();

    if (string.IsNullOrWhiteSpace(email))
        return Results.BadRequest(new BookingErrorResponse("MISSING_EMAIL", "Email query parameter is required"));

    var bookings = bookingService.GetBookingsByEmail(email);
    var responses = bookings.Select(b => new BookingResponse(
        b.Id, b.RestaurantId, b.Date, b.StartTime,
        b.EndTime, b.PartySize, b.CustomerName,
        b.CustomerEmail, b.Notes, b.CreatedAtUtc)).ToList();
    return Results.Ok(responses);
})
.WithName("GetBookings")
.WithTags("Bookings")
.Produces<List<BookingResponse>>(StatusCodes.Status200OK)
.Produces<BookingErrorResponse>(StatusCodes.Status400BadRequest);

app.Run();

public partial class Program { }
