using RestaurantBooking.Features.Restaurants;
using RestaurantBooking.Features.Bookings;
using RestaurantBooking.Features.Availability;
using RestaurantBooking.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSingleton<IRestaurantStore, InMemoryRestaurantStore>();
builder.Services.AddSingleton<IBookingStore, InMemoryBookingStore>();
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();

app.UseCors();
app.MapOpenApi();

ListRestaurants.Map(app);
CreateBooking.Map(app);
ListBookings.Map(app);
GetAvailability.Map(app);

app.Run();

public partial class Program { }
