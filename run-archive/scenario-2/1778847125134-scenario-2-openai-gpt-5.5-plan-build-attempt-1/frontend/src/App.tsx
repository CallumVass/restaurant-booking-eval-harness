// pattern: Imperative Shell

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Clock,
  LogIn,
  Loader2,
  MapPin,
  ShieldCheck,
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
import {
  getGetCurrentUserQueryKey,
  getListRestaurantBookingsQueryKey,
  useCreateBooking,
  useGetCsrfToken,
  useGetCurrentUser,
  useListAvailableSlots,
  useListRestaurantBookings,
  useListRestaurants,
  useLogin,
  useLogout,
  useRegister,
  type AuthRequest,
  type AvailabilitySlot,
  type Booking,
  type CreateBookingRequest,
  type ErrorResponse,
  type Restaurant,
} from "./generated/booking-client";
import { cn } from "./lib/utils";

type BookingForm = {
  date: string;
  partySize: number;
  time: string;
  guestName: string;
  guestEmail: string;
};

type AuthMode = "login" | "register";

const today = new Date().toISOString().slice(0, 10);
const credentialedFetch: RequestInit = { credentials: "include" };

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
  const [authForm, setAuthForm] = useState<AuthRequest>({
    email: "demo@example.com",
    password: "Password123!",
  });
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [formMessage, setFormMessage] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [confirmation, setConfirmation] = useState<Booking | null>(null);

  const csrfQuery = useGetCsrfToken({ fetch: credentialedFetch });
  const csrfToken =
    csrfQuery.data?.status === 200 ? csrfQuery.data.data.token : "";
  const csrfFetch = csrfToken
    ? {
        credentials: "include" as const,
        headers: { "X-CSRF-TOKEN": csrfToken },
      }
    : credentialedFetch;

  const currentUserQuery = useGetCurrentUser({
    fetch: credentialedFetch,
    query: { retry: false },
  });
  const currentUser =
    currentUserQuery.data?.status === 200 ? currentUserQuery.data.data : null;
  const isAuthenticated = currentUser !== null;

  const restaurantsQuery = useListRestaurants();
  const effectiveRestaurantId =
    selectedRestaurantId || restaurantsQuery.data?.data[0]?.id || "";
  const selectedRestaurant = restaurantsQuery.data?.data.find(
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

  const bookingsQuery = useListRestaurantBookings(effectiveRestaurantId, {
    fetch: credentialedFetch,
    query: { enabled: isAuthenticated && effectiveRestaurantId.length > 0 },
  });

  const loginMutation = useLogin({
    fetch: csrfFetch,
    mutation: { onSuccess: handleAuthResponse },
  });
  const registerMutation = useRegister({
    fetch: csrfFetch,
    mutation: { onSuccess: handleAuthResponse },
  });
  const logoutMutation = useLogout({
    fetch: csrfFetch,
    mutation: {
      onSuccess: async () => {
        setConfirmation(null);
        setAuthMessage("");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getGetCurrentUserQueryKey(),
          }),
          queryClient.removeQueries({ queryKey: ["/api/restaurants"] }),
          queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] }),
        ]);
      },
    },
  });
  const bookingMutation = useCreateBooking({
    fetch: csrfFetch,
    mutation: { onSuccess: handleBookingResponse },
  });

  const selectedBookings =
    bookingsQuery.data?.status === 200 ? bookingsQuery.data.data : [];
  const maxCapacity = selectedRestaurant
    ? Math.max(...selectedRestaurant.tables.map((table) => table.capacity))
    : 0;
  const availabilityError =
    availabilityQuery.data && availabilityQuery.data.status !== 200
      ? (availabilityQuery.data.data as ErrorResponse).message
      : undefined;
  const slots =
    availabilityQuery.data?.status === 200 ? availabilityQuery.data.data : [];

  function chooseRestaurant(restaurantId: string) {
    setSelectedRestaurantId(restaurantId);
    setConfirmation(null);
    setFormMessage("");
  }

  function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthMessage("");
    const payload = { data: authForm };
    if (authMode === "login") {
      loginMutation.mutate(payload);
    } else {
      registerMutation.mutate(payload);
    }
  }

  async function handleAuthResponse(response: {
    status: number;
    data: unknown;
  }) {
    if (response.status !== 200 && response.status !== 201) {
      setAuthMessage((response.data as ErrorResponse).message);
      return;
    }

    setAuthMessage("");
    setForm((current) => ({ ...current, guestEmail: authForm.email }));
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() }),
      queryClient.invalidateQueries({
        queryKey: getListRestaurantBookingsQueryKey(effectiveRestaurantId),
      }),
      csrfQuery.refetch(),
    ]);
  }

  async function handleBookingResponse(response: {
    status: number;
    data: unknown;
  }) {
    if (response.status !== 201) {
      setFormMessage(
        response.status === 401
          ? "Sign in before confirming a booking."
          : (response.data as ErrorResponse).message,
      );
      return;
    }

    setConfirmation(response.data as Booking);
    setForm((current) => ({ ...current, time: "", guestName: "" }));
    setFormMessage("");
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["/api/restaurants"] }),
      queryClient.invalidateQueries({
        queryKey: getListRestaurantBookingsQueryKey(effectiveRestaurantId),
      }),
      queryClient.invalidateQueries({
        queryKey: [`/api/restaurants/${effectiveRestaurantId}/availability`],
      }),
      csrfQuery.refetch(),
    ]);
  }

  function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmation(null);
    setFormMessage("");

    if (!isAuthenticated) {
      setFormMessage("Sign in or create an account to confirm a booking.");
      return;
    }

    if (!form.time) {
      setFormMessage("Choose an available seating time before booking.");
      return;
    }

    const request: CreateBookingRequest = {
      restaurantId: effectiveRestaurantId,
      date: form.date,
      time: form.time,
      partySize: form.partySize,
      guestName: form.guestName,
      guestEmail: form.guestEmail || currentUser?.email || "",
    };
    bookingMutation.mutate({ data: request });
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_0.9fr] md:p-10">
            <div className="flex flex-col justify-center gap-5 text-left">
              <Badge className="w-fit bg-secondary text-secondary-foreground">
                Authenticated dinner booking
              </Badge>
              <div className="flex flex-col gap-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  Reserve a table with your own booking history.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  Browse curated restaurants, see live availability, sign in
                  with a local account, and keep reservations scoped to you.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              <AuthPanel
                currentUserEmail={currentUser?.email}
                csrfReady={Boolean(csrfToken)}
                authForm={authForm}
                authMode={authMode}
                message={authMessage}
                pending={loginMutation.isPending || registerMutation.isPending}
                loggingOut={logoutMutation.isPending}
                onAuthFormChange={setAuthForm}
                onModeChange={setAuthMode}
                onSubmit={handleAuthSubmit}
                onLogout={() => logoutMutation.mutate()}
              />
            </div>
          </div>
        </header>

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
                        slots={slots}
                        selectedTime={form.time}
                        loading={availabilityQuery.isFetching}
                        error={availabilityError}
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
                          value={form.guestEmail || currentUser?.email || ""}
                          onChange={(event) =>
                            setForm({ ...form, guestEmail: event.target.value })
                          }
                          placeholder="avery@example.com"
                          required
                        />
                      </Field>
                    </div>
                  </FieldGroup>
                  {!isAuthenticated ? (
                    <p className="rounded-md border border-primary/20 bg-accent p-3 text-sm text-accent-foreground">
                      <LogIn data-icon="inline-start" /> Sign in above to
                      confirm this booking.
                    </p>
                  ) : null}
                  {formMessage ? (
                    <p
                      role="alert"
                      className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground"
                    >
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
                    Confirm booking
                  </Button>
                </form>
              </CardContent>
            </Card>

            {confirmation ? <Confirmation booking={confirmation} /> : null}

            <ExistingBookings
              authenticated={isAuthenticated}
              bookings={selectedBookings}
              loading={bookingsQuery.isLoading}
            />
          </section>
        </div>
      </section>
    </main>
  );
}

