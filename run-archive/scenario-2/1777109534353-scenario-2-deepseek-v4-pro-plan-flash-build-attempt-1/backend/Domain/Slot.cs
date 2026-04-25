namespace Backend.Domain;

public record Slot(
    TimeOnly StartTime,
    Guid TableId,
    int Capacity,
    bool IsAvailable,
    int RemainingCapacity
);
