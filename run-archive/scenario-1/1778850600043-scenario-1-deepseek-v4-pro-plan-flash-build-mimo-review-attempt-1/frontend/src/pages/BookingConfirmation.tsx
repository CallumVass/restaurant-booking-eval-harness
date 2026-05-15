import { useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Calendar, Clock, Users, Mail, ArrowRight } from "lucide-react";
import type { BookingResponse } from "@/api/generated/schemas/bookingResponse";

export default function BookingConfirmation() {
  const location = useLocation();
  const booking = (location.state as { booking: BookingResponse } | null)?.booking;

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <p className="text-muted-foreground">No booking information available.</p>
        <Button asChild>
          <Link to="/">Browse Restaurants</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex flex-col items-center text-center gap-2">
        <CheckCircle2 className="size-12 text-green-500" />
        <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
        <p className="text-muted-foreground">Your reservation has been successfully created.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Confirmation
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{booking.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">
                {booking.startTime.slice(0, 5)} &ndash; {booking.endTime.slice(0, 5)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Party Size</p>
              <p className="font-medium">{String(booking.partySize)} guests</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <Mail className="size-5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Confirmation sent to</p>
              <p className="font-medium">{booking.customerEmail}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button asChild variant="outline" className="flex-1">
          <Link to="/">Browse Restaurants</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link to="/bookings">
            View My Bookings <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
