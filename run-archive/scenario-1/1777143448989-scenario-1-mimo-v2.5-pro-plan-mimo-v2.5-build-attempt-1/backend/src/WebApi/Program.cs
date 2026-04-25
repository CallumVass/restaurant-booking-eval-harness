using RestaurantBooking.Infrastructure;
using RestaurantBooking.WebApi.Features.Bookings;
using RestaurantBooking.WebApi.Features.Restaurants;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.MapRestaurantEndpoints();
app.MapBookingEndpoints();

app.Run();

public partial class Program { }
