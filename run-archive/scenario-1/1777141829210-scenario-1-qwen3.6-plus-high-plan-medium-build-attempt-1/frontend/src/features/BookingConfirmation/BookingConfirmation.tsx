import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Clock, Users } from 'lucide-react';

interface BookingConfirmationProps {
  booking: {
    id: string;
    restaurantName: string;
    guestName: string;
    partySize: number;
    dateTime: string;
  };
}

export function BookingConfirmation({ booking }: BookingConfirmationProps) {
  return (
    <Card className="mb-6 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CheckCircle className="size-6 text-green-600" />
          Booking Confirmed!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="size-4 text-green-600" />
            <span className="font-medium">{booking.restaurantName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="size-4 text-green-600" />
            <span>Party of {booking.partySize}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="size-4 text-green-600" />
            <span>
              {new Date(booking.dateTime).toLocaleDateString()} at{' '}
              {new Date(booking.dateTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary" className="font-mono">
              #{booking.id.slice(0, 8)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
