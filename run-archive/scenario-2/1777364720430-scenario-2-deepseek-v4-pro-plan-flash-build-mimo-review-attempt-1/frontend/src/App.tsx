// pattern: Imperative Shell

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ForkKnife, History, Loader2 } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Field, FieldGroup, FieldLabel } from "./components/ui/field";
import { Input } from "./components/ui/input";
import {
  useListRestaurants,
  useListAvailableSlots,
  useListMyBookings,
  useCreateBooking,
  useListBookings,
  type Booking,
  type CreateBookingRequest,
} from "./generated/booking-hooks";
import { useAuth } from "./hooks/use-auth";
import { AuthGate } from "./components/auth/AuthGate";
import { AuthHeader } from "./components/auth/AuthHeader";
import { LoginDialog } from "./components/auth/LoginDialog";
import { BookingForm } from "./components/booking/BookingForm";
import { ConfirmationCard } from "./components/booking/ConfirmationCard";
import { RestaurantCard } from "./components/restaurant/RestaurantCard";
import { ExistingBookings } from "./components/booking/ExistingBookings";

type BookingForm = {
  date: string;
  partySize: number;
  time: string;
  guestName: string;
  guestEmail: string;
};

type Tab = "restaurants" | "my-bookings";

const today = new Date().toISOString().slice(0, 10);

const defaultForm: BookingForm = {
  date: today,
  partySize: 2,
  time: "",
  guestName: "",
  guestEmail: "",
};

