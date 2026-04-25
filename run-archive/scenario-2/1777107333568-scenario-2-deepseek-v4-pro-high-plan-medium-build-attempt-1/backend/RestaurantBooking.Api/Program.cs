// pattern: Imperative Shell

using RestaurantBooking.Api.Features;
using RestaurantBooking.Api.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<InMemoryStore>();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.MapOpenApi();
app.UseCors();

RestaurantsEndpoints.Map(app);
BookingsEndpoints.Map(app);

app.Run();
