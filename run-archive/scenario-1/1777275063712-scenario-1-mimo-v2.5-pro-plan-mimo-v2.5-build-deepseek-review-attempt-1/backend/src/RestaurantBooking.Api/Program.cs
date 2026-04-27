using Microsoft.AspNetCore.Mvc;
using RestaurantBooking.Domain;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSingleton<IRestaurantRepository, InMemoryRestaurantRepository>();
builder.Services.AddSingleton<ITableRepository, InMemoryTableRepository>();
builder.Services.AddSingleton<IBookingRepository, InMemoryBookingRepository>();

var app = builder.Build();

app.MapOpenApi();
app.MapOpenApi("/openapi/v1.json");

app.MapGet("/api/restaurants", (IRestaurantRepository repo) =>
{
    var restaurants = repo.GetAll();
    return Results.Ok(restaurants);
})
.WithName("ListRestaurants")
.WithTags("Restaurants");

app.MapGet("/api/restaurants/{id}", (string id, IRestaurantRepository repo) =>
{
    var restaurant = repo.GetById(id);
    return restaurant is not null ? Results.Ok(restaurant) : Results.NotFound();
})
.WithName("GetRestaurant")
.WithTags("Restaurants");

app.MapGet("/api/restaurants/{id}/availability", (
    string id,
    [FromQuery] DateOnly date,
    [FromQuery] int partySize,
    IRestaurantRepository restaurantRepo,
    ITableRepository tableRepo,
    IBookingRepository bookingRepo) =>
{
    var restaurant = restaurantRepo.GetById(id);
    if (restaurant is null)
        return Results.NotFound(new { error = "Restaurant not found" });

    var tables = tableRepo.GetByRestaurant(id);
    var bookings = bookingRepo.GetByRestaurantAndDate(id, date);

    var result = AvailabilityService.GetAvailableSlots(restaurant, tables, bookings, date, partySize);

    return result.IsSuccess
        ? Results.Ok(result.Value)
        : Results.BadRequest(new { error = result.Error.ToString() });
})
.WithName("GetAvailability")
.WithTags("Availability");

app.MapPost("/api/bookings", (
    BookingRequest request,
    IRestaurantRepository restaurantRepo,
    ITableRepository tableRepo,
    IBookingRepository bookingRepo) =>
{
    var restaurant = restaurantRepo.GetById(request.RestaurantId);
    if (restaurant is null)
        return Results.BadRequest(new { error = "RestaurantNotFound" });

    var tables = tableRepo.GetByRestaurant(request.RestaurantId);
    var existingBookings = bookingRepo.GetByRestaurantAndDate(request.RestaurantId, request.Date);

    var result = BookingService.CreateBooking(existingBookings, tables, restaurant, request);

    if (!result.IsSuccess)
        return Results.BadRequest(new { error = result.Error.ToString() });

    bookingRepo.Add(result.Value!);
    return Results.Created($"/api/bookings/{result.Value!.Id}", result.Value);
})
.WithName("CreateBooking")
.WithTags("Bookings");

app.MapGet("/api/bookings", (
    [FromQuery] string? restaurantId,
    IBookingRepository bookingRepo) =>
{
    if (string.IsNullOrEmpty(restaurantId))
        return Results.BadRequest(new { error = "restaurantId is required" });

    var today = DateOnly.FromDateTime(DateTime.UtcNow);
    var bookings = bookingRepo.GetByRestaurantAndDate(restaurantId, today);
    return Results.Ok(bookings);
})
.WithName("ListBookings")
.WithTags("Bookings");

app.MapGet("/api/bookings/{id}", (string id, IBookingRepository bookingRepo) =>
{
    var booking = bookingRepo.GetById(id);
    return booking is not null ? Results.Ok(booking) : Results.NotFound();
})
.WithName("GetBooking")
.WithTags("Bookings");

app.Run();

public partial class Program { }
