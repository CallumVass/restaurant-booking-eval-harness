// pattern: Imperative Shell

import { CalendarCheck, Clock, Loader2, Users } from "lucide-react";
import { useGetBookingsMine } from "../generated/booking-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function MyBookings() {
  const { data, isLoading, isFetching } = useGetBookingsMine();

  const bookings = data?.status === 200 ? data.data : [];
  const error =
    data && data.status !== 200 ? "Could not load your bookings." : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CalendarCheck data-icon="inline-start" /> My Bookings
            </CardTitle>
            <CardDescription>
              Your confirmed reservations across all restaurants.
            </CardDescription>
          </div>
          {isFetching ? (
            <Loader2 className="animate-spin" aria-label="Loading bookings" />
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading bookings...</p>
        ) : error ? (
          <p className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
            {error}
          </p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No bookings yet. Head to the Restaurants tab to reserve a table.
          </p>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-1 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{booking.restaurantName}</p>
                <p className="text-sm text-muted-foreground">
                  {booking.date} at {booking.time.slice(0, 5)} &middot; party of{" "}
                  {booking.partySize}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  <Clock className="size-3" />
                  {booking.time.slice(0, 5)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                  <Users className="size-3" />
                  {booking.partySize}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
