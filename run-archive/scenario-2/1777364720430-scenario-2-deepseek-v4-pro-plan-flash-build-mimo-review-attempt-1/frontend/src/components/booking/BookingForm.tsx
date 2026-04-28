// pattern: Imperative Shell

import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { SlotPicker } from "./SlotPicker";
import type { AvailabilitySlot } from "../../generated/booking-hooks";

export interface BookingFormData {
  date: string;
  partySize: number;
  time: string;
  guestName: string;
  guestEmail: string;
}

export function BookingForm({
  form,
  onChange,
  onSubmit,
  isPending,
  formMessage,
  availabilitySlots,
  availabilityLoading,
  availabilityError,
  today,
  maxCapacity,
  restaurantName,
  restaurantCuisine,
  restaurantNeighborhood,
}: {
  form: BookingFormData;
  onChange: (form: BookingFormData) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  formMessage: string;
  availabilitySlots: AvailabilitySlot[];
  availabilityLoading: boolean;
  availabilityError?: string;
  today: string;
  maxCapacity: number;
  restaurantName: string;
  restaurantCuisine: string;
  restaurantNeighborhood: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          Book {restaurantName}
        </CardTitle>
        <CardDescription>
          {restaurantCuisine} in {restaurantNeighborhood}. Max party {maxCapacity}.
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
                  value={form.date}
                  onChange={(e) =>
                    onChange({ ...form, date: e.target.value })
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
                  value={form.partySize}
                  onChange={(e) =>
                    onChange({
                      ...form,
                      partySize: Number(e.target.value),
                    })
                  }
                  required
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>Available times</FieldLabel>
              <SlotPicker
                slots={availabilitySlots}
                selectedTime={form.time}
                loading={availabilityLoading}
                error={availabilityError}
                onSelect={(time) => onChange({ ...form, time })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="guestName">Guest name</FieldLabel>
                <Input
                  id="guestName"
                  value={form.guestName}
                  onChange={(e) =>
                    onChange({ ...form, guestName: e.target.value })
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
                  value={form.guestEmail}
                  onChange={(e) =>
                    onChange({ ...form, guestEmail: e.target.value })
                  }
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
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <Loader2
                data-icon="inline-start"
                className="animate-spin"
              />
            ) : null}
            Confirm booking
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
