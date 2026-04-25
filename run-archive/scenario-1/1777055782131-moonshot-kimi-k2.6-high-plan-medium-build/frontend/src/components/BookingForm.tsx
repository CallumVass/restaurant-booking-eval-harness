import { useState, useCallback } from "react";
import { RestaurantDto, CreateBookingRequest } from "../types";
import { getAvailableSlots, createBooking } from "../api/bookingApi";

interface BookingFormProps {
  restaurant: RestaurantDto;
  onSuccess: (booking: {
    id: string;
    restaurantName: string;
    date: string;
    startTime: string;
    partySize: number;
    customerName: string;
  }) => void;
  onCancel: () => void;
}

export function BookingForm({
  restaurant,
  onSuccess,
  onCancel,
}: BookingFormProps) {
  const [date, setDate] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [customerName, setCustomerName] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSlots = useCallback(async () => {
    if (!date || partySize <= 0) {
      setError("Please select a date and valid party size.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const available = await getAvailableSlots(restaurant.id, date, partySize);
      setSlots(available);
      if (available.length === 0) {
        setError("No available slots for the selected criteria.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load slots.");
    } finally {
      setLoading(false);
    }
  }, [restaurant.id, date, partySize]);

  const handleBook = useCallback(
    async (startTime: string) => {
      if (!customerName.trim()) {
        setError("Please enter your name.");
        return;
      }
      setError(null);
      setLoading(true);
      try {
        const request: CreateBookingRequest = {
          restaurantId: restaurant.id,
          date,
          startTime,
          partySize,
          customerName: customerName.trim(),
        };
        const booking = await createBooking(request);
        onSuccess({
          id: booking.id,
          restaurantName: restaurant.name,
          date,
          startTime,
          partySize,
          customerName: customerName.trim(),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Booking failed.");
      } finally {
        setLoading(false);
      }
    },
    [restaurant, date, partySize, customerName, onSuccess],
  );

  return (
    <div>
      <h1>Book {restaurant.name}</h1>
      <button type="button" onClick={onCancel}>
        Back
      </button>
      <div>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="partySize">Party size</label>
        <input
          id="partySize"
          type="number"
          min={1}
          value={partySize}
          onChange={(e) => setPartySize(Number(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="customerName">Your name</label>
        <input
          id="customerName"
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>
      <button type="button" onClick={fetchSlots} disabled={loading}>
        Find slots
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {slots.length > 0 && (
        <div>
          <h2>Available slots</h2>
          <ul>
            {slots.map((slot) => (
              <li key={slot}>
                {slot}{" "}
                <button
                  type="button"
                  onClick={() => handleBook(slot)}
                  disabled={loading}
                >
                  Book
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
