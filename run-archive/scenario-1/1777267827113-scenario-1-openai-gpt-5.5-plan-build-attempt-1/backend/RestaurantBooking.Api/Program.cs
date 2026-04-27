// pattern: Imperative Shell

using Microsoft.AspNetCore.Http.HttpResults;
using RestaurantBooking.Api.Domain;
using RestaurantBooking.Api.Features;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Info.Title = "Restaurant Booking API";
        document.Info.Version = "v1";
        document.Info.Description = "OpenAPI contract for the restaurant booking SPA.";
        return Task.CompletedTask;
    });
});
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});
builder.Services.AddSingleton<BookingStore>();

var app = builder.Build();

app.UseCors();
app.MapOpenApi();

var api = app.MapGroup("/api").WithTags("Restaurant booking");

api.MapGet("/restaurants", (BookingStore store) => store.Restaurants)
    .WithName("ListRestaurants")
    .WithSummary("List restaurants")
    .Produces<IReadOnlyList<RestaurantDto>>();

api.MapGet("/bookings", (BookingStore store) => store.Bookings)
    .WithName("ListBookings")
    .WithSummary("List bookings")
    .Produces<IReadOnlyList<BookingDto>>();

api.MapGet("/restaurants/{restaurantId}/available-slots", Results<Ok<IReadOnlyList<AvailableSlotDto>>, ProblemHttpResult> (
    string restaurantId,
    DateOnly date,
    int partySize,
    BookingStore store) =>
{
    var result = store.GetAvailableSlots(restaurantId, date, partySize);
    return result.IsSuccess
        ? TypedResults.Ok(result.Value)
        : ToProblem(result.Error);
})
    .WithName("ListAvailableSlots")
    .WithSummary("List available booking start times")
    .Produces<IReadOnlyList<AvailableSlotDto>>()
    .ProducesProblem(StatusCodes.Status400BadRequest)
    .ProducesProblem(StatusCodes.Status404NotFound);

api.MapPost("/bookings", Results<Created<BookingDto>, ProblemHttpResult> (
    CreateBookingRequest request,
    BookingStore store) =>
{
    var result = store.CreateBooking(request);
    if (!result.IsSuccess || result.Value is null)
    {
        return ToProblem(result.Error);
    }

    return TypedResults.Created($"/api/bookings/{result.Value.Id}", result.Value);
})
    .WithName("CreateBooking")
    .WithSummary("Create a booking")
    .Produces<BookingDto>(StatusCodes.Status201Created)
    .ProducesProblem(StatusCodes.Status400BadRequest)
    .ProducesProblem(StatusCodes.Status404NotFound)
    .ProducesProblem(StatusCodes.Status409Conflict);

app.Run();

static ProblemHttpResult ToProblem(BookingError error)
{
    var status = error.Code switch
    {
        BookingErrorCode.UnknownRestaurant => StatusCodes.Status404NotFound,
        BookingErrorCode.OverlappingReservation or BookingErrorCode.NoCapacity => StatusCodes.Status409Conflict,
        _ => StatusCodes.Status400BadRequest,
    };

    return TypedResults.Problem(
        title: error.Code.ToString(),
        detail: error.Message,
        statusCode: status,
        extensions: new Dictionary<string, object?> { ["code"] = error.Code.ToString() });
}

public partial class Program;
