using RestaurantBooking.Features.CreateBooking;
using RestaurantBooking.Features.GetAvailableSlots;
using RestaurantBooking.Features.ListBookings;
using RestaurantBooking.Features.ListRestaurants;
using RestaurantBooking.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSingleton<DataStore>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

ListRestaurantsEndpoint.Map(app);
GetAvailableSlotsEndpoint.Map(app);
CreateBookingEndpoint.Map(app);
ListBookingsEndpoint.Map(app);

app.Run();

public partial class Program;
