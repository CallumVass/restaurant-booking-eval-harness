// pattern: Imperative Shell

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Clock,
  Loader2,
  LogOut,
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
  getGetCsrfTokenQueryKey,
  getGetCurrentUserQueryKey,
  getListAvailableSlotsQueryKey,
  getListBookingsQueryKey,
  useCreateBooking,
  useGetCsrfToken,
  useGetCurrentUser,
  useListAvailableSlots,
  useListBookings,
  useListRestaurants,
  useLogin,
  useLogout,
  useRegister,
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

type AccountForm = {
  email: string;
  password: string;
};

const today = new Date().toISOString().slice(0, 10);

const defaultForm: BookingForm = {
  date: today,
  partySize: 2,
  time: "",
  guestName: "",
  guestEmail: "",
};

const defaultAccountForm: AccountForm = {
  email: "demo@example.com",
  password: "Password123!",
};

const credentialedFetch: RequestInit = { credentials: "include" };

function App() {
  const queryClient = useQueryClient();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [accountForm, setAccountForm] = useState(defaultAccountForm);
  const [accountMode, setAccountMode] = useState<"login" | "register">("login");
  const [formMessage, setFormMessage] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [confirmation, setConfirmation] = useState<Booking | null>(null);

  const csrfQuery = useGetCsrfToken({ fetch: credentialedFetch });
  const currentUserQuery = useGetCurrentUser({
    fetch: credentialedFetch,
    query: { retry: false },
  });
  const restaurantsQuery = useListRestaurants({ fetch: credentialedFetch });

  const effectiveRestaurantId =
    selectedRestaurantId || restaurantsQuery.data?.data?.[0]?.id || "";
  const selectedRestaurant = restaurantsQuery.data?.data?.find(
    (restaurant) => restaurant.id === effectiveRestaurantId,
  );
  const currentUser =
    currentUserQuery.data?.status === 200 ? currentUserQuery.data.data : null;
  const csrfToken = csrfQuery.data?.data.token;

  const availabilityQuery = useListAvailableSlots(
    effectiveRestaurantId,
    {
      date: form.date,
      partySize: form.partySize,
    },
    {
      fetch: credentialedFetch,
      query: {
        enabled:
          effectiveRestaurantId.length > 0 &&
          form.date.length > 0 &&
          form.partySize > 0,
      },
    },
  );

  const bookingsQuery = useListBookings(
    { restaurantId: effectiveRestaurantId || undefined },
    {
      fetch: credentialedFetch,
      query: {
        enabled: Boolean(currentUser && effectiveRestaurantId),
      },
    },
  );

  const loginMutation = useLogin({
    fetch: withCsrf(csrfToken),
    mutation: {
      onSuccess: async (response) => {
        if (response.status !== 200) {
          setAccountMessage(response.data.message);
          return;
        }

        setAccountMessage("");
        await refreshAuthQueries(queryClient, csrfQuery.refetch);
      },
    },
  });

  const registerMutation = useRegister({
    fetch: withCsrf(csrfToken),
    mutation: {
      onSuccess: async (response) => {
        if (response.status !== 200) {
          setAccountMessage(response.data.message);
          return;
        }

        setAccountMessage("");
        await refreshAuthQueries(queryClient, csrfQuery.refetch);
      },
    },
  });

  const logoutMutation = useLogout({
    fetch: withCsrf(csrfToken),
    mutation: {
      onSuccess: async (response) => {
        if (response.status !== 204) {
          setAccountMessage(readMaybeError(response.data));
          return;
        }

        setConfirmation(null);
        setAccountMessage("");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getListBookingsQueryKey(),
          }),
          refreshAuthQueries(queryClient, csrfQuery.refetch),
        ]);
      },
    },
  });

  const bookingMutation = useCreateBooking({
    fetch: withCsrf(csrfToken),
    mutation: {
      onSuccess: async (response) => {
        if (response.status !== 201) {
          setFormMessage(readMaybeError(response.data));
          return;
        }

        setConfirmation(response.data);
        setForm((current) => ({
          ...current,
          time: "",
          guestName: "",
          guestEmail: currentUser?.email ?? "",
        }));
        setFormMessage("");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getListBookingsQueryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: getListAvailableSlotsQueryKey(effectiveRestaurantId),
          }),
        ]);
      },
    },
  });

  const selectedBookings =
    bookingsQuery.data?.status === 200 ? bookingsQuery.data.data : [];
  const availableSlots =
    availabilityQuery.data?.status === 200 ? availabilityQuery.data.data : [];
  const availabilityError =
    availabilityQuery.data && availabilityQuery.data.status !== 200
      ? availabilityQuery.data.data.message
      : undefined;
  const maxCapacity = selectedRestaurant
    ? Math.max(...selectedRestaurant.tables.map((table) => table.capacity))
    : 0;

  function chooseRestaurant(restaurantId: string) {
    setSelectedRestaurantId(restaurantId);
    setConfirmation(null);
    setFormMessage("");
  }

  function submitAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAccountMessage("");

    const payload = {
      data: {
        email: accountForm.email,
        password: accountForm.password,
      },
    };

    if (accountMode === "login") {
      loginMutation.mutate(payload);
      return;
    }

    registerMutation.mutate(payload);
  }

  function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmation(null);
    setFormMessage("");

    if (!currentUser) {
      setFormMessage("Sign in or create an account before booking.");
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
      guestEmail: form.guestEmail || currentUser.email,
    };

    bookingMutation.mutate({ data: request });
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="grid gap-6 p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-10">
            <div className="flex flex-col justify-center gap-5 text-left">
              <Badge className="w-fit bg-secondary text-secondary-foreground">
                Authenticated dinner service
              </Badge>
              <div className="flex flex-col gap-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  Reserve a table with your own booking history.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  Sign in locally, browse curated restaurants, see live
                  availability, and keep every confirmed reservation tied to
                  your account.
                </p>
              </div>
            </div>
            <AccountPanel
              currentUserEmail={currentUser?.email}
              mode={accountMode}
              form={accountForm}
              message={accountMessage}
              busy={
                loginMutation.isPending ||
                registerMutation.isPending ||
                logoutMutation.isPending
              }
              csrfReady={Boolean(csrfToken)}
              onModeChange={setAccountMode}
              onFormChange={setAccountForm}
              onSubmit={submitAccount}
              onLogout={() => logoutMutation.mutate()}
            />
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
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
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1">
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
                  {!currentUser ? (
                    <p className="rounded-lg border bg-muted p-3 text-sm text-muted-foreground">
                      Sign in or create a local account to confirm a booking.
                      Availability remains visible while you decide.
                    </p>
                  ) : null}
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
                        slots={availableSlots}
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
                  {formMessage ? (
                    <StatusMessage>{formMessage}</StatusMessage>
                  ) : null}
                  <Button
                    disabled={
                      !effectiveRestaurantId ||
                      bookingMutation.isPending ||
                      !currentUser
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
              loading={bookingsQuery.isLoading}
              authenticated={Boolean(currentUser)}
            />
          </section>
        </div>
      </section>
    </main>
  );
}

