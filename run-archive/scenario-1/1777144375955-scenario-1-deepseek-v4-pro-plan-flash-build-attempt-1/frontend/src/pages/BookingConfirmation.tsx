import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchBooking } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export default function BookingConfirmation() {
  const { id } = useParams<{ id: string }>()

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => fetchBooking(id!),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg">
        <Skeleton className="mb-4 h-8 w-48" />
        <Skeleton className="h-72 w-full" />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Booking Not Found</h1>
        <p className="text-muted-foreground">We couldn't find a booking with that ID.</p>
        <Link to="/">
          <Button>Back to Restaurants</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-green-600">Booking Confirmed!</h1>
        <p className="text-muted-foreground">Your table has been reserved.</p>
      </div>

      <Card className="print:border-none">
        <CardHeader>
          <CardTitle>{booking.restaurantName}</CardTitle>
          <CardDescription>Booking reference: {booking.id.slice(0, 8)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium text-right">{booking.date}</span>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium text-right">
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Party Size</span>
            <span className="font-medium text-right">
              {booking.partySize} {booking.partySize === 1 ? 'guest' : 'guests'}
            </span>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium text-right">{booking.customerName}</span>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-right">{booking.customerEmail}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center gap-4 print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          Print
        </Button>
        <Link to="/">
          <Button>Book Another</Button>
        </Link>
      </div>
    </div>
  )
}
