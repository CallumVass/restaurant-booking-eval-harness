// pattern: Imperative Shell

using RestaurantBooking.Api.Features.Bookings;
using RestaurantBooking.Api.Features.Restaurants;
using RestaurantBooking.Api.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IRestaurantStore, InMemoryRestaurantStore>();
builder.Services.AddSingleton<IBookingStore, InMemoryBookingStore>();
builder.Services.AddSingleton(TimeProvider.System);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "Restaurant Booking API",
        Version = "v1"
    });
    options.UseAllOfToExtendReferenceSchemas();
    options.CustomSchemaIds(type => type.FullName?.Replace("+", ".") ?? type.Name);
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();

ListRestaurants.Map(app);
GetAvailableSlots.Map(app);
CreateBooking.Map(app);
ListBookings.Map(app);
GetBooking.Map(app);

app.Run();

public partial class Program { }
