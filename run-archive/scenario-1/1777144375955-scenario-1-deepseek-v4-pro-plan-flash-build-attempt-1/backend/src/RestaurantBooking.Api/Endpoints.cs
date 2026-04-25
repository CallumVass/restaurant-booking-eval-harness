using RestaurantBooking.Domain;

namespace RestaurantBooking.Api;

public static class Endpoints
{
    private static RestaurantResponse MapRestaurant(Restaurant r) => new(
        r.Id, r.Name, r.Cuisine,
        r.Tables.Select(t => new TableResponse(t.Id, t.Label, t.Capacity)).ToList());

    private static string FormatTime(TimeOnly t) => t.ToString("HH:mm");
    private static TimeOnly ParseTime(string s) => TimeOnly.Parse(s);

    public static void Map(WebApplication app)
    {
        var restaurants = app.MapGroup("/api/restaurants");
        restaurants.MapGet("/", GetAllRestaurants);
        restaurants.MapGet("/{id:guid}", GetRestaurant);
        restaurants.MapGet("/{id:guid}/availability", GetAvailability);

        var bookings = app.MapGroup("/api/bookings");
        bookings.MapGet("/", GetAllBookings);
        bookings.MapGet("/{id:guid}", GetBooking);
        bookings.MapPost("/", CreateBooking);
    }

    private static IResult GetAllRestaurants(IRestaurantRepository repo)
    {
        var restaurants = repo.GetAll().Select(MapRestaurant).ToList();
        return TypedResults.Ok(restaurants);
    }

    private static IResult GetRestaurant(Guid id, IRestaurantRepository repo)
    {
        var restaurant = repo.GetById(id);
        return restaurant is null
            ? TypedResults.NotFound(new ErrorResponse(BookingErrors.RestaurantNotFound.Code, BookingErrors.RestaurantNotFound.Message))
            : TypedResults.Ok(MapRestaurant(restaurant));
    }

    private static IResult GetAvailability(
        Guid id,
        DateOnly date,
        int partySize,
        IRestaurantRepository restaurantRepo,
        IBookingRepository bookingRepo)
    {
        var restaurant = restaurantRepo.GetById(id);
        if (restaurant is null)
            return TypedResults.NotFound(new ErrorResponse(BookingErrors.RestaurantNotFound.Code, BookingErrors.RestaurantNotFound.Message));

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (date <= today)
            return TypedResults.BadRequest(new ErrorResponse(BookingErrors.DateInPast.Code, BookingErrors.DateInPast.Message));

        if (partySize < 1)
            return TypedResults.BadRequest(new ErrorResponse(BookingErrors.ZeroPartySize.Code, BookingErrors.ZeroPartySize.Message));

        var existingBookings = bookingRepo.GetByRestaurantAndDate(id, date);
        var slots = AvailabilityCalculator.GetAvailableSlots(date, partySize, restaurant.Tables, existingBookings);

        return TypedResults.Ok(new AvailabilityResponse(
            slots.Select(s => new TimeSlotResponse(FormatTime(s.StartTime), FormatTime(s.EndTime), s.AvailableCapacity)).ToList()));
    }

    private static IResult GetAllBookings(IBookingRepository repo, IRestaurantRepository restaurantRepo)
    {
        var bookings = repo.GetAll().Select(b =>
        {
            var restaurant = restaurantRepo.GetById(b.RestaurantId);
            return new BookingResponse(
                b.Id, b.RestaurantId, restaurant?.Name ?? "Unknown",
                b.CustomerName, b.CustomerEmail,
                b.Date.ToString("yyyy-MM-dd"), FormatTime(b.StartTime), FormatTime(b.EndTime), b.PartySize);
        }).ToList();

        return TypedResults.Ok(bookings);
    }

