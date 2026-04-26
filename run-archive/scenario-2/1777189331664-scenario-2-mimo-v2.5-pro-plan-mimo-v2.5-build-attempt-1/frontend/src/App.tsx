// pattern: Imperative Shell

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Clock,
  Loader2,
  LogOut,
  MapPin,
  User,
  Users,
} from "lucide-react";
import { AuthForm } from "./components/AuthForm";
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
  createBooking,
  getCsrfToken,
  listAvailableSlots,
  listBookings,
  listRestaurants,
  type AvailabilitySlot,
  type Booking,
  type CreateBookingRequest,
  type ErrorResponse,
  type Restaurant,
} from "./generated/booking-client";
import { useAuth } from "./lib/auth";
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
  const { user, isLoading: authLoading, logout } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <span className="text-lg font-semibold tracking-tight">
              Restaurant Booking
            </span>
          </div>
        </header>
        <section className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Sign in to book a table
            </h1>
            <p className="mt-2 text-muted-foreground">
              Create an account or sign in to make reservations.
            </p>
          </div>
          <AuthForm
            mode={authMode}
            onSwitch={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
          />
        </section>
      </main>
    );
  }

  return <AuthenticatedApp user={user} onLogout={logout} />;
}

function AuthenticatedApp({
  user,
  onLogout,
}: {
  user: { email: string; userId: string };
  onLogout: () => void;
}) {
  const queryClient = useQueryClient();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [formMessage, setFormMessage] = useState("");
  const [confirmation, setConfirmation] = useState<Booking | null>(null);

  const restaurantsQuery = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => (await listRestaurants()).data,
  });

  const bookingsQuery = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await listBookings({ credentials: "include" });
      if (response.status === 200 && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
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
    mutationFn: async (request: CreateBookingRequest) => {
      const csrfRes = await getCsrfToken({ credentials: "include" });
      const token =
        csrfRes.status === 200 && "token" in csrfRes.data
          ? csrfRes.data.token
          : null;
      return createBooking(request, {
        credentials: "include",
        headers: token ? { "X-CSRF-TOKEN": token } : {},
      });
    },
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
        queryClient.invalidateQueries({ queryKey: ["bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["availability"] }),
      ]);
    },
  });

  const myBookings = bookingsQuery.data ?? [];
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

    if (!form.time) {
      setFormMessage("Choose an available seating time before booking.");
      return;
    }

    bookingMutation.mutate({
      restaurantId: effectiveRestaurantId,
      date: form.date,
      time: form.time,
      partySize: form.partySize,
      guestName: form.guestName,
      guestEmail: form.guestEmail,
    });
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-lg font-semibold tracking-tight">
            Restaurant Booking
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              <User data-icon="inline-start" className="size-4" />
              {user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut data-icon="inline-start" className="size-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

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
                <Stat
                  label="Restaurants"
                  value={restaurantsQuery.data?.length.toString() ?? "..."}
                />
                <Stat
                  label="My bookings"
                  value={myBookings.length.toString() ?? "..."}
                />
                <Stat label="Seat window" value="17-21" />
                <Stat label="Duration" value="2h" />
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
                <CardFooter>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setConfirmation(null);
                    }}
                  >
                    Book another
                  </Button>
                </CardFooter>
              </Card>
            ) : null}

            <MyBookings
              bookings={myBookings}
              loading={bookingsQuery.isLoading}
            />
          </section>
        </div>
      </section>
    </main>
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

function MyBookings({
  bookings,
  loading,
}: {
  bookings: Booking[];
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Bookings</CardTitle>
        <CardDescription>
          Your confirmed reservations across all restaurants.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {loading ? (
          <FieldDescription>Loading bookings...</FieldDescription>
        ) : null}
        {!loading && bookings.length === 0 ? (
          <FieldDescription>
            No bookings yet. Select a restaurant and make your first
            reservation.
          </FieldDescription>
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