function AuthPanel({
  currentUserEmail,
  csrfReady,
  authForm,
  authMode,
  message,
  pending,
  loggingOut,
  onAuthFormChange,
  onModeChange,
  onSubmit,
  onLogout,
}: {
  currentUserEmail?: string;
  csrfReady: boolean;
  authForm: AuthRequest;
  authMode: AuthMode;
  message: string;
  pending: boolean;
  loggingOut: boolean;
  onAuthFormChange: (form: AuthRequest) => void;
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onLogout: () => void;
}) {
  if (currentUserEmail) {
    return (
      <Card className="bg-muted/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck data-icon="inline-start" /> Signed in
          </CardTitle>
          <CardDescription>{currentUserEmail}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button
            variant="outline"
            onClick={onLogout}
            disabled={loggingOut || !csrfReady}
          >
            {loggingOut ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : null}
            Log out
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/60">
      <CardHeader>
        <CardTitle className="text-xl">Account</CardTitle>
        <CardDescription>
          Use demo@example.com / Password123! or create a local account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div
            className="grid grid-cols-2 gap-2"
            role="tablist"
            aria-label="Authentication mode"
          >
            <Button
              type="button"
              variant={authMode === "login" ? "default" : "outline"}
              onClick={() => onModeChange("login")}
            >
              Log in
            </Button>
            <Button
              type="button"
              variant={authMode === "register" ? "default" : "outline"}
              onClick={() => onModeChange("register")}
            >
              Register
            </Button>
          </div>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="auth-email">Email</FieldLabel>
              <Input
                id="auth-email"
                type="email"
                value={authForm.email}
                onChange={(event) =>
                  onAuthFormChange({ ...authForm, email: event.target.value })
                }
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="auth-password">Password</FieldLabel>
              <Input
                id="auth-password"
                type="password"
                value={authForm.password}
                onChange={(event) =>
                  onAuthFormChange({
                    ...authForm,
                    password: event.target.value,
                  })
                }
                required
              />
            </Field>
          </FieldGroup>
          {message ? (
            <p
              role="alert"
              className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground"
            >
              {message}
            </p>
          ) : null}
          <Button type="submit" disabled={pending || !csrfReady}>
            {pending ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : null}
            {authMode === "login" ? "Log in" : "Create account"}
          </Button>
        </form>
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
  if (loading)
    return <FieldDescription>Checking available tables...</FieldDescription>;
  if (error)
    return (
      <p
        role="alert"
        className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground"
      >
        {error}
      </p>
    );
  if (slots.length === 0)
    return (
      <FieldDescription>
        No matching slots for this date and party size.
      </FieldDescription>
    );

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

function Confirmation({ booking }: { booking: Booking }) {
  return (
    <Card className="border-primary/40 bg-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck data-icon="inline-start" /> Booking confirmed
        </CardTitle>
        <CardDescription className="text-accent-foreground">
          {booking.guestName}, your table at {booking.restaurantName} is
          reserved for {formatTime(booking.time)} on {booking.date}.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

function ExistingBookings({
  authenticated,
  bookings,
  loading,
}: {
  authenticated: boolean;
  bookings: Booking[];
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your booking history</CardTitle>
        <CardDescription>
          Reservations for the selected restaurant that belong to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {!authenticated ? (
          <FieldDescription>
            Sign in to see your restaurant booking history.
          </FieldDescription>
        ) : null}
        {authenticated && loading ? (
          <FieldDescription>Loading bookings...</FieldDescription>
        ) : null}
        {authenticated && !loading && bookings.length === 0 ? (
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

function formatTime(value: string) {
  return value.slice(0, 5);
}

export default App;