    private static IResult GetBooking(Guid id, IBookingRepository repo, IRestaurantRepository restaurantRepo)
    {
        var booking = repo.GetById(id);
        if (booking is null)
            return TypedResults.NotFound(new ErrorResponse("NOT_FOUND", "Booking not found."));

        var restaurant = restaurantRepo.GetById(booking.RestaurantId);
        return TypedResults.Ok(new BookingResponse(
            booking.Id, booking.RestaurantId, restaurant?.Name ?? "Unknown",
            booking.CustomerName, booking.CustomerEmail,
            booking.Date.ToString("yyyy-MM-dd"), FormatTime(booking.StartTime), FormatTime(booking.EndTime), booking.PartySize));
    }

    private static IResult CreateBooking(
        CreateBookingRequest request,
        IRestaurantRepository restaurantRepo,
        IBookingRepository bookingRepo)
    {
        var restaurant = restaurantRepo.GetById(request.RestaurantId);
        if (restaurant is null)
            return TypedResults.NotFound(new ErrorResponse(BookingErrors.RestaurantNotFound.Code, BookingErrors.RestaurantNotFound.Message));

        DateOnly date;
        TimeOnly time;
        try
        {
            date = DateOnly.Parse(request.Date);
            time = TimeOnly.Parse(request.Time);
        }
        catch
        {
            return TypedResults.BadRequest(new ErrorResponse("VALIDATION", "Invalid date or time format. Use yyyy-MM-dd for date and HH:mm for time."));
        }

        var suitableTables = restaurant.Tables
            .Where(t => t.Capacity >= request.PartySize)
            .ToList();

        if (suitableTables.Count == 0)
            return TypedResults.BadRequest(new ErrorResponse(BookingErrors.InvalidPartySize(restaurant.Tables.Max(t => t.Capacity)).Code,
                $"Party size {request.PartySize} exceeds maximum capacity of {restaurant.Tables.Max(t => t.Capacity)}."));

        var existingBookings = bookingRepo.GetByRestaurantAndDate(request.RestaurantId, date);

        var endTime = time.AddHours(1.5);

        var availableTable = suitableTables.FirstOrDefault(t =>
            !ConflictDetector.HasConflict(t.Id, date, time, endTime, existingBookings));

        if (availableTable is null)
        {
            var slots = AvailabilityCalculator.GetAvailableSlots(date, request.PartySize, restaurant.Tables, existingBookings);
            if (slots.Count == 0)
                return TypedResults.Conflict(new ErrorResponse(BookingErrors.SlotUnavailable.Code,
                    "No available time slots for the requested date and party size."));
            return TypedResults.Conflict(new ErrorResponse(BookingErrors.ConflictDetected.Code,
                "The requested time slot conflicts with an existing booking. Please choose a different time."));
        }

        var bookingId = Guid.NewGuid();
        var validation = BookingValidator.Validate(
            bookingId, request.RestaurantId, availableTable.Id,
            request.CustomerName, request.CustomerEmail,
            date, time, request.PartySize,
            restaurant, restaurant.Tables, existingBookings);

        if (validation.IsFailure)
            return validation.Error.Code switch
            {
                "INVALID_DATE" or "INVALID_TIME" or "INVALID_PARTY_SIZE" or "VALIDATION"
                    => TypedResults.BadRequest(new ErrorResponse(validation.Error.Code, validation.Error.Message)),
                "CONFLICT"
                    => TypedResults.Conflict(new ErrorResponse(validation.Error.Code, validation.Error.Message)),
                _ => TypedResults.BadRequest(new ErrorResponse(validation.Error.Code, validation.Error.Message))
            };

        bookingRepo.Add(validation.Value);

        return TypedResults.Created($"/api/bookings/{bookingId}", new BookingResponse(
            bookingId, request.RestaurantId, restaurant.Name,
            validation.Value.CustomerName, validation.Value.CustomerEmail,
            validation.Value.Date.ToString("yyyy-MM-dd"),
            FormatTime(validation.Value.StartTime),
            FormatTime(validation.Value.EndTime),
            validation.Value.PartySize));
    }
}
