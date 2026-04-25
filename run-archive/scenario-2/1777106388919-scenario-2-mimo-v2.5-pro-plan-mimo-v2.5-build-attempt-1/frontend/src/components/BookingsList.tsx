import { useGetBookings } from '@/api/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function BookingsList() {
  const { data, isLoading, error } = useGetBookings()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="py-4">
                <div className="h-5 w-1/2 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">Failed to load bookings.</p>
      </div>
    )
  }

  const bookingsResponse = data?.status === 200 ? data.data : null
  const bookings = bookingsResponse ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="mt-1 text-muted-foreground">View and manage your reservations</p>
        </div>
        <Button render={<Link to="/" />} variant="outline" size="sm">
          Book New Table
        </Button>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-muted-foreground">You have no bookings yet.</p>
            <Button render={<Link to="/" />}>Browse Restaurants</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{booking.customerName}</span>
                      <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Restaurant: {booking.restaurantId} &middot; Table: {booking.tableId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.date} &middot; {booking.startTime?.substring(11, 16)} -{' '}
                      {booking.endTime?.substring(11, 16)} &middot; Party of {booking.partySize}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {booking.id}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
