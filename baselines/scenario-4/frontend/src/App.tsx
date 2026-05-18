// pattern: Imperative Shell

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Clock,
  Loader2,
  LockKeyhole,
  LogOut,
  MapPin,
  UserRound,
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
  getListAvailableSlotsQueryKey,
  getListMyRestaurantBookingsQueryKey,
  useCreateBooking,
  useGetCurrentUser,
  useListAvailableSlots,
  useListMyRestaurantBookings,
  useListRestaurants,
  useLogin,
  useLogout,
  useRegister,
  type AuthRequest,
  type AuthUserResponse,
  type AvailabilitySlot,
  type Booking,
  type CreateBookingRequest,
  type ErrorResponse,
  type Restaurant,
} from "./generated/booking-client.ts";
import { clearCsrfToken } from "./lib/api-fetcher";
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

  const restaurantsQuery = useListRestaurants();
  const currentUserQuery = useGetCurrentUser({ query: { retry: false } });

  const currentUser =
    currentUserQuery.data?.status === 200 ? currentUserQuery.data.data : null;
  const restaurants = restaurantsQuery.data?.data ?? [];
  const effectiveRestaurantId =
    selectedRestaurantId || restaurants[0]?.id || "";
  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === effectiveRestaurantId,
  );

  const availabilityQuery = useListAvailableSlots(
    effectiveRestaurantId,
    {
      date: form.date,
      partySize: form.partySize,
    },
    {
      query: {
        enabled:
          effectiveRestaurantId.length > 0 &&
          form.date.length > 0 &&
          form.partySize > 0,
      },
    },
  );

  const myBookingsQuery = useListMyRestaurantBookings(effectiveRestaurantId, {
    query: {
      enabled: Boolean(currentUser && effectiveRestaurantId),
      retry: false,
    },
  });

  const bookingMutation = useCreateBooking({
    mutation: {
      onSuccess: async (response) => {
        if (response.status !== 201) {
          setFormMessage(
            responseMessage(response.data, "Could not create booking."),
          );
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
          queryClient.invalidateQueries({
            queryKey: getListMyRestaurantBookingsQueryKey(
              effectiveRestaurantId,
            ),
          }),
          queryClient.invalidateQueries({
            queryKey: getListAvailableSlotsQueryKey(effectiveRestaurantId, {
              date: form.date,
              partySize: form.partySize,
            }),
          }),
        ]);
      },
    },
  });

  const selectedBookings =
    myBookingsQuery.data?.status === 200 ? myBookingsQuery.data.data : [];
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

    if (!currentUser) {
      setFormMessage("Sign in or create an account before confirming a table.");
      return;
    }

    if (!form.time) {
      setFormMessage("Choose an available seating time before booking.");
      return;
    }

    bookingMutation.mutate({
      data: {
        restaurantId: effectiveRestaurantId,
        date: form.date,
        time: form.time,
        partySize: form.partySize,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
      } satisfies CreateBookingRequest,
    });
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="grid gap-6 p-6 md:grid-cols-[1.25fr_0.75fr] md:p-10">
            <div className="flex flex-col justify-center gap-5 text-left">
              <Badge className="w-fit bg-secondary text-secondary-foreground">
                Authenticated dinner booking
              </Badge>
              <div className="flex flex-col gap-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  Reserve a table with a booking history that belongs to you.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  Browse curated restaurants, sign in with a local account, see
                  live availability, and keep every reservation scoped to your
                  profile.
                </p>
              </div>
            </div>
            <AuthPanel
              currentUser={currentUser}
              loading={currentUserQuery.isLoading}
              onAuthChanged={async () => {
                await Promise.all([
                  queryClient.invalidateQueries({
                    queryKey: getGetCurrentUserQueryKey(),
                  }),
                  queryClient.invalidateQueries({
                    queryKey: getListMyRestaurantBookingsQueryKey(
                      effectiveRestaurantId,
                    ),
                  }),
                ]);
              }}
            />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
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
                  Choose a dining room, then book against live table inventory.
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
              {restaurants.map((restaurant) => (
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
                            ? availabilityQuery.data.data
                            : []
                        }
                        selectedTime={form.time}
                        loading={availabilityQuery.isFetching}
                        error={
                          availabilityQuery.data?.status &&
                          availabilityQuery.data.status !== 200
                            ? responseMessage(
                                availabilityQuery.data.data,
                                "Availability is unavailable.",
                              )
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
                  {!currentUser ? (
                    <p className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
                      Sign in above to create a booking. Availability remains
                      visible while you decide.
                    </p>
                  ) : null}
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
                    ) : currentUser ? (
                      <CalendarCheck data-icon="inline-start" />
                    ) : (
                      <LockKeyhole data-icon="inline-start" />
                    )}
                    {currentUser ? "Confirm booking" : "Sign in to book"}
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

            <BookingHistory
              bookings={selectedBookings}
              loading={myBookingsQuery.isLoading && Boolean(currentUser)}
              authenticated={Boolean(currentUser)}
            />
          </section>
        </div>
      </section>
    </main>
  );
}

