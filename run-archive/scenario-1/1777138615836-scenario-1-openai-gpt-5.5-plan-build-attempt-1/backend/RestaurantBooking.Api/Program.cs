// pattern: Imperative Shell

using RestaurantBooking.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
builder.Services.AddSingleton<BookingStore>();

var app = builder.Build();

app.UseCors();
app.MapOpenApi();

var api = app.MapGroup("/api");

api.MapGet("/restaurants", (BookingStore store) => store.Restaurants)
    .WithName("ListRestaurants");

api.MapGet("/bookings", (BookingStore store) => store.Bookings)
    .WithName("ListBookings");

api.MapGet("/restaurants/{restaurantId}/availability", (
    string restaurantId,
    DateOnly date,
    int partySize,
    BookingStore store) =>
{
    var result = BookingRules.AvailableSlots(store.FindRestaurant(restaurantId), date, partySize, DateOnly.FromDateTime(DateTime.UtcNow), store.Bookings);
    return ToHttpResult(result);
})
    .WithName("ListAvailableSlots");

api.MapPost("/bookings", (CreateBookingRequest request, BookingStore store) =>
{
    var result = store.TryCreate(request, DateOnly.FromDateTime(DateTime.UtcNow));
    return ToHttpResult(result, created: true);
})
    .WithName("CreateBooking");

app.Run();

static IResult ToHttpResult<T>(BookingResult<T> result, bool created = false)
{
    if (result.IsSuccess)
    {
        return created ? Results.Created("/api/bookings", result.Value) : Results.Ok(result.Value);
    }

    var response = new ErrorResponse(result.Error!.Value.ToString(), result.Message!);
    return result.Error switch
    {
        BookingError.UnknownRestaurant => Results.NotFound(response),
        BookingError.OverlappingReservation => Results.Conflict(response),
        _ => Results.BadRequest(response),
    };
}

public partial class Program;
