// pattern: Imperative Shell

using RestaurantBooking.Api.Features.Availability;
using RestaurantBooking.Api.Features.Bookings;
using RestaurantBooking.Api.Features.Restaurants;
using RestaurantBooking.Api.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy
        .WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod());
});
builder.Services.AddOpenApi();
builder.Services.AddSingleton<IBookingStore, InMemoryBookingStore>();

var app = builder.Build();

app.UseCors();
app.MapOpenApi();
app.MapRestaurants();
app.MapAvailability();
app.MapBookings();

app.Run();

public partial class Program;
