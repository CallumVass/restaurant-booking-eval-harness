import { CheckCircle2, CalendarDays, Clock, Users, User, Mail, ArrowLeft } from 'lucide-react'
import type { Booking } from '@/api/booking-api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface BookingConfirmationProps {
  booking: Booking
  restaurantName: string
  onViewBookings: () => void
  onBookAnother: () => void
}

function formatDateTime(dateTime: string) {
  const d = new Date(dateTime)
  const date = d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return { date, time }
}

function BookingConfirmation({
  booking,
  restaurantName,
  onViewBookings,
  onBookAnother,
}: BookingConfirmationProps) {
  const { date, time } = formatDateTime(booking.dateTime)

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 text-center">
        <CheckCircle2 className="mx-auto mb-2 size-12 text-emerald-500" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
          Booking Confirmed!
        </h2>
        <p className="mt-1 text-muted-foreground">Your table has been reserved.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{restaurantName}</CardTitle>
          <CardDescription>Booking Reference: {booking.id.slice(0, 8)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="size-5 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">{date}</p>
              <p className="text-xs text-muted-foreground">Date</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="size-5 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">{time}</p>
              <p className="text-xs text-muted-foreground">Time</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="size-5 text-muted-foreground" aria-hidden="true" />
            <div>
              <Badge variant="secondary">{booking.partySize} guests</Badge>
              <p className="text-xs text-muted-foreground">Party Size</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <User className="size-5 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">{booking.guestName}</p>
              <p className="text-xs text-muted-foreground">Guest Name</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="size-5 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium">{booking.guestEmail}</p>
              <p className="text-xs text-muted-foreground">Guest Email</p>
            </div>
          </div>

          <Separator />

          <p className="text-xs text-muted-foreground">Table will be assigned upon arrival.</p>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onViewBookings}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              View All Bookings
            </Button>
            <Button className="flex-1" onClick={onBookAnother}>
              Book Another
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BookingConfirmation