function AccountPanel({
  currentUserEmail,
  mode,
  form,
  message,
  busy,
  csrfReady,
  onModeChange,
  onFormChange,
  onSubmit,
  onLogout,
}: {
  currentUserEmail?: string;
  mode: "login" | "register";
  form: AccountForm;
  message: string;
  busy: boolean;
  csrfReady: boolean;
  onModeChange: (mode: "login" | "register") => void;
  onFormChange: (form: AccountForm) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onLogout: () => void;
}) {
  return (
    <Card className="bg-muted/70 text-left">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShieldCheck data-icon="inline-start" /> Account
        </CardTitle>
        <CardDescription>
          Local cookie auth keeps booking history private to the signed-in user.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {currentUserEmail ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-card p-4">
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="font-medium">{currentUserEmail}</p>
            </div>
            <Button variant="outline" onClick={onLogout} disabled={busy}>
              <LogOut data-icon="inline-start" /> Logout
            </Button>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={mode === "login" ? "default" : "outline"}
                onClick={() => onModeChange("login")}
              >
                Login
              </Button>
              <Button
                type="button"
                variant={mode === "register" ? "default" : "outline"}
                onClick={() => onModeChange("register")}
              >
                Register
              </Button>
            </div>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="accountEmail">Email</FieldLabel>
                <Input
                  id="accountEmail"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    onFormChange({ ...form, email: event.target.value })
                  }
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="accountPassword">Password</FieldLabel>
                <Input
                  id="accountPassword"
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    onFormChange({ ...form, password: event.target.value })
                  }
                  required
                />
                <FieldDescription>
                  Demo: demo@example.com / Password123!
                </FieldDescription>
              </Field>
            </FieldGroup>
            {message ? <StatusMessage>{message}</StatusMessage> : null}
            <Button disabled={busy || !csrfReady} type="submit">
              {busy ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : null}
              {mode === "login" ? "Login" : "Create account"}
            </Button>
          </form>
        )}
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
    return <StatusMessage>{error}</StatusMessage>;
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
  authenticated,
}: {
  bookings: Booking[];
  loading: boolean;
  authenticated: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your booking history</CardTitle>
        <CardDescription>
          Confirmed reservations for your account at the selected restaurant.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {!authenticated ? (
          <FieldDescription>
            Sign in to see your restaurant-specific booking history.
          </FieldDescription>
        ) : null}
        {authenticated && loading ? (
          <FieldDescription>Loading bookings...</FieldDescription>
        ) : null}
        {authenticated && !loading && bookings.length === 0 ? (
          <FieldDescription>
            No bookings for this restaurant yet. The first table is yours.
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

function StatusMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
      {children}
    </p>
  );
}

async function refreshAuthQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  refetchCsrf: () => Promise<unknown>,
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: getGetCurrentUserQueryKey() }),
    queryClient.invalidateQueries({ queryKey: getGetCsrfTokenQueryKey() }),
    refetchCsrf(),
  ]);
}

function withCsrf(token?: string): RequestInit {
  return {
    credentials: "include",
    headers: token ? { "X-CSRF-TOKEN": token } : undefined,
  };
}

function readMaybeError(value: ErrorResponse | void) {
  return value?.message ?? "The request could not be completed.";
}

function formatTime(value: string) {
  return value.slice(0, 5);
}

export default App;
