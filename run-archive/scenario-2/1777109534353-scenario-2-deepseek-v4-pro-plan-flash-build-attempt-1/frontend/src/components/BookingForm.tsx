import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAvailableSlots } from '../api/restaurants/restaurants'
import { createBooking } from '../api/bookings/bookings'
import type { GetAvailableSlotsParams } from '../api/model'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, CalendarDays, Clock, Users, User } from 'lucide-react'
import type { BookingResponse } from '../api/model'

interface BookingFormProps {
  restaurantId: string
  restaurantName: string
  onBack: () => void
  onConfirmed: (booking: BookingResponse) => void
}

function todayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function toTimeDisplay(time: string): string {
  return time.slice(0, 5)
}

export function BookingForm({ restaurantId, restaurantName, onBack, onConfirmed }: BookingFormProps) {
  const [date, setDate] = useState(todayString())
  const [partySize, setPartySize] = useState('2')
  const [selectedSlot, setSelectedSlot] = useState<{ time: string; tableId: string } | null>(null)
  const [guestName, setGuestName] = useState('')

  const params: GetAvailableSlotsParams = { date, partySize: Number(partySize) }

  const slotsQuery = useQuery({
    queryKey: ['slots', restaurantId, date, partySize],
    queryFn: () => getAvailableSlots(restaurantId, params),
    enabled: !!date && !!partySize && Number(partySize) >= 1 && Number(partySize) <= 20,
  })

  const bookingMutation = useMutation({
    mutationFn: () => {
      if (!selectedSlot) throw new Error('No slot selected')
      return createBooking({
        restaurantId,
        tableId: selectedSlot.tableId,
        date,
        startTime: selectedSlot.time,
        partySize: Number(partySize),
        guestName,
      })
    },
    onSuccess: (response) => {
      if (response.status === 201) {
        toast.success('Booking confirmed!')
        onConfirmed(response.data)
      } else {
        const errData = response as unknown as { data?: { error?: string } }
        toast.error(errData.data?.error || 'Failed to create booking')
      }
    },
    onError: () => {
      toast.error('Failed to create booking')
    },
  })

  const canSubmit = selectedSlot && guestName.trim().length > 0 && !bookingMutation.isPending

  const allAvailableSlots: Array<{ startTime: string; tableId: string; isAvailable: boolean }> =
    slotsQuery.data?.data?.slots?.filter((s: { isAvailable: boolean }) => s.isAvailable) ?? []
  const uniqueTimes = [...new Set(allAvailableSlots.map((s) => s.startTime))].sort()

  const selectTime = (time: string) => {
    const slot = allAvailableSlots.find((s) => s.startTime === time)
    if (slot) setSelectedSlot({ time: slot.startTime, tableId: slot.tableId })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="size-4 mr-2" />
        Back to restaurants
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Book a Table</CardTitle>
          <CardDescription>{restaurantName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date">
              <CalendarDays className="size-4 inline mr-1" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              min={todayString()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDate(e.target.value)
                setSelectedSlot(null)
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="party-size">
              <Users className="size-4 inline mr-1" />
              Party Size
            </Label>
            <Select
              value={partySize}
              onValueChange={(v: string) => {
                setPartySize(v)
                setSelectedSlot(null)
              }}
            >
              <SelectTrigger id="party-size">
                <SelectValue placeholder="Select party size" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              <Clock className="size-4 inline mr-1" />
              Available Times
            </Label>
            {slotsQuery.isLoading && (
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-9 w-24" />
                ))}
              </div>
            )}
            {slotsQuery.error && (
              <Alert variant="destructive">
                <AlertDescription>{(slotsQuery.error as Error).message}</AlertDescription>
              </Alert>
            )}
            {slotsQuery.isSuccess && uniqueTimes.length === 0 && (
              <Alert>
                <AlertDescription>No available time slots for this date and party size.</AlertDescription>
              </Alert>
            )}
            {uniqueTimes.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {uniqueTimes.map((time: string) => (
                  <Badge
                    key={time}
                    variant={selectedSlot?.time === time ? 'default' : 'outline'}
                    className="cursor-pointer text-sm py-2 px-4"
                    onClick={() => selectTime(time)}
                  >
                    {toTimeDisplay(time)}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guest-name">
              <User className="size-4 inline mr-1" />
              Your Name
            </Label>
            <Input
              id="guest-name"
              placeholder="Enter your name"
              value={guestName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGuestName(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={!canSubmit} onClick={() => bookingMutation.mutate()}>
            {bookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
