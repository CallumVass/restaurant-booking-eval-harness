// pattern: Imperative Shell

using Microsoft.AspNetCore.Http.HttpResults;
using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Api.Features;

public static class ProblemMapper
{
    public static ProblemHttpResult ToProblem(BookingError error) => TypedResults.Problem(
        title: error.Message,
        statusCode: error.Code is "unknown_restaurant" ? StatusCodes.Status404NotFound : StatusCodes.Status400BadRequest,
        extensions: new Dictionary<string, object?> { ["code"] = error.Code });
}
