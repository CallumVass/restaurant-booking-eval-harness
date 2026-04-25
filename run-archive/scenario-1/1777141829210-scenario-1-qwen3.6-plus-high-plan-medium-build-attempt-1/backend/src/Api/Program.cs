using Api.Endpoints;
using Api.Infrastructure;
using Domain.Models;
using Domain.Store;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IBookingStore, InMemoryBookingStore>();
builder.Services.AddOpenApi();

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference();

app.MapRestaurantEndpoints();
app.MapBookingEndpoints();

SeedData(app.Services.GetRequiredService<IBookingStore>());

app.Run();

static void SeedData(IBookingStore store)
{
    var inMemory = store as InMemoryBookingStore;
    inMemory?.Seed(new[]
    {
        new Restaurant(
            "resto-1",
            "The Golden Fork",
            "Fine dining with a modern twist on classic cuisine",
            "French",
            new[]
            {
                new Table("t1", 2),
                new Table("t2", 4),
                new Table("t3", 6),
                new Table("t4", 8),
            }),
        new Restaurant(
            "resto-2",
            "Sakura House",
            "Authentic Japanese cuisine in a serene setting",
            "Japanese",
            new[]
            {
                new Table("t5", 2),
                new Table("t6", 4),
                new Table("t7", 4),
            }),
        new Restaurant(
            "resto-3",
            "Bella Napoli",
            "Traditional Italian flavors from the heart of Naples",
            "Italian",
            new[]
            {
                new Table("t8", 2),
                new Table("t9", 6),
                new Table("t10", 10),
            }),
    });
}
