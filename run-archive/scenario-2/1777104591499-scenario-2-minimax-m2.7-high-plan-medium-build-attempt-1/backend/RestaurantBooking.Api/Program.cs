using RestaurantBooking.Api.Controllers;
using RestaurantBooking.Api.Infrastructure;
using RestaurantBooking.Domain.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "Restaurant Booking API",
        Version = "v1",
        Description = "API for restaurant table reservations"
    });
});

builder.Services.AddSingleton<IRestaurantRepository, InMemoryRestaurantRepository>();
builder.Services.AddSingleton<IBookingRepository, InMemoryBookingRepository>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Restaurant Booking API v1");
    options.RoutePrefix = string.Empty;
});

app.MapControllers();

app.Run();