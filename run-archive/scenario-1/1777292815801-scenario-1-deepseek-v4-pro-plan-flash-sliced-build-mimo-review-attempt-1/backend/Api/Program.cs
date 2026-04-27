using System.Collections.Concurrent;
using System.Text.Json;
using Backend.Domain;
using Backend.UseCases;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()));

var app = builder.Build();

app.UseCors();

var openApiJson = File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "Api", "openapi.json"));

app.MapGet("/swagger/v1/swagger.json", () =>
{
    var doc = JsonSerializer.Deserialize<JsonElement>(openApiJson);
    return Results.Json(doc);
});

app.MapGet("/swagger", () => Results.Content("""
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Restaurant Booking API - Swagger</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>SwaggerUIBundle({ url: '/swagger/v1/swagger.json', dom_id: '#swagger-ui' })</script>
</body>
</html>
""", "text/html"));

// Seed data store
var restaurants = new ConcurrentDictionary<string, Restaurant>(
    SeedData.Restaurants.ToDictionary(r => r.Id));

var tables = new ConcurrentDictionary<string, Table[]>(
    SeedData.Tables.GroupBy(t => t.RestaurantId)
                   .ToDictionary(g => g.Key, g => g.ToArray()));

var bookings = new ConcurrentDictionary<string, List<Booking>>(
    SeedData.Restaurants.ToDictionary(r => r.Id, _ => new List<Booking>()));

// GET /api/restaurants
app.MapGet("/api/restaurants", () =>
{
    return Results.Ok(restaurants.Values.ToArray());
});

// GET /api/restaurants/{id}
app.MapGet("/api/restaurants/{id}", (string id) =>
{
    if (!restaurants.TryGetValue(id, out var restaurant))
        return Results.NotFound(new { error = "Restaurant not found" });
    return Results.Ok(restaurant);
});

// GET /api/restaurants/{id}/tables
app.MapGet("/api/restaurants/{id}/tables", (string id) =>
{
    if (!tables.TryGetValue(id, out var restaurantTables))
        return Results.NotFound(new { error = "Restaurant not found" });
    return Results.Ok(restaurantTables);
});

// GET /api/restaurants/{id}/slots?date=YYYY-MM-DD&partySize=N
app.MapGet("/api/restaurants/{id}/slots", (string id, string? date, int? partySize) =>
{
    if (!restaurants.ContainsKey(id))
        return Results.NotFound(new { error = "Restaurant not found" });

    if (string.IsNullOrWhiteSpace(date) || !DateOnly.TryParse(date, out var parsedDate))
        return Results.BadRequest(new { error = "Invalid date format, use YYYY-MM-DD" });

    if (partySize is null or <= 0)
        return Results.BadRequest(new { error = "Party size must be at least 1" });

    var restaurantTables = tables.GetValueOrDefault(id, []);
    var restaurantBookings = bookings.GetValueOrDefault(id, [])?.ToArray() ?? [];

    var slots = BookingService.GetAvailableSlots(id, parsedDate, partySize.Value, restaurantTables, restaurantBookings);

    return Results.Ok(slots.Select(s => s.ToString("HH:mm")).ToArray());
});

// POST /api/restaurants/{id}/bookings
app.MapPost("/api/restaurants/{id}/bookings", (string id, CreateBookingRequest request) =>
{
    var validationError = ValidateRequest(request);
    if (validationError != null)
        return Results.BadRequest(new { error = validationError });

    if (!restaurants.ContainsKey(id))
        return Results.NotFound(new { error = "Restaurant not found" });

    var restaurantTables = tables.GetValueOrDefault(id, []);
    var restaurantBookings = bookings.GetValueOrDefault(id, [])?.ToArray() ?? [];

    var result = BookingService.CreateBooking(id, request, restaurantTables, restaurantBookings, DateTime.Now);

    if (!result.IsSuccess)
    {
        var statusCode = result.Error switch
        {
            "Party size must be at least 1" => 400,
            "Booking must be in the future" => 400,
            "Booking time must be between 11:00 and 20:30" => 400,
            "Restaurant not found" => 404,
            _ => 409
        };
        return Results.Json(new { error = result.Error }, statusCode: statusCode);
    }

    bookings.AddOrUpdate(id,
        _ => [result.Value!],
        (_, list) => { list.Add(result.Value!); return list; });

    return Results.Created($"/api/bookings/{result.Value!.Id}", result.Value);
});

// GET /api/restaurants/{id}/bookings?date=YYYY-MM-DD
app.MapGet("/api/restaurants/{id}/bookings", (string id, string? date) =>
{
    if (!restaurants.ContainsKey(id))
        return Results.NotFound(new { error = "Restaurant not found" });

    if (string.IsNullOrWhiteSpace(date) || !DateOnly.TryParse(date, out var parsedDate))
        return Results.BadRequest(new { error = "Invalid date format, use YYYY-MM-DD" });

    var restaurantBookings = bookings.GetValueOrDefault(id, []) ?? [];
    var filtered = restaurantBookings
        .Where(b => DateOnly.FromDateTime(b.DateTime) == parsedDate)
        .OrderBy(b => b.DateTime)
        .ToArray();

    return Results.Ok(filtered);
});

app.Urls.Add("http://localhost:5000");

app.Run();
return;

static string? ValidateRequest(CreateBookingRequest request)
{
    if (string.IsNullOrWhiteSpace(request.GuestName))
        return "Guest name is required";
    if (string.IsNullOrWhiteSpace(request.GuestEmail))
        return "Guest email is required";
    if (request.PartySize <= 0)
        return "Party size must be at least 1";
    return null;
}
