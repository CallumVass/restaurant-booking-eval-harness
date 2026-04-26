// pattern: Imperative Shell

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Clock,
  Loader2,
  LogIn,
  LogOut,
  MapPin,
  Users,
} from "lucide-react";
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
import { useAuth } from "./hooks/useAuth.ts";
import {
  createBooking,
  listAvailableSlots,
  listBookings,
  listRestaurants,
  getMyBookings,
  type AvailabilitySlot,
  type Booking,
  type CreateBookingRequest,
  type ErrorResponse,
  type Restaurant,
  type UserBooking,
} from "./generated/booking-client";
import { cn } from "./lib/utils";

type BookingForm = {
  date: string;
  partySize: number;
  time: string;
  guestName: string;
  guestEmail: string;
};

const today = new Date().toISOString().slice(0, 10);

const defaultForm: BookingForm = {
  date: today,
  partySize: 2,
  time: "",
  guestName: "",
  guestEmail: "",
};

function App() {
  const { user, isLoading: authLoading, login, register, logout } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [formMessage, setFormMessage] = useState("");
  const [confirmation, setConfirmation] = useState<Booking | null>(null);
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);

  const restaurantsQuery = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => (await listRestaurants()).data,
  });

  const myBookingsQuery = useQuery({
    queryKey: ["myBookings"],
    queryFn: async () => {
      const response = await getMyBookings();
      return response.status === 200 ? (response.data as UserBooking[]) : [];
    },
    enabled: !!user,
  });

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => (await listBookings()).data,
  });

  const effectiveRestaurantId =
    selectedRestaurantId || restaurantsQuery.data?.[0]?.id || "";
  const selectedRestaurant = restaurantsQuery.data?.find(
    (restaurant) => restaurant.id === effectiveRestaurantId,
  );

  const availabilityQuery = useQuery({
    queryKey: [
      "availability",
      effectiveRestaurantId,
      form.date,
      form.partySize,
    ],
    queryFn: async () => {
      const response = await listAvailableSlots(effectiveRestaurantId, {
        date: form.date,
        partySize: form.partySize,
      });

      if (response.status !== 200) {
        throw new Error((response.data as ErrorResponse).message);
      }

      return response.data;
    },
    enabled:
      effectiveRestaurantId.length > 0 &&
      form.date.length > 0 &&
      form.partySize > 0,
  });

  const bookingMutation = useMutation({
    mutationFn: (request: CreateBookingRequest) => createBooking(request),
    onSuccess: async (response) => {
      if (response.status !== 201) {
        setFormMessage((response.data as ErrorResponse).message);
        return;
      }

      setConfirmation(response.data);
      setForm((current) => ({
        ...current,
        time: "",
      }));
      setFormMessage("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["availability"] }),
        queryClient.invalidateQueries({ queryKey: ["myBookings"] }),
      ]);
    },
  });

  const selectedBookings =
    bookingsQuery.data?.filter(
      (booking) => booking.restaurantId === effectiveRestaurantId,
    ) ?? [];
  const maxCapacity = selectedRestaurant
    ? Math.max(...selectedRestaurant.tables.map((table) => table.capacity))
    : 0;

  function chooseRestaurant(restaurantId: string) {
    setSelectedRestaurantId(restaurantId);
    setConfirmation(null);
    setFormMessage("");
  }

  function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmation(null);
    setFormMessage("");

    if (!user) {
      setShowAuth("login");
      return;
    }

    if (!form.time) {
      setFormMessage("Choose an available seating time before booking.");
      return;
    }

    bookingMutation.mutate({
      restaurantId: effectiveRestaurantId,
      date: form.date,
      time: form.time,
      partySize: form.partySize,
      guestName: form.guestName || user.email,
      guestEmail: form.guestEmail || user.email,
    });
  }

  function handleAuthSuccess() {
    setShowAuth(null);
    setForm((f) => ({
      ...f,
      guestName: user?.email ?? f.guestName,
      guestEmail: user?.email ?? f.guestEmail,
    }));
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="animate-spin" aria-label="Loading" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="grid gap-6 p-6 md:grid-cols-[1.4fr_0.8fr] md:p-10">
            <div className="flex flex-col justify-center gap-5 text-left">
              <Badge className="w-fit bg-secondary text-secondary-foreground">
                Dinner service booking
              </Badge>
              <div className="flex flex-col gap-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  Reserve a table without the reservation roulette.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  Browse curated restaurants, see real availability, and confirm
                  conflict-safe bookings in one focused flow.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-muted p-5 text-left">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Tonight's rhythm
                </p>
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">
                      {user.email}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => logout()}>
                      <LogOut data-icon="inline-start" className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAuth("login")}
                  >
                    <LogIn data-icon="inline-start" className="size-4" />
                    Sign in
                  </Button>
                )}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat
                  label="Restaurants"
                  value={restaurantsQuery.data?.length.toString() ?? "..."}
                />
                <Stat
                  label="Bookings"
                  value={bookingsQuery.data?.length.toString() ?? "..."}
                />
                <Stat label="Seat window" value="17-21" />
                <Stat label="Duration" value="2h" />
              </div>
            </div>
          </div>
        </header>

        {showAuth && !user ? (
          <AuthCard
            mode={showAuth}
            onLogin={async (email, password) => {
              const result = await login(email, password);
              if (result.ok) handleAuthSuccess();
              return result;
            }}
            onRegister={async (email, password, displayName) => {
              const result = await register(email, password, displayName);
              if (result.ok) {
                const loginResult = await login(email, password);
                if (loginResult.ok) handleAuthSuccess();
              }
              return result;
            }}
            onClose={() => setShowAuth(null)}
          />
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section
            className="flex flex-col gap-4"
            aria-labelledby="restaurants-heading"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2
                  id="restaurants-heading"
                  className="text-2xl font-semibold tracking-tight"
                >
                  Restaurants
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose a room, then book against live table inventory.
                </p>
              </div>
              {restaurantsQuery.isLoading ? (
                <Loader2
                  className="animate-spin"
                  aria-label="Loading restaurants"
                />
              ) : null}
            </div>
            <div className="grid gap-3">
              {(restaurantsQuery.data ?? []).map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  active={restaurant.id === effectiveRestaurantId}
                  onSelect={chooseRestaurant}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-6" aria-labelledby="booking-heading">
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
                          value={form.date}
                          onChange={(event) =>
                            setForm({ ...form, date: event.target.value })
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
                          onChange={(event) =>
                            setForm({
                              ...form,
                              partySize: Number(event.target.value),
                            })
                          }
                          required
                        />
                      </Field>
                    </div>
                    <Field>
                      <FieldLabel>Available times</FieldLabel>
                      <SlotPicker
                        slots={availabilityQuery.data ?? []}
                        selectedTime={form.time}
                        loading={availabilityQuery.isFetching}
                        error={availabilityQuery.error?.message}
                        onSelect={(time) => setForm({ ...form, time })}
                      />
                    </Field>
                    {user ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field>
                          <FieldLabel htmlFor="guestName">
                            Guest name
                          </FieldLabel>
                          <Input
                            id="guestName"
                            value={form.guestName}
                            onChange={(event) =>
                              setForm({
                                ...form,
                                guestName: event.target.value,
                              })
                            }
                            placeholder={user.email}
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="guestEmail">Email</FieldLabel>
                          <Input
                            id="guestEmail"
                            type="email"
                            value={form.guestEmail}
                            onChange={(event) =>
                              setForm({
                                ...form,
                                guestEmail: event.target.value,
                              })
                            }
                            placeholder={user.email}
                          />
                        </Field>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        <Button
                          variant="ghost"
                          className="px-0"
                          onClick={() => setShowAuth("login")}
                        >
                          Sign in
                        </Button>{" "}
                        to book a table.
                      </p>
                    )}
                  </FieldGroup>
                  {formMessage ? (
                    <p className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
                      {formMessage}
                    </p>
                  ) : null}
                  <Button
                    disabled={
                      !effectiveRestaurantId || bookingMutation.isPending
                    }
                    type="submit"
                  >
                    {bookingMutation.isPending ? (
                      <Loader2
                        data-icon="inline-start"
                        className="animate-spin"
                      />
                    ) : null}
                    {user ? "Confirm booking" : "Sign in to book"}
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

            {user && myBookingsQuery.data ? (
              <MyBookings
                bookings={myBookingsQuery.data}
                loading={myBookingsQuery.isLoading}
              />
            ) : null}

            <ExistingBookings
              bookings={selectedBookings}
              loading={bookingsQuery.isLoading}
            />
          </section>
        </div>
      </section>
    </main>
  );
}

function AuthCard({
  mode,
  onLogin,
  onRegister,
  onClose,
}: {
  mode: "login" | "register";
  onLogin: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  onRegister: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIsPending(true);

    let result: { ok: boolean; error?: string };
    if (mode === "login") {
      result = await onLogin(email, password);
    } else {
      result = await onRegister(email, password, displayName || undefined);
    }

    setIsPending(false);
    if (!result.ok) {
      setError(result.error ?? "An error occurred");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "login" ? "Sign in" : "Create account"}</CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Sign in to book tables and view your reservations."
            : "Create an account to start booking tables."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <FieldGroup>
            {mode === "register" && (
              <Field>
                <FieldLabel htmlFor="displayName">Display name</FieldLabel>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="auth-email">Email</FieldLabel>
              <Input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="auth-password">Password</FieldLabel>
              <Input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </Field>
          </FieldGroup>
          {error ? (
            <p className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
              {error}
            </p>
          ) : null}
          <div className="flex gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : null}
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                className="text-sm text-primary underline"
                onClick={() => {}}
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="text-sm text-primary underline"
                onClick={() => {}}
              >
                Sign in
              </button>
            </>
          )}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Demo: demo@example.com / Demo123!
        </p>
      </CardContent>
    </Card>
  );
}

function RestaurantCard({
  restaurant,
  active,
  onSelect,
}: {
  restaurant: Restaurant;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const capacity = Math.max(
    ...restaurant.tables.map((table) => table.capacity),
  );

  return (
    <Card
      className={cn("transition-colors", active && "border-primary bg-accent")}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2 text-left">
            <CardTitle>{restaurant.name}</CardTitle>
            <CardDescription>{restaurant.description}</CardDescription>
          </div>
          <Badge className="bg-secondary text-secondary-foreground">
            {restaurant.cuisine}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin data-icon="inline-start" /> {restaurant.neighborhood}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users data-icon="inline-start" /> Up to {capacity}
        </span>
      </CardContent>
      <CardFooter>
        <Button
          variant={active ? "secondary" : "outline"}
          size="sm"
          onClick={() => onSelect(restaurant.id)}
        >
          {active ? "Selected" : "Select restaurant"}
        </Button>
      </CardFooter>
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

function ExistingBookings({
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
                {booking.date} at {formatTime(booking.time)} · party of{" "}
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

function MyBookings({
  bookings,
  loading,
}: {
  bookings: UserBooking[];
  loading: boolean;
}) {
  if (bookings.length === 0 && !loading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your bookings</CardTitle>
        <CardDescription>
          Your confirmed reservations across all restaurants.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {loading ? (
          <FieldDescription>Loading your bookings...</FieldDescription>
        ) : null}
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col gap-1 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{booking.restaurantName}</p>
              <p className="text-sm text-muted-foreground">
                {booking.date} at {formatTime(booking.time)} · party of{" "}
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card p-4">
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function formatTime(value: string) {
  return value.slice(0, 5);
}

export default App;