function formatTime(value: string) {
  return value.slice(0, 5);
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

export default function App() {
  const {
    user,
    isLoading: authLoading,
    csrfToken,
    csrfHeaderName,
    login,
    register,
    logout,
  } = useAuth();
  const queryClient = useQueryClient();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [formMessage, setFormMessage] = useState("");
  const [confirmation, setConfirmation] = useState<Booking | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("restaurants");

  const restaurantsQuery = useListRestaurants();
  const bookingsQuery = useListBookings();
  const myBookingsQuery = useListMyBookings({
    query: {
      enabled: activeTab === "my-bookings" && !!user,
      queryKey: ["bookings", "mine"],
    },
    fetch: { credentials: "include" },
  });

  const effectiveRestaurantId =
    selectedRestaurantId || restaurantsQuery.data?.data?.[0]?.id || "";
  const selectedRestaurant = restaurantsQuery.data?.data?.find(
    (r) => r.id === effectiveRestaurantId,
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
      fetch: { credentials: "include" },
    },
  );

  const createBookingMutation = useCreateBooking({
    fetch: {
      credentials: "include",
      headers: { [csrfHeaderName]: csrfToken },
    },
  });

  const selectedBookings =
    bookingsQuery.data?.data?.filter(
      (b) => b.restaurantId === effectiveRestaurantId,
    ) ?? [];
  const maxCapacity = selectedRestaurant
    ? Math.max(...selectedRestaurant.tables.map((t) => t.capacity))
    : 0;

  function chooseRestaurant(restaurantId: string) {
    setSelectedRestaurantId(restaurantId);
    setConfirmation(null);
    setFormMessage("");
    setActiveTab("restaurants");
  }

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmation(null);
    setFormMessage("");

    if (!form.time) {
      setFormMessage("Choose an available seating time before booking.");
      return;
    }

    try {
      const response = await createBookingMutation.mutateAsync({
        data: {
          restaurantId: effectiveRestaurantId,
          date: form.date,
          time: form.time,
          partySize: form.partySize,
          guestName: form.guestName,
          guestEmail: form.guestEmail,
        } as CreateBookingRequest,
      });

      if (response.status === 201) {
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
          queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] }),
          queryClient.invalidateQueries({ queryKey: ["availability"] }),
        ]);
      } else {
        setFormMessage(
          (response.data as { message?: string }).message ?? "Booking failed",
        );
      }
    } catch {
      setFormMessage("An unexpected error occurred. Please try again.");
    }
  }

  async function handleLogin(email: string, password: string) {
    await login(email, password);
    queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
  }

  async function handleLogout() {
    await logout();
    setConfirmation(null);
    setFormMessage("");
    queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
  }

  const restaurantsData = restaurantsQuery.data?.data ?? [];
  const bookingsData = bookingsQuery.data?.data ?? [];
  const myBookingsData =
    (myBookingsQuery.data?.data != null &&
    Array.isArray(myBookingsQuery.data.data)
      ? (myBookingsQuery.data.data as Booking[])
      : []) ?? [];

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-3 md:px-10">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Restaurant Booking
            </h1>
            {authLoading ? (
              <Loader2 className="size-4 animate-spin" aria-label="Loading" />
            ) : (
              <AuthHeader
                email={user?.email ?? ""}
                onLogout={handleLogout}
                onShowLogin={() => setShowLogin(true)}
                isAuthenticated={!!user}
              />
            )}
          </div>
          <div className="grid gap-6 p-6 md:grid-cols-[1.4fr_0.8fr] md:p-10">
            <div className="flex flex-col justify-center gap-5 text-left">
              <Badge className="w-fit bg-secondary text-secondary-foreground">
                Dinner service booking
              </Badge>
              <div className="flex flex-col gap-3">
                <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
                  Reserve a table without the reservation roulette.
                </h2>
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
                  value={
                    restaurantsQuery.data?.data?.length.toString() ?? "..."
                  }
                />
                <Stat label="Bookings" value={bookingsData.length.toString()} />
                <Stat label="Seat window" value="17-21" />
                <Stat label="Duration" value="2h" />
              </div>
            </div>
          </div>
        </header>

        {/* Tab navigation */}
        <div className="flex gap-2 border-b">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "restaurants"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("restaurants")}
          >
            <ForkKnife data-icon="inline-start" />
            Restaurants
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "my-bookings"
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("my-bookings")}
          >
            <History data-icon="inline-start" />
            My Bookings
          </button>
        </div>

        {/* Restaurants tab */}
        {activeTab === "restaurants" ? (
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
                {restaurantsData.map((restaurant) => (
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
              {!user ? (
                <AuthGate onSignIn={() => setShowLogin(true)} />
              ) : selectedRestaurant ? (
                <BookingForm
                  form={form}
                  onChange={setForm}
                  onSubmit={submitBooking}
                  isPending={createBookingMutation.isPending}
                  formMessage={formMessage}
                  availabilitySlots={
                    Array.isArray(availabilityQuery.data?.data)
                      ? availabilityQuery.data.data
                      : []
                  }
                  availabilityLoading={availabilityQuery.isFetching}
                  availabilityError={
                    availabilityQuery.error &&
                    typeof availabilityQuery.error === "object" &&
                    "message" in availabilityQuery.error
                      ? (availabilityQuery.error as { message: string }).message
                      : undefined
                  }
                  today={today}
                  maxCapacity={maxCapacity}
                  restaurantName={selectedRestaurant.name}
                  restaurantCuisine={selectedRestaurant.cuisine}
                  restaurantNeighborhood={selectedRestaurant.neighborhood}
                />
              ) : null}

              {confirmation ? (
                <ConfirmationCard booking={confirmation} />
              ) : null}

              <ExistingBookings
                bookings={selectedBookings}
                loading={bookingsQuery.isLoading}
              />
            </section>
          </div>
        ) : null}

        {/* My Bookings tab */}
        {activeTab === "my-bookings" ? (
          <section aria-labelledby="my-bookings-heading">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2
                  id="my-bookings-heading"
                  className="text-2xl font-semibold tracking-tight"
                >
                  My Bookings
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your upcoming reservations across all restaurants.
                </p>
              </div>
            </div>

            {!user ? (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Sign in required</CardTitle>
                  <CardDescription>
                    Sign in to view your booking history.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setShowLogin(true)}>Sign in</Button>
                </CardContent>
              </Card>
            ) : null}

            {user && myBookingsQuery.isLoading ? (
              <div className="mt-4 flex items-center justify-center py-12">
                <Loader2
                  className="size-8 animate-spin"
                  aria-label="Loading bookings"
                />
              </div>
            ) : null}

            {user &&
            !myBookingsQuery.isLoading &&
            myBookingsData.length === 0 ? (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>No bookings yet</CardTitle>
                  <CardDescription>
                    You haven't made any reservations yet. Head over to the
                    Restaurants tab to book a table.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : null}

            {user && myBookingsData.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {myBookingsData.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle>{booking.restaurantName}</CardTitle>
                          <CardDescription>
                            {booking.date} at {formatTime(booking.time)}{" "}
                            &middot; {booking.guestName} &middot; party of{" "}
                            {booking.partySize}
                          </CardDescription>
                        </div>
                        <Badge>Table {booking.tableId}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}
      </section>

      {showLogin ? (
        <LoginDialog
          onLogin={handleLogin}
          onRegister={async (email, password) => {
            await register(email, password);
            queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
          }}
          onClose={() => setShowLogin(false)}
        />
      ) : null}
    </main>
  );
}
