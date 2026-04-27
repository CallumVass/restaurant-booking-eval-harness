namespace RestaurantBooking.Features.Restaurants;

public sealed record RestaurantResponse(Guid Id, string Name, List<TableResponse> Tables);
public sealed record TableResponse(Guid Id, int Capacity);
