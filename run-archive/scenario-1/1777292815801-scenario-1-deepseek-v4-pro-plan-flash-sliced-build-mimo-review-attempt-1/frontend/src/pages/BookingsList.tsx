import { useState } from 'react'
import { useGetRestaurants, useGetRestaurantBookings } from '@/api/booking-api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

function formatTime(dateTime: string) {
  const d = new Date(dateTime)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function BookingsList() {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null)

  const { data: restaurantsResponse } = useGetRestaurants()
  const restaurants = restaurantsResponse?.data ?? []

  const { data: bookingsResponse, isLoading } = useGetRestaurantBookings(
    selectedRestaurantId ?? '',
    { date },
    { query: { enabled: !!selectedRestaurantId && !!date } },
  )
  const bookings = bookingsResponse?.data ?? []

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-6 text-2xl font-bold">Bookings</h2>

      <Card className="mb-6">
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 space-y-2">
              <Label htmlFor="booking-restaurant">Restaurant</Label>
              <Select value={selectedRestaurantId ?? ''} onValueChange={setSelectedRestaurantId}>
                <SelectTrigger id="booking-restaurant" className="w-full">
                  <SelectValue placeholder="Select a restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {restaurants.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="booking-date">Date</Label>
              <Input
                id="booking-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {!selectedRestaurantId ? (
        <div className="flex min-h-[20vh] items-center justify-center text-muted-foreground">
          Select a restaurant and date to view bookings
        </div>
      ) : isLoading ? (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : bookings.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-muted-foreground">
              No bookings for this date
            </CardTitle>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Party Size</TableHead>
                  <TableHead>Table</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.guestName}</TableCell>
                    <TableCell className="text-muted-foreground">{booking.guestEmail}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatTime(booking.dateTime)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{booking.partySize}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {booking.tableId.slice(0, 8)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BookingsList
