// pattern: Imperative Shell

import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { AuthDialog } from "./components/AuthDialog";
import { BookingForm } from "./components/BookingForm";
import type { BookingFields } from "./components/BookingForm";
import { BookingHistory } from "./components/BookingHistory";
import { ConfirmationCard } from "./components/ConfirmationCard";
import { NavHeader } from "./components/NavHeader";
import { RestaurantList } from "./components/RestaurantList";
import {
  type Booking,
  type CreateBookingRequest,
  type ErrorResponse,
  useCreateBooking,
  useListAvailableSlots,
  useListBookingsMine,
  useListRestaurants,
} from "./generated/booking-client";
import { useAuth } from "./hooks/useAuth";

const today = new Date().toISOString().slice(0, 10);

const defaultForm: BookingFields = {
  date: today,
  partySize: 2,
  time: "",
  guestName: "",
  guestEmail: "",
};

function App() {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [form, setForm] = useState(defaultForm);
  const [formError, setFormError] = useState("");
  const [confirmation, setConfirmation] = useState<Booking | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const restaurantsQuery = useListRestaurants();

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
      fetch: undefined,
    },
  );

  const bookingsQuery = useListBookingsMine({
    query: { enabled: auth.isAuthenticated },
    fetch: undefined,
  });

  const bookingMutation = useCreateBooking({
    fetch: auth.csrfToken
      ? ({ headers: { "X-CSRF-TOKEN": auth.csrfToken } } as RequestInit)
      : undefined,
  });

  const selectedBookings = useMemo(
    () =>
      ((bookingsQuery.data?.data ?? []) as Booking[]).filter(
        (booking) => booking.restaurantId === effectiveRestaurantId,
      ),
    [bookingsQuery.data, effectiveRestaurantId],
  );

  const maxCapacity = selectedRestaurant
    ? Math.max(...selectedRestaurant.tables.map((table) => table.capacity))
    : 0;

  const handleAuthLogin = useCallback(
    async (email: string, password: string) => {
      const result = await auth.login(email, password);
      if (result.status !== 200) {
        setAuthError(
          (result.data as ErrorResponse).message || "Invalid credentials",
        );
        throw new Error("Login failed");
      }
    },
    [auth],
  );

  const handleAuthRegister = useCallback(
    async (email: string, password: string) => {
      const result = await auth.register(email, password);
      if (result.status !== 200) {
        setAuthError(
          (result.data as ErrorResponse).message || "Registration failed",
        );
        throw new Error("Registration failed");
      }
    },
    [auth],
  );

  const handleFieldChange = useCallback((fields: Partial<BookingFields>) => {
    setForm((current) => ({ ...current, ...fields }));
  }, []);

  function chooseRestaurant(restaurantId: string) {
    setSelectedRestaurantId(restaurantId);
    setConfirmation(null);
    setFormError("");
  }

  function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setConfirmation(null);
    setFormError("");

    if (!form.time) {
      setFormError("Choose an available seating time before booking.");
      return;
    }

    if (!auth.isAuthenticated) {
      setAuthDialogOpen(true);
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
        } satisfies CreateBookingRequest,
      },
      {
        onSuccess: async (response) => {
          if (response.status !== 201) {
            setFormError(
              (response.data as ErrorResponse).message || "Booking failed",
            );
            return;
          }

          setConfirmation(response.data as Booking);
          setForm((current) => ({
            ...current,
            time: "",
            guestName: "",
            guestEmail: "",
          }));
          setFormError("");
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: ["/api/bookings/mine"],
            }),
            queryClient.invalidateQueries({
              queryKey: [
                `/api/restaurants/${effectiveRestaurantId}/availability`,
              ],
            }),
          ]);
        },
        onError: (err: unknown) => {
          setFormError(
            err instanceof Error ? err.message : "An unexpected error occurred",
          );
        },
      },
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <NavHeader
          isAuthenticated={auth.isAuthenticated}
          userEmail={auth.user?.email ?? null}
          onLoginClick={() => setAuthDialogOpen(true)}
          onLogout={async () => {
            setIsLoggingOut(true);
            await auth.logout();
            setConfirmation(null);
            setFormError("");
            setIsLoggingOut(false);
          }}
          isLoggingOut={isLoggingOut}
        />

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
                  value={
                    restaurantsQuery.data?.data?.length.toString() ?? "..."
                  }
                />
                <Stat
                  label="Bookings"
                  value={(Array.isArray(bookingsQuery.data?.data)
                    ? bookingsQuery.data.data.length
                    : 0
                  ).toString()}
                />
                <Stat label="Seat window" value="17-21" />
                <Stat label="Duration" value="2h" />
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <RestaurantList
            restaurants={restaurantsQuery.data?.data ?? []}
            selectedId={effectiveRestaurantId}
            isLoading={restaurantsQuery.isLoading}
            onSelect={chooseRestaurant}
          />

          <section className="grid gap-6" aria-labelledby="booking-heading">
            {auth.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : auth.isAuthenticated ? (
              <>
                <BookingForm
                  selectedRestaurant={selectedRestaurant}
                  date={form.date}
                  partySize={form.partySize}
                  time={form.time}
                  guestName={form.guestName}
                  guestEmail={form.guestEmail}
                  today={today}
                  maxCapacity={maxCapacity}
                  availabilityQuery={{
                    data: (availabilityQuery.data?.data ??
                      []) as import("./generated/booking-client").AvailabilitySlot[],
                    isFetching: availabilityQuery.isFetching,
                    error: availabilityQuery.error as Error | null,
                  }}
                  isPending={bookingMutation.isPending}
                  error={formError}
                  onFieldChange={handleFieldChange}
                  onSubmit={submitBooking}
                />

                {confirmation ? (
                  <ConfirmationCard booking={confirmation} />
                ) : null}

                <BookingHistory
                  bookings={selectedBookings}
                  isLoading={bookingsQuery.isLoading}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-xl border bg-card p-12 text-center">
                <h2 className="text-xl font-semibold">
                  Sign in to book a table
                </h2>
                <p className="max-w-sm text-muted-foreground">
                  Create an account or sign in to make reservations and view
                  your booking history.
                </p>
                <Button onClick={() => setAuthDialogOpen(true)}>
                  Sign in or register
                </Button>
              </div>
            )}
          </section>
        </div>
      </section>

      <AuthDialog
        open={authDialogOpen}
        onClose={() => {
          setAuthDialogOpen(false);
          setAuthError("");
        }}
        onLogin={handleAuthLogin}
        onRegister={handleAuthRegister}
        error={authError}
        clearError={() => setAuthError("")}
      />
    </main>
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

export default App;
