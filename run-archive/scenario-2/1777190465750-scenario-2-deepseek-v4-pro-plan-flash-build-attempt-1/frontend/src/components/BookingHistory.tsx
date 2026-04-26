// pattern: Imperative Shell

import { CalendarCheck, Clock, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { FieldDescription } from "./ui/field";
import { useListMyBookings, type Booking } from "../generated/booking-client";
import { useAuth } from "../lib/use-auth";

function formatTime(value: string) {
  return value.slice(0, 5);
}

export function BookingHistory() {
  const { user } = useAuth();
  const { data, isLoading } = useListMyBookings();

  const raw = data?.data;
  const bookings: Booking[] = Array.isArray(raw) ? raw : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck data-icon="inline-start" /> My bookings
        </CardTitle>
        <CardDescription>
          {user?.email
            ? `Bookings for ${user.email}`
            : "Your confirmed reservations."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading ? (
          <FieldDescription>Loading your bookings...</FieldDescription>
        ) : null}
        {!isLoading && bookings.length === 0 ? (
          <FieldDescription>
            No bookings yet. Pick a restaurant and make your first reservation.
          </FieldDescription>
        ) : null}
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col gap-1 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{booking.restaurantName}</p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock data-icon="inline-start" />
                {formatTime(booking.time)} on {booking.date}
                <Users data-icon="inline-start" />
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
