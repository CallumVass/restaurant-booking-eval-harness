import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarCheck, Clock, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
  useCreateBooking,
  useListAvailableSlots,
  type AvailabilitySlot,
  type Booking,
  type CreateBookingRequest,
  type ErrorResponse,
  type Restaurant,
} from "../generated/booking-client";
import { useCsrfHeaders } from "../hooks/useAuth";

interface BookingFormProps {
  selectedRestaurant: Restaurant | undefined;
  effectiveRestaurantId: string;
}

const today = new Date().toISOString().slice(0, 10);

export function BookingForm({
  selectedRestaurant,
  effectiveRestaurantId,
}: BookingFormProps) {
  const queryClient = useQueryClient();
  const csrfHeaders = useCsrfHeaders();
  const [date, setDate] = useState(today);
  const [partySize, setPartySize] = useState(2);
  const [time, setTime] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [confirmation, setConfirmation] = useState<Booking | null>(null);

  const availabilityQuery = useListAvailableSlots(
    effectiveRestaurantId,
    { date, partySize },
    undefined,
  );

  const maxCapacity = selectedRestaurant
    ? Math.max(...selectedRestaurant.tables.map((t) => t.capacity))
    : 0;

  const bookingMutation = useCreateBooking({
    fetch: { headers: csrfHeaders },
  });

  function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmation(null);
    setFormMessage("");

    if (!time) {
      setFormMessage("Choose an available seating time before booking.");
      return;
    }

    bookingMutation.mutate(
      {
        data: {
          restaurantId: effectiveRestaurantId,
          date,
          time,
          partySize,
          guestName,
          guestEmail,
        } satisfies CreateBookingRequest,
      },
      {
        onSuccess: (response) => {
          if (response.status !== 201) {
            setFormMessage((response.data as ErrorResponse).message);
            return;
          }

          setConfirmation(response.data);
          setTime("");
          setGuestName("");
          setGuestEmail("");
          setFormMessage("");

          queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
          queryClient.invalidateQueries({ queryKey: ["/api/bookings/mine"] });
        },
      },
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle id="booking-heading" className="text-2xl">
            Book {selectedRestaurant?.name ?? "a table"}
          </CardTitle>
          <CardDescription>
            {selectedRestaurant
              ? `${selectedRestaurant.cuisine} in ${selectedRestaurant.neighborhood}. Max party ${maxCapacity}.`
              : "Select a restaurant to begin."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-5" onSubmit={submitBooking}>
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="date">Date</FieldLabel>
                  <Input
                    id="date"
                    type="date"
                    min={today}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="partySize">Party size</FieldLabel>
                  <Input
                    id="partySize"
                    type="number"
                    min={1}
                    max={8}
                    value={partySize}
                    onChange={(event) =>
                      setPartySize(Number(event.target.value))
                    }
                    required
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel>Available times</FieldLabel>
                <SlotPicker
                  slots={
                    availabilityQuery.data?.status === 200
                      ? availabilityQuery.data.data
                      : []
                  }
                  selectedTime={time}
                  loading={availabilityQuery.isFetching}
                  error={
                    availabilityQuery.data &&
                    availabilityQuery.data.status !== 200
                      ? (availabilityQuery.data.data as ErrorResponse).message
                      : undefined
                  }
                  onSelect={(t) => setTime(t)}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="guestName">Guest name</FieldLabel>
                  <Input
                    id="guestName"
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    placeholder="Avery Stone"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="guestEmail">Email</FieldLabel>
                  <Input
                    id="guestEmail"
                    type="email"
                    value={guestEmail}
                    onChange={(event) => setGuestEmail(event.target.value)}
                    placeholder="avery@example.com"
                    required
                  />
                </Field>
              </div>
            </FieldGroup>
            {formMessage ? (
              <p className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
                {formMessage}
              </p>
            ) : null}
            <Button
              disabled={!effectiveRestaurantId || bookingMutation.isPending}
              type="submit"
            >
              {bookingMutation.isPending ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : null}
              Confirm booking
            </Button>
          </form>
        </CardContent>
      </Card>

      {confirmation ? (
        <Card className="border-primary/40 bg-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck data-icon="inline-start" /> Booking confirmed
            </CardTitle>
            <CardDescription className="text-accent-foreground">
              {confirmation.guestName}, your table at{" "}
              {confirmation.restaurantName} is reserved for{" "}
              {formatTime(confirmation.time)} on {confirmation.date}.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  );
}

function SlotPicker({
  slots,
  selectedTime,
  loading,
  error,
  onSelect,
}: {
  slots: AvailabilitySlot[];
  selectedTime: string;
  loading: boolean;
  error?: string;
  onSelect: (time: string) => void;
}) {
  if (loading) {
    return <FieldDescription>Checking available tables...</FieldDescription>;
  }

  if (error) {
    return (
      <p className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
        {error}
      </p>
    );
  }

  if (slots.length === 0) {
    return (
      <FieldDescription>
        No matching slots for this date and party size.
      </FieldDescription>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-2 sm:grid-cols-5"
      role="radiogroup"
      aria-label="Available seating times"
    >
      {slots.map((slot) => (
        <Button
          key={slot.time}
          type="button"
          variant={slot.time === selectedTime ? "default" : "outline"}
          onClick={() => onSelect(slot.time)}
          aria-pressed={slot.time === selectedTime}
        >
          <Clock data-icon="inline-start" /> {formatTime(slot.time)}
        </Button>
      ))}
    </div>
  );
}

function formatTime(value: string) {
  return value.slice(0, 5);
}
