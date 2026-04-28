// pattern: Imperative Shell

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Clock,
  Loader2,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  User,
  Users,
  X,
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
  useListRestaurants,
  useListAvailableSlots,
  useListBookings,
  useCreateBooking,
  useAuthMe,
  useAuthLogin,
  useAuthRegister,
  useAuthLogout,
  type Restaurant,
  type Booking,
  type AvailabilitySlot,
  type CreateBookingRequest,
  type ListAvailableSlotsParams,
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

type AuthForm = {
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

const credentials: RequestInit = { credentials: "include" };

const defaultAuth: AuthForm = { email: "", password: "" };

function App() {
  const queryClient = useQueryClient();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [formMessage, setFormMessage] = useState("");
  const [confirmation, setConfirmation] = useState<Booking | null>(null);
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
  const [authForm, setAuthForm] = useState(defaultAuth);
  const [authError, setAuthError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const meQuery = useAuthMe({ fetch: credentials });
  const user = (meQuery.data as UserInfo | undefined) ?? {
    email: "",
    isAuthenticated: false,
  };
  const isAuthenticated = user.isAuthenticated;

  const restaurantsQuery = useListRestaurants<Restaurant[]>();
  const restaurants = restaurantsQuery.data ?? [];

  const bookingsQuery = useListBookings<Booking[]>({
    fetch: credentials,
    query: { enabled: isAuthenticated },
  });
  const bookings = bookingsQuery.data ?? [];

  const effectiveRestaurantId =
    selectedRestaurantId || restaurants[0]?.id || "";
  const selectedRestaurant = restaurants.find(
    (r) => r.id === effectiveRestaurantId,
  );

  const availabilityQuery = useListAvailableSlots<AvailabilitySlot[]>(
    effectiveRestaurantId,
    { date: form.date, partySize: form.partySize } as ListAvailableSlotsParams,
    {
      query: {
        enabled:
          effectiveRestaurantId.length > 0 &&
          form.date.length > 0 &&
          form.partySize > 0,
      },
    },
  );

  const loginMutation = useAuthLogin({ fetch: credentials });
  const registerMutation = useAuthRegister({ fetch: credentials });
  const logoutMutation = useAuthLogout({ fetch: credentials });

  const bookingMutation = useCreateBooking({
    fetch: credentials,
  });

  const selectedBookings = bookings.filter(
    (b) => b.restaurantId === effectiveRestaurantId,
  );
  const maxCapacity = selectedRestaurant
    ? Math.max(...selectedRestaurant.tables.map((t) => t.capacity))
    : 0;

  function chooseRestaurant(restaurantId: string) {
    setSelectedRestaurantId(restaurantId);
    setConfirmation(null);
    setFormMessage("");
  }

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmation(null);
    setFormMessage("");

    if (!form.time) {
      setFormMessage("Choose an available seating time before booking.");
      return;
    }

    bookingMutation.mutate(
      {
        data: {
          restaurantId: effectiveRestaurantId,
          date: form.date,
          time: form.time,
          partySize: form.partySize,
          guestName: form.guestName,
          guestEmail: form.guestEmail,
        } as CreateBookingRequest,
      },
      {
        onSuccess: () => {
          const result = bookingMutation.data as unknown as Booking;
          setConfirmation(result);
          setForm((current) => ({
            ...current,
            time: "",
            guestName: "",
            guestEmail: "",
          }));
          setFormMessage("");
          queryClient.invalidateQueries({ queryKey: ["listBookings"] });
          queryClient.invalidateQueries({ queryKey: ["listAvailableSlots"] });
        },
        onError: (error: unknown) => {
          const err = error as { message?: string };
          setFormMessage(err.message ?? "Booking failed.");
        },
      },
    );
  }

  async function handleAuthSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthError("");

    if (showAuth === "login") {
      loginMutation.mutate(
        { data: { email: authForm.email, password: authForm.password } },
        {
          onSuccess: () => {
            const result = loginMutation.data as unknown as UserInfo;
            if (result?.isAuthenticated) {
              setShowAuth(null);
              setAuthForm(defaultAuth);
              queryClient.invalidateQueries({ queryKey: ["authMe"] });
              queryClient.invalidateQueries({ queryKey: ["listBookings"] });
            }
          },
          onError: () => {
            setAuthError("Invalid email or password.");
          },
        },
      );
      return;
    }

    registerMutation.mutate(
      { data: { email: authForm.email, password: authForm.password } },
      {
        onSuccess: () => {
          const result = registerMutation.data as unknown as UserInfo;
          if (result?.isAuthenticated) {
            setShowAuth(null);
            setAuthForm(defaultAuth);
            queryClient.invalidateQueries({ queryKey: ["authMe"] });
            queryClient.invalidateQueries({ queryKey: ["listBookings"] });
          }
        },
        onError: (error: unknown) => {
          const err = error as { message?: string };
          setAuthError(err.message ?? "Registration failed.");
        },
      },
    );
  }

  function handleLogout() {
    logoutMutation.mutate(undefined as unknown as void, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["authMe"] });
        queryClient.invalidateQueries({ queryKey: ["listBookings"] });
      },
    });
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <CalendarCheck className="size-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">
              TableBook
            </span>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            {meQuery.isLoading ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="size-4" />
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <LogOut className="size-4" />
                  )}
                  <span className="ml-1">Logout</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setShowAuth("login");
                  setAuthError("");
                }}
              >
                <LogIn className="size-4" />{" "}
                <span className="ml-1">Sign in</span>
              </Button>
            )}
          </div>

          <button
            className="sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t bg-card px-4 py-3 sm:hidden">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="size-4" /> {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="justify-start"
                >
                  <LogOut className="size-4" /> Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  setShowAuth("login");
                  setAuthError("");
                }}
                className="w-full"
              >
                <LogIn className="size-4" /> Sign in
              </Button>
            )}
          </div>
        ) : null}
      </nav>

      {showAuth ? (
        <AuthDialog
          mode={showAuth}
          form={authForm}
          error={authError}
          loading={loginMutation.isPending || registerMutation.isPending}
          onChangeForm={setAuthForm}
          onSwitch={() => {
            setShowAuth(showAuth === "login" ? "register" : "login");
            setAuthError("");
            setAuthForm(defaultAuth);
          }}
          onClose={() => {
            setShowAuth(null);
            setAuthError("");
          }}
          onSubmit={handleAuthSubmit}
        />
      ) : null}

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
              <p className="text-sm font-medium text-muted-foreground">
                Tonight's rhythm
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <StatLabel
                  label="Restaurants"
                  value={restaurants.length.toString()}
                />
                <StatLabel
                  label="My Bookings"
                  value={isAuthenticated ? bookings.length.toString() : "—"}
                />
                <StatLabel label="Seat window" value="17-21" />
                <StatLabel label="Duration" value="2h" />
              </div>
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
                {!isAuthenticated ? (
                  <div className="flex flex-col items-center gap-4 py-8 text-center">
                    <LogIn className="size-12 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Sign in to book a table</p>
                      <p className="text-sm text-muted-foreground">
                        Create an account or sign in to make a reservation.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setShowAuth("login");
                        setAuthError("");
                      }}
                    >
                      <LogIn className="size-4" /> Sign in to continue
                    </Button>
                  </div>
                ) : (
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
                          <FieldLabel htmlFor="partySize">
                            Party size
                          </FieldLabel>
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
                              setForm({
                                ...form,
                                guestEmail: event.target.value,
                              })
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
                )}
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
              isAuthenticated={isAuthenticated}
            />
          </section>
        </div>
      </section>
    </main>
  );
}

