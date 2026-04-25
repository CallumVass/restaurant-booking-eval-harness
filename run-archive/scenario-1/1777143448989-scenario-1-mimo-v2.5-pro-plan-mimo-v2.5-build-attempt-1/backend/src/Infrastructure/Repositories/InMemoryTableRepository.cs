using System.Collections.Concurrent;
using RestaurantBooking.Domain.Tables;

namespace RestaurantBooking.Infrastructure.Repositories;

public sealed class InMemoryTableRepository : ITableRepository
{
    private readonly ConcurrentBag<Table> _tables = new();

    public InMemoryTableRepository()
    {
        var seeds = new[]
        {
            new Table { Id = Guid.Parse("a1111111-1111-1111-1111-111111111111"), RestaurantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), Seats = 2 },
            new Table { Id = Guid.Parse("a1111111-1111-1111-1111-111111111112"), RestaurantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), Seats = 4 },
            new Table { Id = Guid.Parse("a1111111-1111-1111-1111-111111111113"), RestaurantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), Seats = 6 },
            new Table { Id = Guid.Parse("a1111111-1111-1111-1111-111111111114"), RestaurantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), Seats = 8 },
            new Table { Id = Guid.Parse("a1111111-1111-1111-1111-111111111115"), RestaurantId = Guid.Parse("11111111-1111-1111-1111-111111111111"), Seats = 12 },

            new Table { Id = Guid.Parse("b2222222-2222-2222-2222-222222222221"), RestaurantId = Guid.Parse("22222222-2222-2222-2222-222222222222"), Seats = 2 },
            new Table { Id = Guid.Parse("b2222222-2222-2222-2222-222222222222"), RestaurantId = Guid.Parse("22222222-2222-2222-2222-222222222222"), Seats = 4 },
            new Table { Id = Guid.Parse("b2222222-2222-2222-2222-222222222223"), RestaurantId = Guid.Parse("22222222-2222-2222-2222-222222222222"), Seats = 6 },
            new Table { Id = Guid.Parse("b2222222-2222-2222-2222-222222222224"), RestaurantId = Guid.Parse("22222222-2222-2222-2222-222222222222"), Seats = 8 },

            new Table { Id = Guid.Parse("c3333333-3333-3333-3333-333333333331"), RestaurantId = Guid.Parse("33333333-3333-3333-3333-333333333333"), Seats = 2 },
            new Table { Id = Guid.Parse("c3333333-3333-3333-3333-333333333332"), RestaurantId = Guid.Parse("33333333-3333-3333-3333-333333333333"), Seats = 4 },
            new Table { Id = Guid.Parse("c3333333-3333-3333-3333-333333333333"), RestaurantId = Guid.Parse("33333333-3333-3333-3333-333333333333"), Seats = 6 },
            new Table { Id = Guid.Parse("c3333333-3333-3333-3333-333333333334"), RestaurantId = Guid.Parse("33333333-3333-3333-3333-333333333333"), Seats = 10 },

            new Table { Id = Guid.Parse("d4444444-4444-4444-4444-444444444441"), RestaurantId = Guid.Parse("44444444-4444-4444-4444-444444444444"), Seats = 2 },
            new Table { Id = Guid.Parse("d4444444-4444-4444-4444-444444444442"), RestaurantId = Guid.Parse("44444444-4444-4444-4444-444444444444"), Seats = 4 },
            new Table { Id = Guid.Parse("d4444444-4444-4444-4444-444444444443"), RestaurantId = Guid.Parse("44444444-4444-4444-4444-444444444444"), Seats = 6 },

            new Table { Id = Guid.Parse("e5555555-5555-5555-5555-555555555551"), RestaurantId = Guid.Parse("55555555-5555-5555-5555-555555555555"), Seats = 2 },
            new Table { Id = Guid.Parse("e5555555-5555-5555-5555-555555555552"), RestaurantId = Guid.Parse("55555555-5555-5555-5555-555555555555"), Seats = 4 },
            new Table { Id = Guid.Parse("e5555555-5555-5555-5555-555555555553"), RestaurantId = Guid.Parse("55555555-5555-5555-5555-555555555555"), Seats = 6 },
            new Table { Id = Guid.Parse("e5555555-5555-5555-5555-555555555554"), RestaurantId = Guid.Parse("55555555-5555-5555-5555-555555555555"), Seats = 8 },
            new Table { Id = Guid.Parse("e5555555-5555-5555-5555-555555555555"), RestaurantId = Guid.Parse("55555555-5555-5555-5555-555555555555"), Seats = 10 },
            new Table { Id = Guid.Parse("e5555555-5555-5555-5555-555555555556"), RestaurantId = Guid.Parse("55555555-5555-5555-5555-555555555555"), Seats = 14 },
        };

        foreach (var table in seeds)
            _tables.Add(table);
    }

    public Task<IReadOnlyList<Table>> GetByRestaurantAsync(Guid restaurantId) =>
        Task.FromResult<IReadOnlyList<Table>>(_tables.Where(t => t.RestaurantId == restaurantId).ToList());
}
