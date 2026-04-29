// pattern: Imperative Shell

import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { FieldDescription } from "./ui/field";
import type { Booking } from "../generated/booking-client";

interface BookingHistoryProps {
  bookings: Booking[];
  isLoading: boolean;
}

function formatTime(value: string) {
  return value.slice(0, 5);
}

export function BookingHistory({ bookings, isLoading }: BookingHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your bookings</CardTitle>
        <CardDescription>
          Confirmed reservations across all restaurants.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading ? (
          <FieldDescription>Loading your bookings...</FieldDescription>
        ) : null}
        {!isLoading && bookings.length === 0 ? (
          <FieldDescription>
            You haven't made any bookings yet.
          </FieldDescription>
        ) : null}
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col gap-1 rounded-lg border bg-background p-3 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{booking.restaurantName}</p>
              <p className="text-sm text-muted-foreground">
                {booking.guestName} &middot; {booking.date} at{" "}
                {formatTime(booking.time)} &middot; party of {booking.partySize}
              </p>
            </div>
            <Badge>Table {booking.tableId}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
