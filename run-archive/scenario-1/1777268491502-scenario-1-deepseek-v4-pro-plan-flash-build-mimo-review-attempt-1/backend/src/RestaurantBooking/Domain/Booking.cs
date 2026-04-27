// pattern: Functional Core

namespace RestaurantBooking.Domain;

public class Booking
{
    public Guid Id { get; }
    public Guid RestaurantId { get; }
    public Guid TableId { get; }
    public DateOnly Date { get; }
    public TimeOnly Time { get; }
    public int PartySize { get; }
    public string GuestName { get; }
    public string GuestEmail { get; }
    public DateTime CreatedAt { get; }

    public Booking(Guid id, Guid restaurantId, Guid tableId, DateOnly date, TimeOnly time,
        int partySize, string guestName, string guestEmail, DateTime createdAt)
    {
        Id = id;
        RestaurantId = restaurantId;
        TableId = tableId;
        Date = date;
        Time = time;
        PartySize = partySize;
        GuestName = guestName;
        GuestEmail = guestEmail;
        CreatedAt = createdAt;
    }
}
