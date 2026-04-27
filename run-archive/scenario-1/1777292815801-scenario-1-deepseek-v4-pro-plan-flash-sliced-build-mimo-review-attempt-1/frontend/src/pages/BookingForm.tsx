import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import {
  useGetRestaurant,
  useGetRestaurantTables,
  useGetAvailableSlots,
  useCreateBooking,
} from '@/api/booking-api'
import type { Booking, ApiError } from '@/api/booking-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface BookingFormProps {
  restaurantId: string
  onBack: () => void
  onBookingCreated: (booking: Booking, restaurantName: string, restaurantId: string) => void
}

function BookingForm({ restaurantId, onBack, onBookingCreated }: BookingFormProps) {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [partySize, setPartySize] = useState(2)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  const { data: restaurantResponse, isLoading: restaurantLoading } = useGetRestaurant(restaurantId)
  const { data: tablesResponse } = useGetRestaurantTables(restaurantId)
  const {
    data: slotsResponse,
    isLoading: slotsLoading,
    isFetching: slotsFetching,
  } = useGetAvailableSlots(
    restaurantId,
    { date, partySize },
    { query: { enabled: !!date && partySize > 0 } },
  )

  const restaurant = restaurantResponse?.data
  const tables = tablesResponse?.data ?? []
  const slots = slotsResponse?.data ?? []
  const maxCapacity = tables.length > 0 ? Math.max(...tables.map((t) => t.capacity)) : 20

  const createBookingMutation = useCreateBooking()

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (!selectedSlot) {
        toast.error('Please select a time slot')
        return
      }

      const dateTime = `${date}T${selectedSlot}:00`

      createBookingMutation.mutate(
        { id: restaurantId, data: { guestName, guestEmail, partySize, dateTime } },
        {
          onSuccess: (response) => {
            onBookingCreated(response.data as Booking, restaurant?.name ?? '', restaurantId)
          },
          onError: (err: ApiError) => {
            toast.error(err?.error || 'Failed to create booking')
          },
        },
      )
    },
    [
      date,
      selectedSlot,
      guestName,
      guestEmail,
      partySize,
      restaurantId,
      restaurant?.name,
      createBookingMutation,
      onBookingCreated,
    ],
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
      <div className="mx-auto max-w-lg text-center">
        <Card>
          <CardHeader>
            <CardTitle>Restaurant not found</CardTitle>
            <CardDescription>The restaurant you're looking for does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to restaurants
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg">
      <Button onClick={onBack} variant="ghost" size="sm" className="mb-4">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to restaurants
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Book a Table at {restaurant.name}</CardTitle>
          <CardDescription>
            <Badge variant="secondary" className="mr-2">
              {restaurant.cuisine}
            </Badge>
            {restaurant.address}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="booking-date">Date</Label>
              <Input
                id="booking-date"
                type="date"
                min={today}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                  setSelectedSlot('')
                }}
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="party-size">Party Size</Label>
              <Input
                id="party-size"
                type="number"
                min={1}
                max={maxCapacity}
                value={partySize}
                onChange={(e) => {
                  setPartySize(Number(e.target.value))
                  setSelectedSlot('')
                }}
                required
                aria-required="true"
              />
              <p className="text-xs text-muted-foreground">
                Maximum capacity: {maxCapacity} guests
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time-slot">Time Slot</Label>
              <Select value={selectedSlot ?? ''} onValueChange={setSelectedSlot}>
                <SelectTrigger id="time-slot" className="w-full">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {slotsLoading || slotsFetching ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      <span className="ml-2 text-sm">Loading slots...</span>
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No available slots for this date and party size
                    </div>
                  ) : (
                    slots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedSlot && (
                <p className="text-xs text-muted-foreground">
                  Table will be auto-assigned based on party size
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="guest-name">Guest Name</Label>
              <Input
                id="guest-name"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your name"
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guest-email">Guest Email</Label>
              <Input
                id="guest-email"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="your@email.com"
                required
                aria-required="true"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createBookingMutation.isPending || !selectedSlot}
            >
              {createBookingMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Creating booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingForm
