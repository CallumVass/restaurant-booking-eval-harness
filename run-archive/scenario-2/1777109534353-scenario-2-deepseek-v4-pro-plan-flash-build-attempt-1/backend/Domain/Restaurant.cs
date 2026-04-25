namespace Backend.Domain;

public record Restaurant(Guid Id, string Name, string Description, List<Table> Tables);
