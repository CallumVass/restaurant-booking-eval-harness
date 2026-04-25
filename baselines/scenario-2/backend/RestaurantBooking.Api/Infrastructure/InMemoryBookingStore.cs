// pattern: Imperative Shell

using RestaurantBooking.Api.Domain;

namespace RestaurantBooking.Api.Infrastructure;

public sealed class InMemoryBookingStore : IBookingStore
{
    private readonly Lock sync = new();
    private readonly List<Booking> bookings = [];

    public InMemoryBookingStore()
    {
        Restaurants =
        [
            new Restaurant("harbor", "Harbor & Hearth", "Seafood", "Waterfront", "Open-fire seafood, harbor views, and warm service.",
            [
                new Table("h-2a", 2),
                new Table("h-4a", 4),
                new Table("h-4b", 4),
                new Table("h-6a", 6)
            ]),
            new Restaurant("garden", "Garden Room", "Modern Vegetarian", "Arts District", "Seasonal vegetarian tasting plates in a glasshouse dining room.",
            [
                new Table("g-2a", 2),
                new Table("g-2b", 2),
                new Table("g-4a", 4),
                new Table("g-8a", 8)
            ]),
            new Restaurant("ember", "Ember Social", "New American", "Midtown", "Lively neighborhood room with shared plates and a late dinner service.",
            [
                new Table("e-2a", 2),
                new Table("e-4a", 4),
                new Table("e-6a", 6),
                new Table("e-10a", 10)
            ])
        ];

        bookings.Add(new Booking("BK-SEED-001", "harbor", "h-4a", new DateOnly(2026, 5, 1), new TimeOnly(18, 0), 4, "Seed Guest", "seed@example.test"));
    }

    public IReadOnlyList<Restaurant> Restaurants { get; }

    public IReadOnlyList<Booking> Bookings
    {
        get
        {
            lock (sync)
            {
                return bookings.ToArray();
            }
        }
    }

    public Booking Add(Booking booking)
    {
        lock (sync)
        {
            bookings.Add(booking);
            return booking;
        }
    }
}
