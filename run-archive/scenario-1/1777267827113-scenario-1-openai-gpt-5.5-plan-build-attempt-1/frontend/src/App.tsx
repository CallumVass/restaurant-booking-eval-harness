// pattern: Imperative Shell

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Clock,
  MapPin,
  Sparkles,
  UsersRound,
  Utensils,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import {
  createBooking,
  listAvailableSlots,
  listBookings,
  listRestaurants,
  type BookingDto,
  type CreateBookingRequest,
  type RestaurantDto,
} from "./api/generated/restaurant-booking";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "./components/ui/field";
import { Input } from "./components/ui/input";
import { cn } from "./lib/utils";

const today = new Date().toISOString().slice(0, 10);

function App() {
  const queryClient = useQueryClient();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("");
  const [date, setDate] = useState(today);
  const [partySize, setPartySize] = useState(2);
  const [selectedStartTime, setSelectedStartTime] = useState<string>("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [confirmation, setConfirmation] = useState<BookingDto | null>(null);

  const restaurantsQuery = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => (await listRestaurants()).data,
    staleTime: 60_000,
  });

  const restaurants = restaurantsQuery.data ?? [];
  const selectedRestaurant =
    restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) ??
    restaurants[0];

  const slotsQuery = useQuery({
    queryKey: ["available-slots", selectedRestaurant?.id, date, partySize],
    queryFn: async () => {
      if (!selectedRestaurant) return [];
      const response = await listAvailableSlots(selectedRestaurant.id, {
        date,
        partySize,
      });
      if (response.status !== 200) {
        throw new Error(
          response.data.detail ?? "Unable to load available slots.",
        );
      }

      return response.data;
    },
    enabled: Boolean(selectedRestaurant),
    staleTime: 15_000,
  });

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => (await listBookings()).data,
    staleTime: 10_000,
  });

  const createBookingMutation = useMutation({
    mutationFn: async (payload: CreateBookingRequest) => {
      const response = await createBooking(payload);
      if (response.status !== 201) {
        throw new Error(
          response.data.detail ?? "Booking could not be created.",
        );
      }

      return response.data;
    },
    onSuccess: async (booking) => {
      setConfirmation(booking);
      setSelectedStartTime("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["available-slots"] }),
      ]);
    },
  });

  const slots = slotsQuery.data ?? [];
  const selectedSlot = slots.find(
    (slot) => slot.startTime === selectedStartTime,
  );

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRestaurant || !selectedSlot) return;

    createBookingMutation.mutate({
      restaurantId: selectedRestaurant.id,
      guestName,
      guestEmail,
      partySize,
      date,
      startTime: selectedSlot.startTime,
    });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden border-b bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_32rem)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-5 bg-card">
              Live tables, typed client, zero phone calls
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Reserve a table with confidence.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Browse curated restaurants, see real availability, and create
              conflict-safe bookings through a typed OpenAPI client.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 rounded-3xl border bg-card/80 p-4 shadow-sm backdrop-blur">
            <Stat label="Restaurants" value={restaurants.length.toString()} />
            <Stat
              label="Bookings"
              value={(bookingsQuery.data ?? []).length.toString()}
            />
            <Stat label="Slot length" value="90m" />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
        <section
          className="flex flex-col gap-6"
          aria-labelledby="restaurants-heading"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2
                id="restaurants-heading"
                className="text-2xl font-semibold tracking-tight"
              >
                Choose a dining room
              </h2>
              <p className="text-sm text-muted-foreground">
                Each card uses seeded in-memory table inventory.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                selected={restaurant.id === selectedRestaurant?.id}
                onSelect={() => {
                  setSelectedRestaurantId(restaurant.id);
                  setSelectedStartTime("");
                  setConfirmation(null);
                }}
              />
            ))}
          </div>

          <BookingsPanel bookings={bookingsQuery.data ?? []} />
        </section>

        <aside
          className="lg:sticky lg:top-6 lg:self-start"
          aria-label="Booking form"
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex items-center gap-2">
                <CalendarCheck data-icon="inline-start" /> Book{" "}
                {selectedRestaurant?.name ?? "a table"}
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Available slots update when the restaurant, date, or party size
                changes.
              </CardDescription>
            </CardHeader>
            <form onSubmit={submitBooking}>
              <CardContent className="flex flex-col gap-5 pt-6">
                {confirmation ? (
                  <Alert
                    className="border-primary/30 bg-primary/5"
                    role="status"
                  >
                    <AlertTitle>Booking confirmed</AlertTitle>
                    <AlertDescription>
                      {confirmation.guestName}, your table at{" "}
                      {confirmation.restaurantName} is set for{" "}
                      {formatDate(confirmation.date)} at{" "}
                      {formatTime(confirmation.startTime)}.
                    </AlertDescription>
                  </Alert>
                ) : null}

                {createBookingMutation.error ? (
                  <Alert
                    role="alert"
                    className="border-destructive/40 bg-destructive/5"
                  >
                    <AlertTitle>Could not create booking</AlertTitle>
                    <AlertDescription>
                      {createBookingMutation.error.message}
                    </AlertDescription>
                  </Alert>
                ) : null}

                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="date">Date</FieldLabel>
                      <Input
                        id="date"
                        type="date"
                        min={today}
                        value={date}
                        onChange={(event) => {
                          setDate(event.target.value);
                          setSelectedStartTime("");
                          setConfirmation(null);
                        }}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="party-size">Party size</FieldLabel>
                      <Input
                        id="party-size"
                        type="number"
                        min={1}
                        max={8}
                        value={partySize}
                        onChange={(event) => {
                          setPartySize(Number(event.target.value));
                          setSelectedStartTime("");
                          setConfirmation(null);
                        }}
                      />
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel>Available time</FieldLabel>
                    <div
                      className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                      aria-live="polite"
                    >
                      {slotsQuery.isLoading ? (
                        <p className="col-span-full text-sm text-muted-foreground">
                          Checking tables...
                        </p>
                      ) : null}
                      {slotsQuery.error ? (
                        <p className="col-span-full text-sm text-destructive">
                          {slotsQuery.error.message}
                        </p>
                      ) : null}
                      {!slotsQuery.isLoading &&
                      !slotsQuery.error &&
                      slots.length === 0 ? (
                        <p className="col-span-full text-sm text-muted-foreground">
                          No slots match this date and party size.
                        </p>
                      ) : null}
                      {slots.map((slot) => (
                        <Button
                          key={slot.startTime}
                          type="button"
                          variant={
                            slot.startTime === selectedStartTime
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          aria-pressed={slot.startTime === selectedStartTime}
                          onClick={() => {
                            setSelectedStartTime(slot.startTime);
                            setConfirmation(null);
                          }}
                        >
                          <Clock data-icon="inline-start" />{" "}
                          {formatTime(slot.startTime)}
                        </Button>
                      ))}
                    </div>
                    <FieldDescription>
                      {selectedSlot
                        ? `Table seats up to ${selectedSlot.tableCapacity}.`
                        : "Pick a slot before submitting."}
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="guest-name">Name</FieldLabel>
                    <Input
                      id="guest-name"
                      value={guestName}
                      onChange={(event) => setGuestName(event.target.value)}
                      placeholder="Grace Hopper"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="guest-email">Email</FieldLabel>
                    <Input
                      id="guest-email"
                      type="email"
                      value={guestEmail}
                      onChange={(event) => setGuestEmail(event.target.value)}
                      placeholder="grace@example.com"
                      required
                    />
                  </Field>
                </FieldGroup>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!selectedSlot || createBookingMutation.isPending}
                >
                  {createBookingMutation.isPending
                    ? "Confirming..."
                    : "Confirm reservation"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function RestaurantCard({
  restaurant,
  selected,
  onSelect,
}: {
  restaurant: RestaurantDto;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Card
      className={cn(
        "transition hover:-translate-y-0.5 hover:shadow-md",
        selected && "border-primary shadow-md",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{restaurant.name}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 pt-1">
              <MapPin data-icon="inline-start" /> {restaurant.neighborhood}
            </CardDescription>
          </div>
          <Badge>{restaurant.cuisine}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          {restaurant.description}
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-muted p-3">
            <UsersRound data-icon="inline-start" className="mb-2" /> Seats up to{" "}
            {restaurant.largestTable}
          </div>
          <div className="rounded-2xl bg-muted p-3">
            <Utensils data-icon="inline-start" className="mb-2" />{" "}
            {restaurant.tableCount} tables
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant={selected ? "default" : "outline"}
          className="w-full"
          onClick={onSelect}
        >
          {selected ? "Selected" : "Reserve here"}
        </Button>
      </CardFooter>
    </Card>
  );
}

function BookingsPanel({ bookings }: { bookings: BookingDto[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles data-icon="inline-start" /> Existing bookings
        </CardTitle>
        <CardDescription>
          New reservations appear here after confirmation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            No bookings yet. Create the first reservation from the booking
            panel.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-2xl border bg-background p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium">{booking.restaurantName}</h3>
                  <Badge>{booking.partySize} guests</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {booking.guestName} on {formatDate(booking.date)} at{" "}
                  {formatTime(booking.startTime)}
                </p>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function formatTime(value: string) {
  return value.slice(0, 5);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export default App;
