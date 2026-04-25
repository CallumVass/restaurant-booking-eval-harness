import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchBookings } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export default function BookingList() {
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings,
  })

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">My Bookings</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Oops!</h1>
        <p className="text-muted-foreground">Unable to load bookings. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (!bookings?.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-bold">No Bookings Yet</h1>
        <p className="text-muted-foreground">You haven't made any reservations yet.</p>
        <Link to="/">
          <Button>Browse Restaurants</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My Bookings</h1>
      <div className="space-y-4">
        {bookings.map((b) => (
          <Link key={b.id} to={`/bookings/${b.id}`} className="block">
            <Card className="transition-colors hover:bg-accent/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{b.restaurantName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {b.date} &middot; {b.startTime} - {b.endTime}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {b.partySize} {b.partySize === 1 ? 'guest' : 'guests'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-muted-foreground">
                  {b.customerName} &middot; {b.customerEmail}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
