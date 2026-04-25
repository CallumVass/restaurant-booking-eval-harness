// pattern: Imperative Shell

import { useState, type FormEvent, type ReactNode } from "react";
import { CalendarCheck, Clock, MapPin, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getListAvailabilityQueryKey,
  getListBookingsQueryKey,
  type BookingResponse,
  type RestaurantResponse,
  useCreateBooking,
  useListAvailability,
  useListBookings,
  useListRestaurants,
} from "./api/generated/restaurant-booking";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Skeleton } from "./components/ui/skeleton";

const defaultDate = "2026-05-02";

function App() {
  const queryClient = useQueryClient();
  const restaurantsQuery = useListRestaurants();
  const bookingsQuery = useListBookings();
  const restaurants = restaurantsQuery.data?.data ?? [];
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("harbor");
  const [date, setDate] = useState(defaultDate);
  const [partySize, setPartySize] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState("18:00");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [confirmation, setConfirmation] = useState<BookingResponse | null>(
    null,
  );
  const [apiError, setApiError] = useState<string | null>(null);
  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === selectedRestaurantId,
  );
  const availabilityQuery = useListAvailability(
    selectedRestaurantId,
    { date, partySize },
    {
      query: {
        enabled: Boolean(selectedRestaurantId && date && partySize > 0),
      },
    },
  );
  const slots =
    availabilityQuery.data?.status === 200 ? availabilityQuery.data.data : [];
  const createBooking = useCreateBooking({
    mutation: {
      onSuccess: (response) => {
        if (response.status !== 201) {
          setConfirmation(null);
          setApiError(
            response.data.title ?? "The booking could not be created.",
          );
          return;
        }

        setApiError(null);
        setConfirmation(response.data);
        void queryClient.invalidateQueries({
          queryKey: getListBookingsQueryKey(),
        });
        void queryClient.invalidateQueries({
          queryKey: getListAvailabilityQueryKey(selectedRestaurantId, {
            date,
            partySize,
          }),
        });
      },
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);
    createBooking.mutate({
      data: {
        restaurantId: selectedRestaurantId,
        date,
        startTime: selectedSlot,
        partySize,
        guestName,
        guestEmail,
      },
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="overflow-hidden rounded-[2rem] border bg-card shadow-sm">
          <div className="grid gap-6 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_32rem)] p-6 md:grid-cols-[1.25fr_0.75fr] md:p-10">
            <div className="flex flex-col gap-5">
              <Badge className="w-fit" variant="secondary">
                Dinner bookings for 2026
              </Badge>
              <div className="flex flex-col gap-3">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                  Reserve a table without double-booking the room.
                </h1>
                <p className="max-w-2xl text-lg text-muted-foreground">
                  Browse restaurants, see live slot availability, and create a
                  confirmed reservation through a typed OpenAPI client.
                </p>
              </div>
            </div>
            <Card className="bg-background/80 backdrop-blur">
              <CardHeader>
                <CardTitle>Tonight's rhythm</CardTitle>
                <CardDescription>
                  Service slots are 90 minutes with adjacent bookings allowed.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-3 text-center">
                <Metric label="Restaurants" value={restaurants.length || 3} />
                <Metric label="Slot step" value="30m" />
                <Metric label="Duration" value="90m" />
              </CardContent>
            </Card>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section
            className="flex flex-col gap-4"
            aria-labelledby="restaurants-heading"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2
                  id="restaurants-heading"
                  className="text-2xl font-semibold tracking-tight"
                >
                  Restaurants
                </h2>
                <p className="text-sm text-muted-foreground">
                  Pick a dining room to see matching capacity.
                </p>
              </div>
            </div>
            {restaurantsQuery.isLoading ? (
              <RestaurantSkeletons />
            ) : (
              <div className="grid gap-3">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    selected={restaurant.id === selectedRestaurantId}
                    onSelect={() => {
                      setSelectedRestaurantId(restaurant.id);
                      setConfirmation(null);
                      setApiError(null);
                    }}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Book a table</CardTitle>
                <CardDescription>
                  {selectedRestaurant
                    ? `Requesting ${selectedRestaurant.name} in ${selectedRestaurant.neighborhood}.`
                    : "Choose a restaurant to begin."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Date" htmlFor="date">
                      <Input
                        id="date"
                        min="2026-01-01"
                        max="2026-12-31"
                        type="date"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                      />
                    </Field>
                    <Field label="Party size" htmlFor="partySize">
                      <Input
                        id="partySize"
                        min={1}
                        max={12}
                        type="number"
                        value={partySize}
                        onChange={(event) =>
                          setPartySize(Number(event.target.value))
                        }
                      />
                    </Field>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Available slots</Label>
                    {availabilityQuery.isFetching ? (
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {Array.from({ length: 5 }, (_, index) => (
                          <Skeleton key={index} className="h-10" />
                        ))}
                      </div>
                    ) : slots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                        {slots.map((slot) => (
                          <Button
                            key={slot.startTime}
                            type="button"
                            variant={
                              selectedSlot === slot.startTime
                                ? "default"
                                : "outline"
                            }
                            onClick={() => setSelectedSlot(slot.startTime)}
                          >
                            {slot.startTime}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <Alert>
                        <AlertTitle>No matching slots</AlertTitle>
                        <AlertDescription>
                          Try a smaller party size or a different date.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Guest name" htmlFor="guestName">
                      <Input
                        id="guestName"
                        required
                        value={guestName}
                        onChange={(event) => setGuestName(event.target.value)}
                        placeholder="Ada Lovelace"
                      />
                    </Field>
                    <Field label="Guest email" htmlFor="guestEmail">
                      <Input
                        id="guestEmail"
                        required
                        type="email"
                        value={guestEmail}
                        onChange={(event) => setGuestEmail(event.target.value)}
                        placeholder="ada@example.com"
                      />
                    </Field>
                  </div>

                  {apiError ? (
                    <Alert variant="destructive">
                      <AlertTitle>Booking needs attention</AlertTitle>
                      <AlertDescription>{apiError}</AlertDescription>
                    </Alert>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={
                      !selectedSlot ||
                      createBooking.isPending ||
                      slots.length === 0
                    }
                  >
                    <CalendarCheck data-icon="inline-start" />
                    {createBooking.isPending
                      ? "Confirming..."
                      : "Confirm booking"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {confirmation ? (
              <Alert>
                <CalendarCheck data-icon="inline-start" />
                <AlertTitle>Booking confirmed: {confirmation.id}</AlertTitle>
                <AlertDescription>
                  {confirmation.guestName} is booked for{" "}
                  {confirmation.partySize} on {confirmation.date} at{" "}
                  {confirmation.startTime}.
                </AlertDescription>
              </Alert>
            ) : null}

            <BookingsPanel
              bookings={bookingsQuery.data?.data ?? []}
              restaurants={restaurants}
              loading={bookingsQuery.isLoading}
            />
          </section>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border bg-card p-3">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function RestaurantCard({
  restaurant,
  selected,
  onSelect,
}: {
  restaurant: RestaurantResponse;
  selected: boolean;
  onSelect: () => void;
}) {
  const maxCapacity = Math.max(
    ...restaurant.tables.map((table) => table.capacity),
  );

  return (
    <Card className={selected ? "border-primary shadow-md" : ""}>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>{restaurant.name}</CardTitle>
            <CardDescription>{restaurant.description}</CardDescription>
          </div>
          <Button
            type="button"
            variant={selected ? "default" : "outline"}
            onClick={onSelect}
          >
            {selected ? "Selected" : "Choose"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Badge variant="secondary">{restaurant.cuisine}</Badge>
        <Badge variant="outline">
          <MapPin data-icon="inline-start" />
          {restaurant.neighborhood}
        </Badge>
        <Badge variant="outline">
          <Users data-icon="inline-start" />
          Seats up to {maxCapacity}
        </Badge>
      </CardContent>
    </Card>
  );
}

function RestaurantSkeletons() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 3 }, (_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-7 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
          </CardHeader>
          <CardContent className="flex gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function BookingsPanel({
  bookings,
  restaurants,
  loading,
}: {
  bookings: BookingResponse[];
  restaurants: RestaurantResponse[];
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Existing bookings</CardTitle>
        <CardDescription>
          Current in-memory reservations refresh after each confirmation.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {loading ? <Skeleton className="h-24" /> : null}
        {!loading && bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bookings yet.</p>
        ) : (
          bookings.map((booking) => {
            const restaurant = restaurants.find(
              (candidate) => candidate.id === booking.restaurantId,
            );
            return (
              <div
                key={booking.id}
                className="grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div className="flex flex-col gap-1">
                  <div className="font-medium">
                    {restaurant?.name ?? booking.restaurantId}
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock data-icon="inline-start" />
                      {booking.date} at {booking.startTime}-{booking.endTime}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users data-icon="inline-start" />
                      {booking.partySize} guests
                    </span>
                  </div>
                </div>
                <Badge variant="secondary">{booking.id}</Badge>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

export default App;
