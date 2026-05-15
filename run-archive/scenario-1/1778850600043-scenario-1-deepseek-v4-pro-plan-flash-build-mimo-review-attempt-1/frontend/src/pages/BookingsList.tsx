import { useState } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useGetBookings } from "@/api/generated/bookings/bookings";
import type { BookingResponse } from "@/api/generated/schemas/bookingResponse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Calendar, Clock, Mail, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function BookingsList() {
  const [email, setEmail] = useState(() => {
    return localStorage.getItem("bookingEmail") || "";
  });
  const [searchEmail, setSearchEmail] = useState(email);

  const {
    data: bookingsResp,
    isLoading,
    error,
  } = useGetBookings({ email: searchEmail }, { query: { enabled: searchEmail.length > 0 } });

  const handleSearch = () => {
    const trimmed = email.trim();
    if (trimmed) {
      localStorage.setItem("bookingEmail", trimmed);
      setSearchEmail(trimmed);
    }
  };

  const bookings: BookingResponse[] = bookingsResp?.status === 200 ? bookingsResp.data : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-muted-foreground">Look up your reservations by email</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              Find Bookings
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="searchEmail" className="sr-only">
                Email address
              </Label>
              <Input
                id="searchEmail"
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="you@example.com"
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={!email.trim()}>
              <Search className="size-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center py-8 gap-3">
          <AlertCircle className="size-10 text-destructive" />
          <p className="text-muted-foreground">Could not load bookings.</p>
        </div>
      )}

      {!isLoading && !error && bookings.length === 0 && searchEmail && (
        <div className="flex flex-col items-center py-8 gap-4">
          <Calendar className="size-10 text-muted-foreground" />
          <p className="text-muted-foreground">No bookings found for this email.</p>
          <Button asChild variant="outline">
            <Link to="/">Book a Restaurant</Link>
          </Button>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} found
          </p>
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="pt-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{booking.startTime.slice(0, 5)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{String(booking.partySize)} guests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Confirmed
                    </Badge>
                  </div>
                </div>
                <Separator className="my-3" />
                <p className="text-sm text-muted-foreground">{booking.customerName}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
