import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetRestaurantById, useGetAvailableSlots, useCreateBooking } from '@/api/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import type { TimeSlot } from '@/api/model'

export function BookingPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>()
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState('')
  const [partySize, setPartySize] = useState(2)
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [bookingResult, setBookingResult] = useState<{
    id: string
    tableId: string
  } | null>(null)

  const { data: restaurantResponse, isLoading: loadingRestaurant } = useGetRestaurantById(
    restaurantId ?? '',
    { query: { enabled: !!restaurantId } }
  )

  const { data: slotsData, isLoading: loadingSlots } = useGetAvailableSlots(
    restaurantId ?? '',
    { date: selectedDate, partySize },
    { query: { enabled: !!restaurantId && partySize > 0 } }
  )

  const createBooking = useCreateBooking()

  const restaurant = restaurantResponse?.status === 200 ? restaurantResponse.data : null
  const slots = slotsData?.status === 200 ? (slotsData.data ?? []) : []
  const availableSlots = slots.filter((s) => s.isAvailable)

  const handleBook = async () => {
    if (!selectedSlot || !customerName.trim()) return

    try {
      const result = await createBooking.mutateAsync({
        data: {
          restaurantId: restaurantId ?? null,
          customerName: customerName.trim(),
          partySize,
          date: selectedDate,
          startTime: selectedSlot.start,
        },
      })
      if (result.status === 201) {
        setBookingResult({
          id: result.data.id ?? '',
          tableId: result.data.tableId ?? '',
        })
        setShowConfirmation(true)
      }
    } catch {
      // Error handled by mutation
    }
  }

  if (loadingRestaurant) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">Restaurant not found.</p>
        <Button variant="link" onClick={() => navigate('/')}>
          Back to restaurants
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-2">
          &larr; Back to restaurants
        </Button>
        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        <p className="text-muted-foreground">{restaurant.address}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Make a Reservation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="party-size">Party Size</Label>
              <Input
                id="party-size"
                type="number"
                min={1}
                max={20}
                value={partySize}
                onChange={(e) => setPartySize(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingSlots ? (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No time slots available for this date.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {slots.map((slot) => {
                const startTime = slot.start.substring(11, 16)
                const isSelected = selectedSlot?.start === slot.start
                return (
                  <Button
                    key={slot.start}
                    variant={isSelected ? 'default' : slot.isAvailable ? 'outline' : 'ghost'}
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedSlot(slot)}
                    className="h-10"
                  >
                    {startTime}
                  </Button>
                )
              })}
            </div>
          )}
          {!loadingSlots && availableSlots.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              {availableSlots.length} slot{availableSlots.length !== 1 ? 's' : ''} available
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!selectedSlot || !customerName.trim() || createBooking.isPending}
          onClick={handleBook}
        >
          {createBooking.isPending ? 'Booking...' : 'Confirm Booking'}
        </Button>
      </div>

      {createBooking.isError && (
        <Card className="border-destructive">
          <CardContent className="py-3">
            <p className="text-sm text-destructive">
              {createBooking.error instanceof Error
                ? createBooking.error.message
                : 'Booking failed. Please try again.'}
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Confirmed!</DialogTitle>
            <DialogDescription>Your reservation has been successfully created.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking ID:</span>
              <Badge variant="outline">{bookingResult?.id}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Table:</span>
              <span>{bookingResult?.tableId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{selectedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span>
                {selectedSlot?.start.substring(11, 16)} - {selectedSlot?.end.substring(11, 16)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Party Size:</span>
              <span>{partySize}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => navigate('/bookings')}>
              View All Bookings
            </Button>
            <Button
              onClick={() => {
                setShowConfirmation(false)
                navigate('/')
              }}
            >
              Back to Restaurants
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
