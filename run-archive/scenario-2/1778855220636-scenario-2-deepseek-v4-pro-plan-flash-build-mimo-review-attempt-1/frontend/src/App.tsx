// pattern: Imperative Shell

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Clock,
  Loader2,
  LogOut,
  MapPin,
  User,
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
import { fetchCsrfToken, getCsrfTokenValue } from "./lib/api-mutator";
import {
  login,
  logout,
  register,
  useCreateBooking,
  useGetCurrentUser,
  useGetMyBookings,
  useListAvailableSlots,
  useListBookings,
  useListRestaurants,
  type Booking,
  type ErrorResponse,
  type Restaurant,
  type UserInfo,
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
  const queryClient = useQueryClient();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [formMessage, setFormMessage] = useState("");
  const [confirmation, setConfirmation] = useState<Booking | null>(null);

  // Auth state
  const [csrfReady, setCsrfReady] = useState(false);
  const currentUserQuery = useGetCurrentUser({
    query: {
      enabled: csrfReady,
      retry: 0,
      staleTime: 60_000,
    },
  });
  const currentUser =
    currentUserQuery.data?.status === 200 ? currentUserQuery.data.data : null;
  const isAuthenticated = !!currentUser;

  // CSRF token fetching on mount
  useEffect(() => {
    fetchCsrfToken()
      .then(() => setCsrfReady(true))
      .catch(() => setCsrfReady(true));
  }, []);

  // Auth form state
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");

  const restaurantsQuery = useListRestaurants();

  const bookingsQuery = useListBookings();

  const myBookingsQuery = useGetMyBookings({
    query: {
      enabled: isAuthenticated,
    },
  });

  const effectiveRestaurantId =
    selectedRestaurantId || restaurantsQuery.data?.data?.[0]?.id || "";
  const selectedRestaurant = restaurantsQuery.data?.data?.find(
    (restaurant) => restaurant.id === effectiveRestaurantId,
  );

  const availabilityQuery = useListAvailableSlots(
    effectiveRestaurantId,
    { date: form.date, partySize: form.partySize },
    {
      query: {
        enabled:
          effectiveRestaurantId.length > 0 &&
          form.date.length > 0 &&
          form.partySize > 0,
      },
    },
  );

  const createBookingMutation = useCreateBooking({
    mutation: {
      onSuccess: async (response) => {
        if (response.status !== 201) {
          setFormMessage((response.data as ErrorResponse).message);
          return;
        }

        setConfirmation(response.data);
        setForm((current) => ({
          ...current,
          time: "",
          guestName: "",
          guestEmail: "",
        }));
        setFormMessage("");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["/api/bookings"] }),
          queryClient.invalidateQueries({ queryKey: ["/api/my-bookings"] }),
          queryClient.invalidateQueries({
            queryKey: [
              `/api/restaurants/${effectiveRestaurantId}/availability`,
            ],
          }),
        ]);
      },
    },
  });

  const selectedBookings: Booking[] =
    bookingsQuery.data?.status === 200
      ? (bookingsQuery.data.data as Booking[])
      : [];
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

    if (!isAuthenticated) {
      setShowAuthForm(true);
      return;
    }

    if (!form.time) {
      setFormMessage("Choose an available seating time before booking.");
      return;
    }

    createBookingMutation.mutate({
      data: {
        restaurantId: effectiveRestaurantId,
        date: form.date,
        time: form.time,
        partySize: form.partySize,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
      },
    });
  }

  async function handleAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");

    try {
      const token = getCsrfTokenValue();
      if (!token) await fetchCsrfToken();

      if (authMode === "login") {
        const res = await login({ email: authEmail, password: authPassword });
        if (res.status !== 200) {
          setAuthError("Invalid email or password.");
          return;
        }
      } else {
        const res = await register({
          email: authEmail,
          password: authPassword,
          name: authName || authEmail,
        });
        if (res.status !== 200) {
          setAuthError((res.data as ErrorResponse).message);
          return;
        }
      }

      // Refresh CSRF token and user state
      setAuthEmail("");
      setAuthPassword("");
      setAuthName("");
      setShowAuthForm(false);
      await fetchCsrfToken();
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch {
      setAuthError("An error occurred. Please try again.");
    }
  }

  async function handleLogout() {
    const token = getCsrfTokenValue();
    if (!token) await fetchCsrfToken();

    await logout();
    await fetchCsrfToken();
    await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    await queryClient.invalidateQueries({ queryKey: ["/api/my-bookings"] });
  }

  const myBookings: Booking[] =
    myBookingsQuery.data?.status === 200
      ? (myBookingsQuery.data.data as Booking[])
      : [];

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
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl bg-muted p-5 text-left">
                <p className="text-sm font-medium text-muted-foreground">
                  Tonight's rhythm
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Stat
                    label="Restaurants"
                    value={
                      restaurantsQuery.data?.data?.length.toString() ?? "..."
                    }
                  />
                  <Stat
                    label="Bookings"
                    value={
                      bookingsQuery.data?.status === 200
                        ? (
                            bookingsQuery.data.data as Booking[]
                          ).length.toString()
                        : "..."
                    }
                  />
                  <Stat label="Seat window" value="17-21" />
                  <Stat label="Duration" value="2h" />
                </div>
              </div>
              <AuthBar
                user={currentUser}
                loading={currentUserQuery.isFetching && csrfReady}
                onLoginClick={() => setShowAuthForm(true)}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </header>

        {showAuthForm ? (
          <Card className="mx-auto max-w-md border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <User data-icon="inline-start" />
                {authMode === "login" ? "Sign in" : "Create account"}
              </CardTitle>
              <CardDescription>
                {authMode === "login"
                  ? "Sign in to book tables and view your reservations."
                  : "Register to start booking tables."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4" onSubmit={handleAuth}>
                <Field>
                  <FieldLabel htmlFor="auth-email">Email</FieldLabel>
                  <Input
                    id="auth-email"
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="avery@example.com"
                    required
                  />
                </Field>
                {authMode === "register" ? (
                  <Field>
                    <FieldLabel htmlFor="auth-name">Name</FieldLabel>
                    <Input
                      id="auth-name"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Avery Stone"
                    />
                  </Field>
                ) : null}
                <Field>
                  <FieldLabel htmlFor="auth-password">Password</FieldLabel>
                  <Input
                    id="auth-password"
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </Field>
                {authError ? (
                  <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {authError}
                  </p>
                ) : null}
                <div className="flex flex-col gap-2">
                  <Button type="submit">
                    {authMode === "login" ? "Sign in" : "Create account"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAuthMode(authMode === "login" ? "register" : "login");
                      setAuthError("");
                    }}
                  >
                    {authMode === "login"
                      ? "No account? Register"
                      : "Already have an account? Sign in"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAuthForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
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
              {restaurantsQuery.isFetching ? (
                <Loader2
                  className="animate-spin"
                  aria-label="Loading restaurants"
                />
              ) : null}
            </div>
            <div className="grid gap-3">
              {(restaurantsQuery.data?.data ?? []).map((restaurant) => (
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
                        slots={
                          availabilityQuery.data?.status === 200
                            ? (availabilityQuery.data.data as {
                                time: string;
                                availableTableCount: number;
                              }[])
                            : []
                        }
                        selectedTime={form.time}
                        loading={availabilityQuery.isFetching}
                        error={
                          availabilityQuery.error
                            ? ((availabilityQuery.data?.data as ErrorResponse)
                                ?.message ?? "Failed to load availability")
                            : undefined
                        }
                        onSelect={(time) => setForm({ ...form, time })}
                      />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel htmlFor="guestName">Guest name</FieldLabel>
                        <Input
                          id="guestName"
                          value={form.guestName}
                          onChange={(event) =>
                            setForm({ ...form, guestName: event.target.value })
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
                          onChange={(event) =>
                            setForm({ ...form, guestEmail: event.target.value })
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
                  {!isAuthenticated ? (
                    <p className="rounded-md bg-accent p-3 text-sm text-accent-foreground">
                      <button
                        type="button"
                        className="underline hover:text-primary"
                        onClick={() => setShowAuthForm(true)}
                      >
                        Sign in
                      </button>{" "}
                      to create a booking. Demo:{" "}
                      <code className="text-xs">
                        demo@example.com / demo1234
                      </code>
                    </p>
                  ) : null}
                  <Button
                    disabled={
                      !effectiveRestaurantId || createBookingMutation.isPending
                    }
                    type="submit"
                  >
                    {createBookingMutation.isPending ? (
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

            <ExistingBookings
              bookings={selectedBookings}
              loading={bookingsQuery.isFetching}
            />

            {isAuthenticated && myBookings.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User data-icon="inline-start" /> My bookings
                  </CardTitle>
                  <CardDescription>
                    Your personal reservation history.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {myBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col gap-1 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">{booking.restaurantName}</p>
                        <p className="text-sm text-muted-foreground">
                          {booking.date} at {formatTime(booking.time)} · party
                          of {booking.partySize}
                        </p>
                      </div>
                      <Badge>Table {booking.tableId}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </section>
        </div>
      </section>
    </main>
  );
}

function AuthBar({
  user,
  loading,
  onLoginClick,
  onLogout,
}: {
  user: UserInfo | null;
  loading: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-muted p-4">
        <Loader2 className="animate-spin" aria-label="Loading auth state" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="rounded-2xl bg-muted p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="size-4" />
            <span className="font-medium">{user.name}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            aria-label="Sign out"
          >
            <LogOut data-icon="inline-start" /> Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-muted p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">Sign in to book tables</p>
        <Button variant="default" size="sm" onClick={onLoginClick}>
          <User data-icon="inline-start" /> Sign in
        </Button>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Demo: demo@example.com / demo1234
      </p>
    </div>
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
  slots: { time: string; availableTableCount: number }[];
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
