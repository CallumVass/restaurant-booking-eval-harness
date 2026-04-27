import { useListBookings } from '../api/booking-api';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  return `${m}/${d}/${y}`;
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12}:${m} ${ampm}`;
}

export default function BookingList() {
  const { data: bookings, isLoading, error } = useListBookings();

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">My Bookings</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="flex gap-4 p-4">
                <div className="h-4 w-1/3 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-1/6 animate-pulse rounded bg-neutral-200" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Failed to load bookings.</p>
        </CardContent>
      </Card>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">My Bookings</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-neutral-500">No bookings yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">My Bookings</h1>
      <p className="mb-8 text-neutral-500">
        {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
      </p>
      <div className="space-y-3">
        {bookings.map((b) => (
          <Card key={b.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{b.restaurantName}</CardTitle>
                  <p className="mt-1 text-sm text-neutral-500">
                    {formatDate(b.date)} at {formatTime(b.time)}
                  </p>
                </div>
                <Badge>{b.partySize} guests</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-500">
                {b.guestName} &middot; {b.guestEmail}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
