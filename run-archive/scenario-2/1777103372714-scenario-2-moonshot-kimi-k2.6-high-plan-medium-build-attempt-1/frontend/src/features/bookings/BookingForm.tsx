import { useState } from 'react'
import { useGetAvailableSlots } from '../../api/restaurants'
import { useCreateBooking } from '../../api/bookings'
import type { RestaurantBookingApiFeaturesBookingsCreateBookingRequest } from '../../api/restaurantBookingAPI.schemas'

interface Props {
  restaurantId: string
  onCancel: () => void
  onSuccess: (bookingId: string) => void
}

export default function BookingForm({ restaurantId, onCancel, onSuccess }: Props) {
  const [date, setDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  })
  const [partySize, setPartySize] = useState(2)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const slotsQuery = useGetAvailableSlots(restaurantId, {
    date,
    partySize,
  })

  const createBooking = useCreateBooking({
    mutation: {
      onSuccess: (response) => {
        const booking = response.data
        if (booking?.id) {
          onSuccess(booking.id)
        }
      },
      onError: (err: unknown) => {
        const axiosErr = err as { response?: { data?: { message?: string; error?: string } } }
        const message =
          axiosErr?.response?.data?.message ??
          axiosErr?.response?.data?.error ??
          'Booking failed. Please try again.'
        setFormError(message)
      },
    },
  })

  const slots = slotsQuery.data?.data ?? []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!selectedSlot) {
      setFormError('Please select an available time slot.')
      return
    }
    if (!customerName.trim() || !customerEmail.trim()) {
      setFormError('Please enter your name and email.')
      return
    }

    const payload: RestaurantBookingApiFeaturesBookingsCreateBookingRequest = {
      restaurantId,
      startTime: selectedSlot,
      partySize,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
    }

    createBooking.mutate({ data: payload })
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Back
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Make a Reservation
        </h2>
        <p className="mt-1 text-muted-foreground">Pick a date, party size, and available slot.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium text-foreground">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setDate(e.target.value)
                setSelectedSlot(null)
              }}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="partySize" className="text-sm font-medium text-foreground">
              Party Size
            </label>
            <input
              id="partySize"
              type="number"
              min={1}
              max={20}
              value={partySize}
              onChange={(e) => {
                setPartySize(Number(e.target.value))
                setSelectedSlot(null)
              }}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Available Slots</label>
          {slotsQuery.isLoading ? (
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-9 w-20 animate-pulse rounded-md bg-muted" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No available slots for this date and party size.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => {
                const time = new Date(slot.startTime!).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
                const isSelected = selectedSlot === slot.startTime
                return (
                  <button
                    key={slot.startTime}
                    type="button"
                    onClick={() => setSelectedSlot(slot.startTime!)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-foreground hover:bg-accent'
                    }`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {formError && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            {formError}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={createBooking.isPending}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
          >
            {createBooking.isPending ? 'Booking...' : 'Confirm Booking'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
