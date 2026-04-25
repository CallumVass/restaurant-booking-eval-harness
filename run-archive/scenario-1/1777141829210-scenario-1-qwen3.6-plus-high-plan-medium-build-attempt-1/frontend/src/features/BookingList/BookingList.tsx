import { useGetBookings } from '@/api/generated';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Clock, Users } from 'lucide-react';

export function BookingList() {
  const { data, isLoading } = useGetBookings();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Existing Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const bookings = data?.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="size-5 text-amber-600" />
          Existing Bookings
        </CardTitle>
        <CardDescription>
          {bookings.length === 0
            ? 'No bookings yet. Make your first reservation!'
            : `${bookings.length} booking${bookings.length > 1 ? 's' : ''} found`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Calendar className="mx-auto mb-3 size-12 text-muted-foreground/50" />
            <p>No reservations yet</p>
            <p className="text-sm">Book a table to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => {
                  const isUpcoming = new Date(booking.dateTime) > new Date();
                  return (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{booking.guestName}</p>
                          <p className="text-xs text-muted-foreground">{booking.guestEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{booking.restaurantId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="size-3" />
                          {booking.partySize}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {new Date(booking.dateTime).toLocaleDateString()}{' '}
                          {new Date(booking.dateTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isUpcoming ? 'default' : 'secondary'}>
                          {isUpcoming ? 'Upcoming' : 'Past'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
