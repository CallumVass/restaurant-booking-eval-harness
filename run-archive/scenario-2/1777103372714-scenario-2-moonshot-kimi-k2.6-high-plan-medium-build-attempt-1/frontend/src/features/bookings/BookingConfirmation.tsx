import { useGetBooking } from '../../api/bookings'

interface Props {
  bookingId: string
  onDone: () => void
}

export default function BookingConfirmation({ bookingId, onDone }: Props) {
  const { data, isLoading, error } = useGetBooking(bookingId)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl animate-pulse space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="h-6 w-1/2 rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
      </div>
    )
  }

  if (error || !data?.data) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-destructive">
        Unable to load booking confirmation.
        <div className="mt-4">
          <button
            onClick={onDone}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Go to My Bookings
          </button>
        </div>
      </div>
    )
  }

  const b = data.data

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Booking Confirmed</h2>
            <p className="text-sm text-muted-foreground">Your reservation has been saved.</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-3 text-sm">
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-muted-foreground">Booking ID</dt>
            <dd className="font-medium text-foreground">{b.id}</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-muted-foreground">Table</dt>
            <dd className="font-medium text-foreground">{b.tableName}</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-muted-foreground">Date & Time</dt>
            <dd className="font-medium text-foreground">
              {b.startTime
                ? new Date(b.startTime).toLocaleString([], {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : '-'}
            </dd>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-muted-foreground">Party Size</dt>
            <dd className="font-medium text-foreground">{b.partySize}</dd>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium text-foreground">{b.customerName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium text-foreground">{b.customerEmail}</dd>
          </div>
        </dl>

        <div className="mt-6">
          <button
            onClick={onDone}
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  )
}
