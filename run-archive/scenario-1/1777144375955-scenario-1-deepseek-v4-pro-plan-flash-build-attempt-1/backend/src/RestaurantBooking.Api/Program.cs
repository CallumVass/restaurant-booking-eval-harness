using RestaurantBooking.Api;
using RestaurantBooking.Domain;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IRestaurantRepository>(_ =>
    new InMemoryRestaurantRepository(SeedData.CreateRestaurants()));
builder.Services.AddSingleton<IBookingRepository>(_ => new InMemoryBookingRepository());

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

app.UseCors();
app.MapOpenApi();

Endpoints.Map(app);

app.Run();
