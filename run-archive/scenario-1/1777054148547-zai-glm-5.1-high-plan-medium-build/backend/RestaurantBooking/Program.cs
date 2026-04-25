using RestaurantBooking.Api;
using RestaurantBooking.Data;
using RestaurantBooking.Domain;
using RestaurantBooking.Seeding;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();

builder.Services.AddSingleton<IRestaurantRepository>(sp =>
    new InMemoryRestaurantRepository(SeedData.Restaurants));
builder.Services.AddSingleton<ITableRepository>(sp =>
    new InMemoryTableRepository(SeedData.Tables));
builder.Services.AddSingleton<IBookingRepository, InMemoryBookingRepository>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseExceptionHandler();

app.MapRestaurantEndpoints();
app.MapBookingEndpoints();

app.Run();

public partial class Program;