import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getRestaurants } from '@/api/list-restaurants-endpoint/list-restaurants-endpoint'
import { getRestaurantsIdSlots } from '@/api/get-slots-endpoint/get-slots-endpoint'
import { postBookings } from '@/api/create-booking-endpoint/create-booking-endpoint'
import type { CreateBookingRequest } from '@/api/schemas'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function SkeletonChips() {
  return (
    <div className="flex animate-pulse flex-wrap gap-2">
      <div className="h-7 w-16 rounded-full bg-muted" />
      <div className="h-7 w-16 rounded-full bg-muted" />
      <div className="h-7 w-16 rounded-full bg-muted" />
      <div className="h-7 w-16 rounded-full bg-muted" />
      <div className="h-7 w-16 rounded-full bg-muted" />
    </div>
  )
}

function BookPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [selectedRestaurant, setSelectedRestaurant] = useState(
    restaurantId ?? '',
  )
  const [date, setDate] = useState('')
  const [partySize, setPartySize] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const today = new Date().toISOString().split('T')[0]
  const numericPartySize = partySize ? parseInt(partySize, 10) : 0

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const res = await getRestaurants()
      return res.data
    },
  })

  const {
    data: slots,
    isLoading: slotsLoading,
    isError: slotsError,
    refetch: refetchSlots,
  } = useQuery({
    queryKey: ['slots', selectedRestaurant, date, numericPartySize],
    queryFn: async () => {
      const res = await getRestaurantsIdSlots(selectedRestaurant, {
        date,
        partySize: numericPartySize,
      })
      if (res.status !== 200) {
        throw new Error(
          typeof res.data === 'string'
            ? res.data
            : 'Failed to load available slots',
        )
      }
      return res.data as string[]
    },
    enabled:
      selectedRestaurant.length > 0 && date.length > 0 && numericPartySize > 0,
  })

  const createMutation = useMutation({
    mutationFn: async (body: CreateBookingRequest) => {
      const res = await postBookings(body)
      if (res.status !== 201) {
        const message =
          typeof res.data === 'string' ? res.data : 'Booking failed'
        const err = new Error(message)
        ;(err as Error & { status: number }).status = res.status
        throw err
      }
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking confirmed!')
      navigate('/bookings')
    },
    onError: (err: Error & { status?: number }) => {
      if (err.status === 409) {
        setFormError(
          'This time slot is no longer available. Please choose another.',
        )
      } else if (err.status === 400) {
        setFormError('Invalid booking details. Please check your input.')
      } else if (err.status === 404) {
        setFormError('Restaurant not found.')
      } else {
        setFormError(err.message || 'An unexpected error occurred.')
      }
    },
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setFormError(null)

      if (!selectedSlot) return

      const dateTime = `${date}T${selectedSlot}:00`
      const body: CreateBookingRequest = {
        restaurantId: selectedRestaurant,
        dateTime,
        partySize: numericPartySize,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
      }
      createMutation.mutate(body)
    },
    [
      selectedSlot,
      date,
      selectedRestaurant,
      numericPartySize,
      customerName,
      customerEmail,
      createMutation,
    ],
  )

  const isValid =
    selectedRestaurant.length > 0 &&
    date.length > 0 &&
    numericPartySize > 0 &&
    selectedSlot.length > 0 &&
    customerName.trim().length > 0 &&
    customerEmail.trim().length > 0

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Book a Table</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="restaurant">Restaurant</Label>
          <Select
            value={selectedRestaurant}
            onValueChange={(value) => {
              setSelectedRestaurant(value)
              setSelectedSlot('')
              setFormError(null)
            }}
          >
            <SelectTrigger id="restaurant" aria-label="Select a restaurant">
              <SelectValue placeholder="Select a restaurant" />
            </SelectTrigger>
            <SelectContent>
              {restaurants?.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              min={today}
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                setSelectedSlot('')
                setFormError(null)
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="partySize">Party Size</Label>
            <Input
              id="partySize"
              type="number"
              min={1}
              placeholder="Number of guests"
              value={partySize}
              onChange={(e) => {
                setPartySize(e.target.value)
                setSelectedSlot('')
                setFormError(null)
              }}
            />
          </div>
        </div>

        {slotsLoading && (
          <div className="space-y-2">
            <Label>Available Times</Label>
            <SkeletonChips />
          </div>
        )}

        {slotsError && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-sm text-destructive">
                Failed to load available times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetchSlots()}
              >
                Try again
              </Button>
            </CardContent>
          </Card>
        )}

        {slots && slots.length > 0 && !slotsLoading && (
          <div className="space-y-2">
            <Label>Available Times</Label>
            <div
              className="flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Available time slots"
            >
              {slots.map((slot) => (
                <Badge
                  key={slot}
                  variant={selectedSlot === slot ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1.5 text-sm"
                  role="radio"
                  aria-checked={selectedSlot === slot}
                  tabIndex={0}
                  onClick={() => {
                    setSelectedSlot(slot)
                    setFormError(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelectedSlot(slot)
                      setFormError(null)
                    }
                  }}
                >
                  {slot}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {slots && slots.length === 0 && !slotsLoading && (
          <p className="text-sm text-muted-foreground">
            No available slots for this date and party size. Try a different
            date or smaller party.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customerName">Name</Label>
            <Input
              id="customerName"
              placeholder="Your name"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value)
                setFormError(null)
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              type="email"
              placeholder="you@example.com"
              value={customerEmail}
              onChange={(e) => {
                setCustomerEmail(e.target.value)
                setFormError(null)
              }}
            />
          </div>
        </div>

        {formError && (
          <div
            className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {formError}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={!isValid || createMutation.isPending}
        >
          {createMutation.isPending ? 'Booking...' : 'Confirm Booking'}
        </Button>
      </form>
    </div>
  )
}

export default BookPage
