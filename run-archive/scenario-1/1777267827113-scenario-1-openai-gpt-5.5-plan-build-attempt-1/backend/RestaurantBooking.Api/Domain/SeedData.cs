// pattern: Functional Core

namespace RestaurantBooking.Api.Domain;

public static class SeedData
{
    public static IReadOnlyList<Restaurant> Restaurants { get; } =
    [
        new Restaurant(
            "ember-room",
            "The Ember Room",
            "Modern European",
            "Riverside",
            "Fire-led cooking, seasonal plates, and a low-lit dining room built for celebrations.",
            [new Table("ember-2a", 2), new Table("ember-2b", 2), new Table("ember-4a", 4), new Table("ember-6a", 6)]),
        new Restaurant(
            "miso-garden",
            "Miso Garden",
            "Japanese",
            "Old Market",
            "A calm izakaya with shared small plates, sake flights, and garden-facing booths.",
            [new Table("miso-2a", 2), new Table("miso-4a", 4), new Table("miso-4b", 4), new Table("miso-8a", 8)]),
        new Restaurant(
            "copper-vine",
            "Copper & Vine",
            "Mediterranean",
            "West End",
            "Sunlit mezze, handmade pasta, and generous tables for relaxed group dinners.",
            [new Table("copper-2a", 2), new Table("copper-4a", 4), new Table("copper-6a", 6), new Table("copper-8a", 8)]),
    ];
}
