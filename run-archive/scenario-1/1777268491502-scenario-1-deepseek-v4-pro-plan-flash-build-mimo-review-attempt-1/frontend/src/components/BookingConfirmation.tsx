import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export default function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get('bookingId');

  if (!bookingId) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="p-6 text-center">
          <p className="text-neutral-500">No booking information found.</p>
          <Button className="mt-4" onClick={() => navigate('/book')}>
            Make a Booking
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
          <svg
            className="size-7 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <CardTitle>Booking Confirmed!</CardTitle>
        <CardDescription>Your reservation has been made successfully.</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Badge variant="success" className="mb-3">
          Booking #{bookingId.slice(0, 8)}
        </Badge>
        <p className="text-sm text-neutral-500">Please save your booking ID for reference.</p>
      </CardContent>
      <CardFooter className="justify-center gap-3">
        <Button onClick={() => navigate('/book')}>Make Another Booking</Button>
        <Button onClick={() => navigate('/bookings')}>View All Bookings</Button>
      </CardFooter>
    </Card>
  );
}
