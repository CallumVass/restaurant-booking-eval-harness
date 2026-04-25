import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { CheckCircle2, CalendarDays, Clock, Users, User, Building2 } from 'lucide-react'
import type { BookingResponse } from '../api/model'

interface BookingConfirmationProps {
  restaurantName: string
  booking: BookingResponse
  onNewBooking: () => void
  onViewBookings: () => void
}

function toTimeDisplay(time: string): string {
  return time.slice(0, 5)
}

export function BookingConfirmation({
  restaurantName,
  booking,
  onNewBooking,
  onViewBookings,
}: BookingConfirmationProps) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-green-100 p-4">
          <CheckCircle2 className="size-12 text-green-600" />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-2">Booking Confirmed!</h2>
      <p className="text-muted-foreground mb-8">Your table has been reserved successfully.</p>

      <Card className="text-left">
        <CardHeader>
          <CardTitle className="text-lg">Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Restaurant</p>
              <p className="font-medium">{restaurantName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{booking.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{toTimeDisplay(booking.startTime)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Party Size</p>
              <p className="font-medium">
                {booking.partySize} {booking.partySize === 1 ? 'Guest' : 'Guests'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <User className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Guest Name</p>
              <p className="font-medium">{booking.guestName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Booking #{booking.id.slice(0, 8)}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3">
          <Button className="w-full" onClick={onViewBookings}>
            View My Bookings
          </Button>
          <Button variant="outline" className="w-full" onClick={onNewBooking}>
            Make Another Booking
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
