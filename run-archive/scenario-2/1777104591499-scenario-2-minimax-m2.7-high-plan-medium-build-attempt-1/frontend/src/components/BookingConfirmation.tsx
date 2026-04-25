import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle2, Calendar, Users, Clock } from "lucide-react";

interface BookingConfirmationProps {
  bookingId: string;
  restaurantName: string;
  dateTime: string;
  partySize: number;
  onNewBooking: () => void;
}

export function BookingConfirmation({
  bookingId,
  restaurantName,
  dateTime,
  partySize,
  onNewBooking,
}: BookingConfirmationProps) {
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">
          Booking Confirmed!
        </h2>
        <p className="text-slate-600">
          Your reservation has been successfully booked.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">Restaurant</span>
            </div>
            <span className="font-semibold">{restaurantName}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Date & Time</span>
            </div>
            <span className="font-semibold">{dateTime}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="w-4 h-4" />
              <span className="font-medium">Party Size</span>
            </div>
            <span className="font-semibold">
              {partySize} {partySize === 1 ? "guest" : "guests"}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Badge className="text-xs">Confirmation ID: {bookingId}</Badge>
        <p className="text-sm text-slate-500">
          A confirmation email has been sent to your email address.
        </p>
      </div>

      <Button onClick={onNewBooking} className="w-full">
        Make Another Reservation
      </Button>
    </div>
  );
}
