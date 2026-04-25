import { useListBookings } from '../../api/bookings'

export default function BookingsList() {
  const { data, isLoading, error } = useListBookings()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border border-border bg-card p-4">
            <div className="h-5 w-1/3 rounded bg-muted" />
            <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-destructive">
        Failed to load bookings. Please try again later.
      </div>
    )
  }

  const bookings = data?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">My Bookings</h2>
        <p className="mt-1 text-muted-foreground">All your current reservations.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No bookings yet.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Head to the Restaurants tab to make your first reservation.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Table</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Party</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Customer
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{b.tableName}</td>
                    <td className="px-4 py-3 text-foreground">
                      {b.startTime
                        ? new Date(b.startTime).toLocaleString([], {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-foreground">{b.partySize}</td>
                    <td className="px-4 py-3 text-foreground">
                      <div>{b.customerName}</div>
                      <div className="text-xs text-muted-foreground">{b.customerEmail}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
