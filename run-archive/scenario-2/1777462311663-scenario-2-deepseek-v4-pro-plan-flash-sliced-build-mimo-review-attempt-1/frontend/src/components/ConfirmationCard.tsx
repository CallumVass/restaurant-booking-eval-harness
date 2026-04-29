// pattern: Imperative Shell

import { CalendarCheck } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import type { Booking } from "../generated/booking-client";

interface ConfirmationCardProps {
  booking: Booking;
}

function formatTime(value: string) {
  return value.slice(0, 5);
}

export function ConfirmationCard({ booking }: ConfirmationCardProps) {
  return (
    <Card className="border-primary/40 bg-accent transition-colors duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck data-icon="inline-start" /> Booking confirmed
        </CardTitle>
        <CardDescription className="text-accent-foreground">
          {booking.guestName}, your table at {booking.restaurantName} is
          reserved for {formatTime(booking.time)} on {booking.date}.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
