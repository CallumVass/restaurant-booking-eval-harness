// pattern: Imperative Shell

import { useState } from "react";
import { Loader2, MapPin, Users } from "lucide-react";
import { AuthDialog } from "./components/AuthDialog";
import { BookingForm } from "./components/BookingForm";
import { MyBookings } from "./components/MyBookings";
import { NavHeader } from "./components/NavHeader";
import { PageShell } from "./components/PageShell";
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
import { useListRestaurants } from "./generated/booking-client";
import { useAuth } from "./hooks/useAuth";
import { cn } from "./lib/utils";

type Tab = "restaurants" | "my-bookings";

function App() {
  const { auth } = useAuth();
  const [tab, setTab] = useState<Tab>("restaurants");
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");

  const restaurantsQuery = useListRestaurants();

  const effectiveRestaurantId =
    selectedRestaurantId || restaurantsQuery.data?.data?.[0]?.id || "";

  const selectedRestaurant = (restaurantsQuery.data?.data ?? []).find(
    (r) => r.id === effectiveRestaurantId,
  );

  const isAuthenticated = auth.status === "authenticated";

  const showAuthPrompt = !isAuthenticated && auth.status !== "loading";

  return (
    <>
      <NavHeader
        tab={tab}
        onTabChange={setTab}
        onSignIn={() => setAuthOpen(true)}
      />
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />

      <PageShell>
        {tab === "restaurants" ? (
          <>
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
                      Browse curated restaurants, see real availability, and
                      confirm conflict-safe bookings in one focused flow.
                    </p>
                  </div>
                </div>
                {restaurantsQuery.data?.data ? (
                  <div className="rounded-2xl bg-muted p-5 text-left">
                    <p className="text-sm font-medium text-muted-foreground">
                      Tonight's rhythm
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <Stat
                        label="Restaurants"
                        value={restaurantsQuery.data.data.length.toString()}
                      />
                      <Stat label="Seat window" value="17-21" />
                      <Stat label="Duration" value="2h" />
                      <Stat label="Max party" value="8" />
                    </div>
                  </div>
                ) : null}
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
                {restaurantsQuery.data?.data?.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center gap-3 py-12">
                      <MapPin className="size-12 text-muted-foreground/40" />
                      <p className="text-muted-foreground">
                        No restaurants available right now.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-3">
                    {(restaurantsQuery.data?.data ?? []).map((restaurant) => (
                      <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                        active={restaurant.id === effectiveRestaurantId}
                        onSelect={setSelectedRestaurantId}
                      />
                    ))}
                  </div>
                )}
              </section>

              <section className="grid gap-6" aria-labelledby="booking-heading">
                {showAuthPrompt ? (
                  <Card>
                    <CardHeader>
                      <CardTitle id="booking-heading" className="text-2xl">
                        Sign in to book a table
                      </CardTitle>
                      <CardDescription>
                        You need to be signed in to make a reservation. Sign in
                        or create an account to continue.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => setAuthOpen(true)}>Sign in</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <BookingForm
                    selectedRestaurant={selectedRestaurant}
                    effectiveRestaurantId={effectiveRestaurantId}
                  />
                )}
              </section>
            </div>
          </>
        ) : (
          <div className="pt-4" key="my-bookings-tab">
            <MyBookings />
          </div>
        )}
      </PageShell>
    </>
  );
}

function RestaurantCard({
  restaurant,
  active,
  onSelect,
}: {
  restaurant: {
    id: string;
    name: string;
    cuisine: string;
    neighborhood: string;
    description: string;
    tables: { capacity: number }[];
  };
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
