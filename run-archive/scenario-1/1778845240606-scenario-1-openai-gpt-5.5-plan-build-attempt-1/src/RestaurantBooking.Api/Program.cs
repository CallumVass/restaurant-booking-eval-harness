using System.Collections.Concurrent;
using Microsoft.AspNetCore.Http.HttpResults;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
builder.Services.AddOpenApi();
builder.Services.AddSingleton<BookingStore>();

var app = builder.Build();
app.UseCors();
app.MapOpenApi();
app.MapGet("/", () => Results.Redirect("/openapi/v1.json"));

app.MapGet("/restaurants", (BookingStore store) => store.Restaurants);
app.MapGet("/restaurants/{restaurantId:guid}/timeslots", Results<Ok<IReadOnlyList<TimeSlotDto>>, ProblemHttpResult> (Guid restaurantId, DateOnly date, int partySize, BookingStore store) =>
{
    var result = BookingDomain.GetAvailableSlots(store.Snapshot(), restaurantId, date, partySize, DateTimeOffset.Now);
    return result.IsSuccess ? TypedResults.Ok(result.Value) : Problem(result.Error);
});
app.MapGet("/bookings", (BookingStore store) => store.Bookings.OrderBy(b => b.Start).ToList());
app.MapPost("/bookings", Results<Created<BookingDto>, ProblemHttpResult> (CreateBookingRequest request, BookingStore store) =>
{
    var result = store.CreateBooking(request, DateTimeOffset.Now);
    return result.IsSuccess ? TypedResults.Created($"/bookings/{result.Value.Id}", result.Value) : Problem(result.Error);
});

app.Run();

static ProblemHttpResult Problem(DomainError error) => TypedResults.Problem(title: error.Code, detail: error.Message, statusCode: error.StatusCode);

public partial class Program;

public sealed class BookingStore
{
    private readonly object gate = new();
    private readonly List<BookingDto> bookings = [];
    public IReadOnlyList<RestaurantDto> Restaurants { get; } = Seed.Restaurants;
    public IReadOnlyList<BookingDto> Bookings { get { lock (gate) return bookings.ToList(); } }
    public BookingSnapshot Snapshot() { lock (gate) return new BookingSnapshot(Restaurants, bookings.ToList()); }
    public Result<BookingDto> CreateBooking(CreateBookingRequest request, DateTimeOffset now)
    {
        lock (gate)
        {
            var result = BookingDomain.CreateBooking(new BookingSnapshot(Restaurants, bookings), request, now);
            if (result.IsSuccess) bookings.Add(result.Value);
            return result;
        }
    }
}

public static class BookingDomain
{
    public static readonly TimeOnly Opening = new(17, 0);
    public static readonly TimeOnly Closing = new(22, 0);
    public static readonly TimeSpan Duration = TimeSpan.FromMinutes(90);
    public static readonly TimeSpan SlotStep = TimeSpan.FromMinutes(30);

    public static Result<BookingDto> CreateBooking(BookingSnapshot snapshot, CreateBookingRequest request, DateTimeOffset now)
    {
        var validation = ValidateRequest(snapshot, request.RestaurantId, request.PartySize, request.Start, now);
        if (!validation.IsSuccess) return Result<BookingDto>.Failure(validation.Error);
        var table = FindTable(snapshot, request.RestaurantId, request.PartySize, request.Start);
        if (table is null) return Result<BookingDto>.Failure(Errors.Overlap);
        var booking = new BookingDto(Guid.NewGuid(), request.RestaurantId, table.Id, request.GuestName.Trim(), request.PartySize, request.Start, request.Start.Add(Duration));
        return Result<BookingDto>.Success(booking);
    }

    public static Result<IReadOnlyList<TimeSlotDto>> GetAvailableSlots(BookingSnapshot snapshot, Guid restaurantId, DateOnly date, int partySize, DateTimeOffset now)
    {
        var restaurant = snapshot.Restaurants.SingleOrDefault(r => r.Id == restaurantId);
        if (restaurant is null) return Result<IReadOnlyList<TimeSlotDto>>.Failure(Errors.UnknownRestaurant);
        if (partySize is < 1 or > 12) return Result<IReadOnlyList<TimeSlotDto>>.Failure(Errors.InvalidPartySize);
        if (date < DateOnly.FromDateTime(now.DateTime)) return Result<IReadOnlyList<TimeSlotDto>>.Failure(Errors.InvalidDate);
        var slots = new List<TimeSlotDto>();
        for (var time = Opening; time.Add(Duration) <= Closing; time = time.Add(SlotStep))
        {
            var start = date.ToDateTime(time);
            if (start <= now.LocalDateTime) continue;
            var table = FindTable(snapshot, restaurantId, partySize, start);
            slots.Add(new TimeSlotDto(start, table is not null, table?.Capacity));
        }
        return Result<IReadOnlyList<TimeSlotDto>>.Success(slots);
    }

