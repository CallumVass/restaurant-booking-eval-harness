using RestaurantBooking.Domain;
using RestaurantBooking.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Restaurant Booking API",
        Version = "v1"
    });
});
builder.Services.AddSingleton<InMemoryStore>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var store = app.Services.GetRequiredService<InMemoryStore>();

app.MapGet("/api/restaurants", () =>
{
    var restaurants = store.GetRestaurants();
    return Results.Ok(restaurants.Select(r => new RestaurantDto
    {
        Id = r.Id,
        Name = r.Name,
        Address = r.Address,
        Tables = r.Tables.Select(t => new TableDto { Id = t.Id, Seats = t.Seats }).ToList()
    }));
})
.WithName("GetRestaurants")
.WithTags("Restaurants")
.Produces<IReadOnlyList<RestaurantDto>>();

app.MapGet("/api/restaurants/{id}", (string id) =>
{
    var restaurant = store.GetRestaurant(id);
    if (restaurant is null)
        return Results.NotFound(new ErrorResponse { Error = $"Restaurant '{id}' not found.", Code = "RESTAURANT_NOT_FOUND" });

    return Results.Ok(new RestaurantDto
    {
        Id = restaurant.Id,
        Name = restaurant.Name,
        Address = restaurant.Address,
        Tables = restaurant.Tables.Select(t => new TableDto { Id = t.Id, Seats = t.Seats }).ToList()
    });
})
.WithName("GetRestaurantById")
.WithTags("Restaurants")
.Produces<RestaurantDto>()
.Produces<ErrorResponse>(404);

app.MapGet("/api/restaurants/{id}/slots", (string id, DateOnly date, int partySize) =>
{
    var request = new SlotAvailabilityRequest
    {
        RestaurantId = id,
        Date = date,
        PartySize = partySize
    };
    var slots = BookingService.GetAvailableSlots(store.GetRestaurants(), store.GetBookings(id), request);
    return Results.Ok(slots);
})
.WithName("GetAvailableSlots")
.WithTags("Bookings")
.Produces<IReadOnlyList<TimeSlot>>();

app.MapPost("/api/bookings", (BookingRequest request) =>
{
    var result = BookingService.CreateBooking(
        store.GetRestaurants(),
        store.GetBookings(request.RestaurantId),
        request);

    if (!result.IsSuccess)
        return Results.BadRequest(new ErrorResponse { Error = result.Error!, Code = result.ErrorCode! });

    store.AddBooking(result.Value!);
    var dto = new BookingDto
    {
        Id = result.Value!.Id,
        RestaurantId = result.Value.RestaurantId,
        TableId = result.Value.TableId,
        CustomerName = result.Value.CustomerName,
        PartySize = result.Value.PartySize,
        Date = result.Value.Date,
        StartTime = result.Value.StartTime,
        EndTime = result.Value.EndTime,
        Status = result.Value.Status
    };
    return Results.Created($"/api/bookings/{dto.Id}", dto);
})
.WithName("CreateBooking")
.WithTags("Bookings")
.Produces<BookingDto>(201)
.Produces<ErrorResponse>(400);

app.MapGet("/api/bookings", (string? restaurantId) =>
{
    var bookings = store.GetBookings(restaurantId);
    return Results.Ok(bookings.Select(b => new BookingDto
    {
        Id = b.Id,
        RestaurantId = b.RestaurantId,
        TableId = b.TableId,
        CustomerName = b.CustomerName,
        PartySize = b.PartySize,
        Date = b.Date,
        StartTime = b.StartTime,
        EndTime = b.EndTime,
        Status = b.Status
    }));
})
.WithName("GetBookings")
.WithTags("Bookings")
.Produces<IReadOnlyList<BookingDto>>();

app.Run();

public partial class Program { }
