using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Api.Features.Availability;

public sealed record SlotResponse(string StartTime, string EndTime, int AvailableTables)
{
    public static SlotResponse From(TimeSlot slot) => new(slot.StartTime.ToString("HH:mm"), slot.EndTime.ToString("HH:mm"), slot.AvailableTables);
}
