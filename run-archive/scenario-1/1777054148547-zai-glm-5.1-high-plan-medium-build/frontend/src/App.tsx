import { useState, useEffect } from "react";
import type { Restaurant, Booking } from "./types";
import { fetchRestaurants, fetchBookings } from "./api/client";
import { RestaurantList } from "./components/RestaurantList";
import { BookingForm } from "./components/BookingForm";
import { BookingList } from "./components/BookingList";

export default function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRestaurants()
      .then(setRestaurants)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to load restaurants",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedRestaurant) {
      fetchBookings(selectedRestaurant.id)
        .then(setBookings)
        .catch(() => setBookings([]));
    }
  }, [selectedRestaurant]);

  function refreshBookings() {
    if (selectedRestaurant) {
      fetchBookings(selectedRestaurant.id)
        .then(setBookings)
        .catch(() => {});
    }
  }

  if (loading) return <p>Loading restaurants...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>Restaurant Booking</h1>
      <RestaurantList
        restaurants={restaurants}
        onSelect={setSelectedRestaurant}
        selectedId={selectedRestaurant?.id ?? null}
      />
      {selectedRestaurant && (
        <div style={{ marginTop: "2rem" }}>
          <BookingForm
            restaurant={selectedRestaurant}
            onBookingCreated={refreshBookings}
          />
          <div style={{ marginTop: "2rem" }}>
            <BookingList bookings={bookings} />
          </div>
        </div>
      )}
    </div>
  );
}
