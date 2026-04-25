import { useState, useEffect } from "react";
import { RestaurantDto, BookingDto } from "./types";
import { getRestaurants, getBookings } from "./api/bookingApi";
import { RestaurantList } from "./components/RestaurantList";
import { BookingForm } from "./components/BookingForm";
import { BookingConfirmation } from "./components/BookingConfirmation";
import { BookingList } from "./components/BookingList";

type View =
  | { kind: "list" }
  | { kind: "form"; restaurant: RestaurantDto }
  | {
      kind: "confirmation";
      booking: {
        id: string;
        restaurantName: string;
        date: string;
        startTime: string;
        partySize: number;
        customerName: string;
      };
    }
  | { kind: "bookings" };

export function App() {
  const [view, setView] = useState<View>({ kind: "list" });
  const [restaurants, setRestaurants] = useState<RestaurantDto[]>([]);
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRestaurants()
      .then(setRestaurants)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to load restaurants.",
        ),
      );
  }, []);

  useEffect(() => {
    if (view.kind === "bookings") {
      getBookings()
        .then(setBookings)
        .catch((err) =>
          setError(
            err instanceof Error ? err.message : "Failed to load bookings.",
          ),
        );
    }
  }, [view]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {view.kind === "list" && (
        <RestaurantList
          restaurants={restaurants}
          onSelect={(restaurant) => setView({ kind: "form", restaurant })}
          onViewBookings={() => setView({ kind: "bookings" })}
        />
      )}
      {view.kind === "form" && (
        <BookingForm
          restaurant={view.restaurant}
          onSuccess={(booking) => setView({ kind: "confirmation", booking })}
          onCancel={() => setView({ kind: "list" })}
        />
      )}
      {view.kind === "confirmation" && (
        <BookingConfirmation
          booking={view.booking}
          onClose={() => setView({ kind: "list" })}
        />
      )}
      {view.kind === "bookings" && (
        <BookingList
          bookings={bookings}
          onBack={() => setView({ kind: "list" })}
        />
      )}
    </div>
  );
}
