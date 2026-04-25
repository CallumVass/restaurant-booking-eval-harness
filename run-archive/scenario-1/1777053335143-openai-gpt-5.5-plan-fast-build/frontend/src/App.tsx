// pattern: Imperative Shell
import { startTransition, useEffect, useState } from "react";
import "./App.css";
import {
  createBooking,
  listAvailability,
  listBookings,
  listRestaurants,
} from "./api";
import type {
  AvailabilitySlot,
  BookingConfirmation,
  BookingRequest,
  RestaurantSummary,
} from "./types";

const defaultDate = "2030-01-05";

function App() {
  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [bookings, setBookings] = useState<BookingConfirmation[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [date, setDate] = useState(defaultDate);
  const [partySize, setPartySize] = useState(2);
  const [guestName, setGuestName] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(
    null,
  );
  const [message, setMessage] = useState("Loading restaurants...");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([listRestaurants(), listBookings()])
      .then(([restaurantData, bookingData]) => {
        if (!isMounted) {
          return;
        }

        setRestaurants(restaurantData);
        setBookings(bookingData);
        setSelectedRestaurantId(restaurantData[0]?.id ?? "");
        setMessage("Choose a table size and time to book.");
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setMessage(
            error instanceof Error ? error.message : "Unable to load data.",
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedRestaurantId) {
      return;
    }

    let isMounted = true;
    listAvailability(selectedRestaurantId, date, partySize)
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setSlots(data);
        setSelectedSlot(data[0]?.startsAt ?? "");
        setMessage(
          data.length > 0
            ? "Available slots updated."
            : "No slots are currently available.",
        );
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setSlots([]);
          setSelectedSlot("");
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to load availability.",
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [date, partySize, selectedRestaurantId]);

  const selectedRestaurant = restaurants.find(
    (restaurant) => restaurant.id === selectedRestaurantId,
  );

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedRestaurantId || !selectedSlot) {
      setMessage("Select a restaurant and an available time slot.");
      return;
    }

    setIsSubmitting(true);
    setConfirmation(null);

    const request: BookingRequest = {
      restaurantId: selectedRestaurantId,
      guestName,
      partySize,
      startsAt: selectedSlot,
    };

    try {
      const created = await createBooking(request);
      const [freshBookings, freshSlots] = await Promise.all([
        listBookings(),
        listAvailability(selectedRestaurantId, date, partySize),
      ]);

      startTransition(() => {
        setConfirmation(created);
        setBookings(freshBookings);
        setSlots(freshSlots);
        setSelectedSlot(freshSlots[0]?.startsAt ?? "");
        setGuestName("");
        setMessage("Booking confirmed.");
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Booking failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Restaurant Booking</p>
        <h1>Reserve a table without double-booking the room.</h1>
        <p>
          Browse seeded restaurants, pick a deterministic slot, and confirm an
          in-memory booking through the .NET API.
        </p>
      </section>

      <section className="grid two-column">
        <article className="card">
          <h2>Restaurants</h2>
          <div className="restaurant-list">
            {restaurants.map((restaurant) => (
              <button
                className={
                  restaurant.id === selectedRestaurantId
                    ? "restaurant active"
                    : "restaurant"
                }
                key={restaurant.id}
                onClick={() => setSelectedRestaurantId(restaurant.id)}
                type="button"
              >
                <strong>{restaurant.name}</strong>
                <span>{restaurant.description}</span>
                <small>
                  Parties {restaurant.minPartySize}-{restaurant.maxPartySize}
                </small>
              </button>
            ))}
          </div>
        </article>

        <article className="card">
          <h2>Book A Table</h2>
          <form className="booking-form" onSubmit={submitBooking}>
            <label>
              Date
              <input
                value={date}
                onChange={(event) => setDate(event.target.value)}
                type="date"
              />
            </label>
            <label>
              Party size
              <input
                min="1"
                onChange={(event) => setPartySize(Number(event.target.value))}
                type="number"
                value={partySize}
              />
            </label>
            <label>
              Guest name
              <input
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Ada Lovelace"
                required
                type="text"
                value={guestName}
              />
            </label>
            <label>
              Available slot
              <select
                disabled={slots.length === 0}
                onChange={(event) => setSelectedSlot(event.target.value)}
                value={selectedSlot}
              >
                {slots.map((slot) => (
                  <option key={slot.startsAt} value={slot.startsAt}>
                    {formatTime(slot.startsAt)} ({slot.availableTableCount}{" "}
                    table
                    {slot.availableTableCount === 1 ? "" : "s"})
                  </option>
                ))}
              </select>
            </label>
            <button disabled={isSubmitting || slots.length === 0} type="submit">
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
          <p className="status" role="status">
            {message}
          </p>
          {confirmation ? (
            <div className="confirmation">
              <strong>Confirmed for {confirmation.guestName}</strong>
              <span>
                {selectedRestaurant?.name ?? "Restaurant"} at{" "}
                {formatTime(confirmation.startsAt)} for {confirmation.partySize}
              </span>
            </div>
          ) : null}
        </article>
      </section>

      <section className="card bookings-card">
        <h2>Existing Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className="booking-list">
            {bookings.map((booking) => (
              <div className="booking-row" key={booking.id}>
                <strong>{booking.guestName}</strong>
                <span>{restaurantName(restaurants, booking.restaurantId)}</span>
                <span>
                  {formatDate(booking.startsAt)} at{" "}
                  {formatTime(booking.startsAt)} for {booking.partySize}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

function restaurantName(
  restaurants: RestaurantSummary[],
  restaurantId: string,
) {
  return (
    restaurants.find((restaurant) => restaurant.id === restaurantId)?.name ??
    "Unknown restaurant"
  );
}

export default App;
