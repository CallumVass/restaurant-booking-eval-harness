import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchRestaurant, fetchAvailability, submitBooking } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function BookingForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [date, setDate] = useState('')
  const [partySize, setPartySize] = useState('2')
  const [selectedTime, setSelectedTime] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const today = new Date().toISOString().split('T')[0]

  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => fetchRestaurant(id!),
    enabled: !!id,
  })

  const { data: availability, isFetching: availabilityLoading } = useQuery({
    queryKey: ['availability', id, date, partySize],
    queryFn: () => fetchAvailability(id!, date, Number(partySize)),
    enabled: !!id && !!date && Number(partySize) > 0,
  })

  const mutation = useMutation({
    mutationFn: () =>
      submitBooking({
        restaurantId: id!,
        customerName,
        customerEmail,
        date,
        time: selectedTime,
        partySize: Number(partySize),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      navigate(`/bookings/${data.id}`)
    },
    onError: (err: unknown) => {
      const error = err as { status?: number; body?: { code?: string; message?: string } }
      const code = error?.body?.code
      const message = error?.body?.message ?? 'An error occurred'

      if (code === 'CONFLICT' || code === 'SLOT_UNAVAILABLE') {
        toast.error(message)
      } else if (
        code === 'VALIDATION' ||
        code === 'INVALID_DATE' ||
        code === 'INVALID_TIME' ||
        code === 'INVALID_PARTY_SIZE'
      ) {
        setFieldErrors({ general: message })
        toast.error(message)
      } else {
        toast.error(message)
      }
    },
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setFieldErrors({})

      const errors: Record<string, string> = {}
      if (!customerName.trim()) errors.name = 'Name is required'
      if (!customerEmail.trim()) errors.email = 'Email is required'
      if (!date) errors.date = 'Date is required'
      if (!selectedTime) errors.time = 'Please select a time slot'

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        return
      }

      mutation.mutate()
    },
    [customerName, customerEmail, date, selectedTime, mutation],
  )

  if (restaurantLoading) {
    return (
      <div className="mx-auto max-w-lg">
        <Skeleton className="mb-4 h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Restaurant Not Found</h1>
        <p className="text-muted-foreground">The restaurant you are looking for does not exist.</p>
        <Link to="/">
          <Button>Back to Restaurants</Button>
        </Link>
      </div>
    )
  }

  const maxCapacity = Math.max(...restaurant.tables.map((t) => t.capacity))

  return (
    <div className="mx-auto max-w-lg">
      <Link to="/" className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground transition-colors">
        &larr; Back to Restaurants
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Book at {restaurant.name}</CardTitle>
          <Badge variant="secondary" className="w-fit">
            {restaurant.cuisine}
          </Badge>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value)
                    setSelectedTime('')
                  }}
                  required
                />
                {fieldErrors.date && <p className="text-sm text-destructive">{fieldErrors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="partySize">Party Size</Label>
                <Input
                  id="partySize"
                  type="number"
                  min={1}
                  max={maxCapacity}
                  value={partySize}
                  onChange={(e) => {
                    setPartySize(e.target.value)
                    setSelectedTime('')
                  }}
                  required
                />
                <p className="text-xs text-muted-foreground">Max {maxCapacity} guests</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Available Times</Label>
              {!date ? (
                <p className="text-sm text-muted-foreground">Select a date to see available times.</p>
              ) : availabilityLoading ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-20" />
                  ))}
                </div>
              ) : !availability?.slots?.length ? (
                <p className="text-sm text-muted-foreground">No available time slots for this date and party size.</p>
              ) : (
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Available time slots">
                  {availability.slots.map((slot) => {
                    const isSelected = selectedTime === slot.startTime
                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setSelectedTime(slot.startTime)}
                        className={`inline-flex h-9 min-w-20 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {slot.startTime.slice(0, 5)}
                      </button>
                    )
                  })}
                </div>
              )}
              {fieldErrors.time && <p className="text-sm text-destructive">{fieldErrors.time}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
                {fieldErrors.name && <p className="text-sm text-destructive">{fieldErrors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
                {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
              </div>
            </div>

            {fieldErrors.general && <p className="text-sm text-destructive">{fieldErrors.general}</p>}

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
