namespace RestaurantBooking.Domain;

public sealed record Restaurant(Guid Id, string Name, TimeSpan OpeningTime, TimeSpan ClosingTime);
