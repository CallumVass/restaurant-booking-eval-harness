namespace Domain.Models;

public record Restaurant(
    string Id,
    string Name,
    string Description,
    string Cuisine,
    IReadOnlyList<Table> Tables);

public record Table(string Id, int Capacity);
