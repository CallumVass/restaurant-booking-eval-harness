// pattern: Imperative Shell

import { Loader2, Clock } from "lucide-react";
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
import type { AvailabilitySlot, Restaurant } from "../generated/booking-client";

interface BookingFormProps {
  selectedRestaurant: Restaurant | undefined;
  date: string;
  partySize: number;
  time: string;
  guestName: string;
  guestEmail: string;
  today: string;
  maxCapacity: number;
  availabilityQuery: {
    data: AvailabilitySlot[];
    isFetching: boolean;
    error: Error | null;
  };
  isPending: boolean;
  error: string;
  onFieldChange: (fields: Partial<BookingFields>) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export interface BookingFields {
  date: string;
  partySize: number;
  time: string;
  guestName: string;
  guestEmail: string;
}

export function BookingForm({
  selectedRestaurant,
  date,
  partySize,
  time,
  guestName,
  guestEmail,
  today,
  maxCapacity,
  availabilityQuery,
  isPending,
  error,
  onFieldChange,
  onSubmit,
}: BookingFormProps) {
  return (
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
        <form className="grid gap-5" onSubmit={onSubmit}>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="date">Date</FieldLabel>
                <Input
                  id="date"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(event) =>
                    onFieldChange({ date: event.target.value })
                  }
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
                    onFieldChange({ partySize: Number(event.target.value) })
                  }
                  required
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Available times</FieldLabel>
              <SlotPicker
                slots={availabilityQuery.data}
                selectedTime={time}
                loading={availabilityQuery.isFetching}
                error={availabilityQuery.error?.message}
                onSelect={(t) => onFieldChange({ time: t })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="guestName">Guest name</FieldLabel>
                <Input
                  id="guestName"
                  value={guestName}
                  onChange={(event) =>
                    onFieldChange({ guestName: event.target.value })
                  }
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
                  onChange={(event) =>
                    onFieldChange({ guestEmail: event.target.value })
                  }
                  placeholder="avery@example.com"
                  required
                />
              </Field>
            </div>
          </FieldGroup>
          {error ? (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <Button disabled={!selectedRestaurant || isPending} type="submit">
            {isPending ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : null}
            Confirm booking
          </Button>
        </form>
      </CardContent>
    </Card>
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
      <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
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
