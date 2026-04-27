using RestaurantBooking.Features.Bookings.CreateBooking;
using RestaurantBooking.Features.Bookings.ListBookings;
using RestaurantBooking.Features.Restaurants.GetSlots;
using RestaurantBooking.Features.Restaurants.ListRestaurants;
using RestaurantBooking.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<InMemoryStore>();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors();

var store = app.Services.GetRequiredService<InMemoryStore>();
SeedData.Seed(store);

app.MapGet("/restaurants", ListRestaurantsEndpoint.Handle)
   .WithSummary("List all restaurants")
   .WithDescription("Returns all restaurants with their tables and capacities.");

app.MapGet("/restaurants/{id}/slots", GetSlotsEndpoint.Handle)
   .WithSummary("Get available time slots")
   .WithDescription("Returns available booking slots for a restaurant, date, and party size.");

app.MapPost("/bookings", CreateBookingEndpoint.Handle)
   .WithSummary("Create a booking")
   .WithDescription("Creates a new booking reservation.");

app.MapGet("/bookings", ListBookingsEndpoint.Handle)
   .WithSummary("List all bookings")
   .WithDescription("Returns all bookings with restaurant names.");

app.MapOpenApi("/openapi/v1.json");

app.Run("http://localhost:5000");

public partial class Program { }
