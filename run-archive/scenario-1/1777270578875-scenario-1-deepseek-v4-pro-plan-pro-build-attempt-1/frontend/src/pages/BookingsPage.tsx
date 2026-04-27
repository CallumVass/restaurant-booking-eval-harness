import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { api, type BookingDto } from '../api/client';
import { CalendarDays, Clock, Users, ArrowLeft } from 'lucide-react';

export function BookingsPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: api.getBookings,
  });

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: api.getRestaurants,
  });

  const restaurantMap = new Map(restaurants?.map((r) => [r.id, r.name]) ?? []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <Link
          to="/book"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
        >
          New Booking
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight">All Bookings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
          <CardDescription>All current bookings across all restaurants.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : bookings && bookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>
                    <CalendarDays className="inline size-3.5" /> Date
                  </TableHead>
                  <TableHead>
                    <Clock className="inline size-3.5" /> Time
                  </TableHead>
                  <TableHead>
                    <Users className="inline size-3.5" /> Party
                  </TableHead>
                  <TableHead className="text-right">Confirmation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b: BookingDto) => {
                  const bookingDate = new Date(b.reservationTime);
                  return (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.customerName}</TableCell>
                      <TableCell>{restaurantMap.get(b.restaurantId) ?? b.restaurantId}</TableCell>
                      <TableCell>{bookingDate.toLocaleDateString()}</TableCell>
                      <TableCell>
                        {bookingDate.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>{b.partySize}</TableCell>
                      <TableCell className="text-right">
                        <Link
                          to={`/confirmation/${b.id}`}
                          className="inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
                        >
                          <Badge variant="outline" className="font-mono">
                            {b.id.slice(0, 8)}
                          </Badge>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <p>No bookings yet.</p>
              <Link
                to="/book"
                className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Make a Reservation
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
