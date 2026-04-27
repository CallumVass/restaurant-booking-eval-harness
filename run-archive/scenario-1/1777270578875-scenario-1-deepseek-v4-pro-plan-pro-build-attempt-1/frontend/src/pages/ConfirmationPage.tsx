import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import { api } from '../api/client';
import { CheckCircle, CalendarDays, Clock, Users, UtensilsCrossed } from 'lucide-react';

export function ConfirmationPage() {
  const { bookingId } = useParams<{ bookingId: string }>();

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => api.getBooking(bookingId!),
    enabled: !!bookingId,
  });

  const { data: restaurant } = useQuery({
    queryKey: ['restaurant', booking?.restaurantId],
    queryFn: () => api.getRestaurant(booking!.restaurantId),
    enabled: !!booking?.restaurantId,
  });

  if (isLoading) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (!booking) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Booking not found.</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium"
          >
            Back to Restaurants
          </Link>
        </CardContent>
      </Card>
    );
  }

  const bookingDate = new Date(booking.reservationTime);

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="size-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Booking Confirmed!</CardTitle>
          <CardDescription>Your table has been reserved successfully.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm">
              <UtensilsCrossed className="size-4 text-muted-foreground" />
              <span className="font-medium">{restaurant?.name}</span>
            </div>
            <Separator />
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="size-4 text-muted-foreground" />
              <span>
                {bookingDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="size-4 text-muted-foreground" />
              <span>
                {bookingDate.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="size-4 text-muted-foreground" />
              <span>
                {booking.partySize} {booking.partySize === 1 ? 'guest' : 'guests'}
              </span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{booking.customerName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{booking.customerEmail}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Confirmation</span>
              <Badge variant="outline" className="font-mono text-xs">
                {booking.id.slice(0, 8)}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Link
            to="/book"
            className="flex-1 inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            New Booking
          </Link>
          <Link
            to="/bookings"
            className="flex-1 inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            View Bookings
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
