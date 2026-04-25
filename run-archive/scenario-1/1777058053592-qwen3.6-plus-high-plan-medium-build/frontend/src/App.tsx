import { useState } from "react";
import type { Booking, Restaurant } from "./api/types";
import { RestaurantList } from "./components/RestaurantList/RestaurantList";
import { BookingForm } from "./components/BookingForm/BookingForm";
import { BookingConfirmation } from "./components/BookingConfirmation/BookingConfirmation";
import { ExistingBookings } from "./components/ExistingBookings/ExistingBookings";

type View = "list" | "booking" | "confirmed";

export default function App() {
  const [view, setView] = useState<View>("list");
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  function handleSelectRestaurant(restaurant: Restaurant) {
    setSelectedRestaurant(restaurant);
    setError(null);
    setView("booking");
  }

  function handleBooked(booking: Booking) {
    setConfirmedBooking(booking);
    setView("confirmed");
  }

  function handleDone() {
    setConfirmedBooking(null);
    setSelectedRestaurant(null);
    setView("list");
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "24px" }}>
      <h1>Restaurant Booking System</h1>

      {error && (
        <div
          style={{
            padding: "12px",
            background: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "4px",
            color: "#dc2626",
            marginBottom: "16px",
          }}
        >
          {error}
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: "8px", cursor: "pointer" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {view === "list" && (
        <RestaurantList
          onSelect={handleSelectRestaurant}
          selectedId={selectedRestaurant?.id}
        />
      )}

      {view === "booking" && selectedRestaurant && (
        <>
          <button
            onClick={() => setView("list")}
            style={{ marginBottom: "16px", cursor: "pointer" }}
          >
            &larr; Back to restaurants
          </button>
          <BookingForm
            restaurant={selectedRestaurant}
            onBooked={handleBooked}
            onError={setError}
          />
        </>
      )}

      {view === "confirmed" && confirmedBooking && (
        <BookingConfirmation booking={confirmedBooking} onDone={handleDone} />
      )}

      <hr style={{ margin: "32px 0" }} />
      <ExistingBookings />
    </div>
  );
}
