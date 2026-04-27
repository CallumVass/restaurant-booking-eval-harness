using RestaurantBooking.Web.Endpoints;
using RestaurantBooking.Web.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<InMemoryRestaurantRepository>();
builder.Services.AddSingleton<InMemoryBookingRepository>();

builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

app.UseCors();

app.MapOpenApi();

app.MapRestaurantEndpoints();
app.MapBookingEndpoints();
app.MapAvailabilityEndpoints();

app.Run();