    private static Result<bool> ValidateRequest(BookingSnapshot snapshot, Guid restaurantId, int partySize, DateTime start, DateTimeOffset now)
    {
        if (snapshot.Restaurants.All(r => r.Id != restaurantId)) return Result<bool>.Failure(Errors.UnknownRestaurant);
        if (partySize is < 1 or > 12) return Result<bool>.Failure(Errors.InvalidPartySize);
        if (start <= now.LocalDateTime || DateOnly.FromDateTime(start) < DateOnly.FromDateTime(now.DateTime)) return Result<bool>.Failure(Errors.InvalidDate);
        var time = TimeOnly.FromDateTime(start);
        if (time < Opening || time.Add(Duration) > Closing || start.Minute % 30 != 0) return Result<bool>.Failure(Errors.InvalidTime);
        return Result<bool>.Success(true);
    }

    private static TableDto? FindTable(BookingSnapshot snapshot, Guid restaurantId, int partySize, DateTime start)
    {
        var end = start.Add(Duration);
        var restaurant = snapshot.Restaurants.Single(r => r.Id == restaurantId);
        return restaurant.Tables.Where(t => t.Capacity >= partySize).OrderBy(t => t.Capacity).FirstOrDefault(table =>
            snapshot.Bookings.Where(b => b.RestaurantId == restaurantId && b.TableId == table.Id).All(b => !Overlaps(start, end, b.Start, b.End)));
    }

    public static bool Overlaps(DateTime aStart, DateTime aEnd, DateTime bStart, DateTime bEnd) => aStart < bEnd && bStart < aEnd;
}

public static class Seed
{
    public static readonly IReadOnlyList<RestaurantDto> Restaurants =
    [
        new(new Guid("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"), "Juniper Table", "Seasonal small plates", "Downtown", [new(Guid.NewGuid(), 2), new(Guid.NewGuid(), 4), new(Guid.NewGuid(), 6)]),
        new(new Guid("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"), "Osteria Luna", "Handmade pasta and spritzes", "Riverside", [new(Guid.NewGuid(), 2), new(Guid.NewGuid(), 4), new(Guid.NewGuid(), 8)]),
        new(new Guid("cccccccc-cccc-cccc-cccc-cccccccccccc"), "Ember & Rye", "Wood-fired grill", "Market Quarter", [new(Guid.NewGuid(), 4), new(Guid.NewGuid(), 6), new(Guid.NewGuid(), 10)])
    ];
}

public sealed record RestaurantDto(Guid Id, string Name, string Description, string Neighborhood, IReadOnlyList<TableDto> Tables);
public sealed record TableDto(Guid Id, int Capacity);
public sealed record BookingDto(Guid Id, Guid RestaurantId, Guid TableId, string GuestName, int PartySize, DateTime Start, DateTime End);
public sealed record CreateBookingRequest(Guid RestaurantId, string GuestName, int PartySize, DateTime Start);
public sealed record TimeSlotDto(DateTime Start, bool Available, int? TableCapacity);
public sealed record BookingSnapshot(IReadOnlyList<RestaurantDto> Restaurants, IReadOnlyList<BookingDto> Bookings);
public sealed record DomainError(string Code, string Message, int StatusCode);

public static class Errors
{
    public static readonly DomainError UnknownRestaurant = new("unknown_restaurant", "Restaurant was not found.", 404);
    public static readonly DomainError InvalidPartySize = new("invalid_party_size", "Party size must be between 1 and 12.", 400);
    public static readonly DomainError InvalidDate = new("invalid_date", "Booking date must be in the future.", 400);
    public static readonly DomainError InvalidTime = new("invalid_time", "Bookings must start on a 30-minute slot between 17:00 and 20:30.", 400);
    public static readonly DomainError Overlap = new("overlapping_reservation", "No suitable table is available for that time.", 409);
}

public readonly record struct Result<T>(T Value, DomainError Error, bool IsSuccess)
{
    public static Result<T> Success(T value) => new(value, new DomainError("", "", 200), true);
    public static Result<T> Failure(DomainError error) => new(default!, error, false);
}
