import { useListRestaurants } from '../../api/restaurants'

interface Props {
  onBook: (restaurantId: string) => void
}

export default function RestaurantList({ onBook }: Props) {
  const { data, isLoading, error } = useListRestaurants()

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border border-border bg-card p-5">
            <div className="h-5 w-1/2 rounded bg-muted" />
            <div className="mt-3 h-4 w-3/4 rounded bg-muted" />
            <div className="mt-4 h-9 w-28 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-destructive">
        Failed to load restaurants. Please try again later.
      </div>
    )
  }

  const restaurants = data?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Choose a Restaurant
        </h2>
        <p className="mt-1 text-muted-foreground">
          Select a venue to see available tables and make a reservation.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((r) => (
          <div
            key={r.id}
            className="flex flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-foreground">{r.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {r.tables?.map((t) => (
                <span
                  key={t.id}
                  className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {t.name} · seats {t.capacity}
                </span>
              ))}
            </div>
            <div className="mt-auto pt-4">
              <button
                onClick={() => onBook(r.id!)}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Book a table
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
