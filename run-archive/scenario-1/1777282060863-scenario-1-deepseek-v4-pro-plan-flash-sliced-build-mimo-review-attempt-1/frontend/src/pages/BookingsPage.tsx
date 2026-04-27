import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getBookings } from '@/api/list-bookings-endpoint/list-bookings-endpoint'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function SkeletonRow() {
  return (
    <div className="flex animate-pulse items-center gap-4 rounded-lg border p-4">
      <div className="flex-1 space-y-2">
        <div className="h-5 w-1/3 rounded bg-muted" />
        <div className="h-4 w-1/2 rounded bg-muted" />
      </div>
      <div className="h-6 w-20 rounded-full bg-muted" />
    </div>
  )
}

function formatDateTime(dateTimeStr: string) {
  const date = new Date(dateTimeStr)
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function BookingsPage() {
  const {
    data: bookings,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const res = await getBookings()
      return res.data
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
        <div className="space-y-3">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Failed to load bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error instanceof Error
                ? error.message
                : 'An unexpected error occurred.'}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
        <Card>
          <CardHeader>
            <CardTitle>No bookings yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Book a table to get started!
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link to="/">Browse Restaurants</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">My Bookings</h2>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {booking.restaurantName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">When:</span>{' '}
                  <span className="font-medium">
                    {formatDateTime(booking.dateTime)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Party:</span>{' '}
                  <span className="font-medium">
                    {String(booking.partySize)} guest
                    {Number(booking.partySize) !== 1 ? 's' : ''}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Name:</span>{' '}
                  <span className="font-medium">{booking.customerName}</span>
                </div>
                <Badge variant="outline" className="ml-auto">
                  Confirmed
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default BookingsPage