function AuthPanel({
  currentUser,
  loading,
  onAuthChanged,
}: {
  currentUser: AuthUserResponse | null;
  loading: boolean;
  onAuthChanged: () => Promise<void>;
}) {
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [credentials, setCredentials] = useState<AuthRequest>({
    email: "demo@restaurant.test",
    password: "DinnerTable42!",
  });
  const [message, setMessage] = useState("");

  const loginMutation = useLogin({
    mutation: {
      onSuccess: async (response) => {
        if (response.status !== 200) {
          setMessage("Email or password did not match a local account.");
          return;
        }

        setMessage("");
        await onAuthChanged();
      },
    },
  });
  const registerMutation = useRegister({
    mutation: {
      onSuccess: async (response) => {
        if (response.status !== 201) {
          setMessage(
            responseMessage(response.data, "Could not create account."),
          );
          return;
        }

        setMessage("");
        await onAuthChanged();
      },
    },
  });
  const logoutMutation = useLogout({
    mutation: {
      onSuccess: async () => {
        clearCsrfToken();
        setMessage("");
        await queryClient.invalidateQueries();
      },
    },
  });

  function submitAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const data = credentials;
    if (mode === "login") {
      loginMutation.mutate({ data });
    } else {
      registerMutation.mutate({ data });
    }
  }

  if (currentUser) {
    return (
      <Card className="bg-muted text-left">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserRound data-icon="inline-start" /> Signed in
          </CardTitle>
          <CardDescription>
            Booking history is scoped to {currentUser.email}.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Stat label="Session" value="Cookie" />
          <Stat label="CSRF" value="Header" />
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <LogOut data-icon="inline-start" />
            )}
            Logout
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="bg-muted text-left">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          {loading
            ? "Checking your local session..."
            : "Use the seeded demo account or register a local user."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={submitAuth}>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === "login" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("login")}
            >
              Login
            </Button>
            <Button
              type="button"
              variant={mode === "register" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("register")}
            >
              Register
            </Button>
          </div>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="authEmail">Email</FieldLabel>
              <Input
                id="authEmail"
                type="email"
                value={credentials.email}
                onChange={(event) =>
                  setCredentials({ ...credentials, email: event.target.value })
                }
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="authPassword">Password</FieldLabel>
              <Input
                id="authPassword"
                type="password"
                value={credentials.password}
                onChange={(event) =>
                  setCredentials({
                    ...credentials,
                    password: event.target.value,
                  })
                }
                minLength={8}
                required
              />
              <FieldDescription>
                Demo: demo@restaurant.test / DinnerTable42!
              </FieldDescription>
            </Field>
          </FieldGroup>
          {message ? (
            <p className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
              {message}
            </p>
          ) : null}
          <Button
            type="submit"
            disabled={loginMutation.isPending || registerMutation.isPending}
          >
            {loginMutation.isPending || registerMutation.isPending ? (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            ) : (
              <LockKeyhole data-icon="inline-start" />
            )}
            {mode === "login" ? "Login" : "Create account"}
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

function BookingHistory({
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
        <CardTitle>Your restaurant history</CardTitle>
        <CardDescription>
          Only bookings created by the signed-in account are shown here.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {!authenticated ? (
          <FieldDescription>
            Sign in to see your booking history for this restaurant.
          </FieldDescription>
        ) : null}
        {loading ? (
          <FieldDescription>Loading your bookings...</FieldDescription>
        ) : null}
        {authenticated && !loading && bookings.length === 0 ? (
          <FieldDescription>
            No bookings yet for this restaurant. The first table is yours.
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

function responseMessage(data: unknown, fallback: string) {
  if (isErrorResponse(data)) {
    return data.message;
  }

  return fallback;
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  );
}

function formatTime(value: string) {
  return value.slice(0, 5);
}

export default App;
