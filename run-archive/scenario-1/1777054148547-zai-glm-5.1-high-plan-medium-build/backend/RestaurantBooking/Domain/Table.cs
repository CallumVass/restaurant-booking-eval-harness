namespace RestaurantBooking.Domain;

public sealed record Table(string Id, string RestaurantId, int Seats);