import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { BookingResult } from '@/api/model';

export function BookingConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingRaw = searchParams.get('booking');
  let booking: BookingResult | null = null;

  try {
    if (bookingRaw) {
      booking = JSON.parse(decodeURIComponent(bookingRaw));
    }
  } catch {
    // invalid booking data
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">No booking data found.</p>
        <Button className="mt-4" onClick={() => navigate('/')}>
          Browse Restaurants
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Booking Confirmed</CardTitle>
          <CardDescription>
            Your reservation has been placed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Booking ID</p>
              <p className="font-mono font-medium">{booking.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Restaurant</p>
              <p className="font-medium">Restaurant #{booking.restaurantId}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{booking.customerName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Party Size</p>
              <Badge variant="secondary">
                {String(booking.partySize)} guests
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{booking.date}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Time</p>
              <p className="font-medium">
                {booking.startTime.slice(0, 5)} - {booking.endTime.slice(0, 5)}
              </p>
            </div>
          </div>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Book Another
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