function AuthDialog({
  mode,
  form,
  error,
  loading,
  onChangeForm,
  onSwitch,
  onClose,
  onSubmit,
}: {
  mode: "login" | "register";
  form: AuthForm;
  error: string;
  loading: boolean;
  onChangeForm: (form: AuthForm) => void;
  onSwitch: () => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {mode === "login" ? "Sign in" : "Create account"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="size-4" />
            </Button>
          </div>
          <CardDescription>
            {mode === "login"
              ? "Sign in to manage your bookings."
              : "Create an account to start booking."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="auth-email">Email</FieldLabel>
                <Input
                  id="auth-email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    onChangeForm({ ...form, email: e.target.value })
                  }
                  placeholder="demo@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="auth-password">Password</FieldLabel>
                <Input
                  id="auth-password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    onChangeForm({ ...form, password: e.target.value })
                  }
                  placeholder="Password"
                  required
                />
              </Field>
            </FieldGroup>
            {error ? (
              <p className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : null}
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <button
            type="button"
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
            onClick={onSwitch}
          >
            {mode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </CardFooter>
      </Card>
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
  isAuthenticated,
}: {
  bookings: Booking[];
  loading: boolean;
  isAuthenticated: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My bookings</CardTitle>
        <CardDescription>
          {isAuthenticated
            ? "Your confirmed reservations at this restaurant."
            : "Sign in to see your booking history."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {!isAuthenticated ? (
          <FieldDescription>
            Sign in to view your booking history.
          </FieldDescription>
        ) : loading ? (
          <FieldDescription>Loading bookings...</FieldDescription>
        ) : bookings.length === 0 ? (
          <FieldDescription>
            No bookings yet. The first table is yours.
          </FieldDescription>
        ) : (
          bookings.map((booking) => (
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
          ))
        )}
      </CardContent>
    </Card>
  );
}

function StatLabel({ label, value }: { label: string; value: string }) {
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
