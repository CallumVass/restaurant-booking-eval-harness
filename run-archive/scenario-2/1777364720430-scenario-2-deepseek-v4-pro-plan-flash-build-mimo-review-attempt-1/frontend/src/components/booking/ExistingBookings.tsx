// pattern: Imperative Shell

import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FieldDescription } from "../ui/field";
import type { Booking } from "../../generated/booking-hooks";

function formatTime(value: string) {
  return value.slice(0, 5);
}

export function ExistingBookings({
  bookings,
  loading,
}: {
  bookings: Booking[];
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Existing bookings</CardTitle>
        <CardDescription>
          Confirmed reservations for the selected restaurant.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {loading ? (
          <FieldDescription>Loading bookings...</FieldDescription>
        ) : null}
        {!loading && bookings.length === 0 ? (
          <FieldDescription>
            No bookings yet. The first table is yours.
          </FieldDescription>
        ) : null}
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col gap-1 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{booking.guestName}</p>
              <p className="text-sm text-muted-foreground">
                {booking.date} at {formatTime(booking.time)} &middot; party of{" "}
                {booking.partySize}
              </p>
            </div>
            <Badge>Table {booking.tableId}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
