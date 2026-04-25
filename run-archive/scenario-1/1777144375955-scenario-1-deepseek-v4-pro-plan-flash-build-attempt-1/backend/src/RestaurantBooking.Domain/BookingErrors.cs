namespace RestaurantBooking.Domain;

public static class BookingErrors
{
    public static readonly Error RestaurantNotFound = new("RESTAURANT_NOT_FOUND", "The specified restaurant does not exist.");
    public static Error InvalidPartySize(int maxCapacity) => new("INVALID_PARTY_SIZE", $"Party size exceeds maximum table capacity of {maxCapacity}.");
    public static readonly Error ZeroPartySize = new("INVALID_PARTY_SIZE", "Party size must be at least 1.");
    public static readonly Error DateInPast = new("INVALID_DATE", "Booking date must be in the future.");
    public static readonly Error OutsideOperatingHours = new("INVALID_TIME", "Booking time must be between 11:00 and 22:00.");
    public static readonly Error SlotUnavailable = new("SLOT_UNAVAILABLE", "The requested time slot is not available.");
    public static readonly Error ConflictDetected = new("CONFLICT", "The requested time slot conflicts with an existing booking.");
    public static readonly Error NoTablesAvailable = new("NO_TABLES", "No tables available for the requested party size and time.");
    public static readonly Error CustomerNameRequired = new("VALIDATION", "Customer name is required.");
    public static readonly Error CustomerEmailRequired = new("VALIDATION", "Customer email is required.");
}
