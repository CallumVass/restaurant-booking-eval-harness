import { useState } from "react";
import type { Restaurant, TimeSlot } from "../types";
import { fetchAvailableSlots, createBooking } from "../api/client";

interface BookingFormProps {
  restaurant: Restaurant;
  onBookingCreated: () => void;
}

export function BookingForm({
  restaurant,
  onBookingCreated,
}: BookingFormProps) {
  const [date, setDate] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  async function handleSearchSlots(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSlots([]);
    setSelectedSlot(null);
    setSuccess(false);
    setLoading(true);
    try {
      const result = await fetchAvailableSlots(restaurant.id, date, partySize);
      setSlots(result);
      if (result.length === 0) {
        setError("No available time slots found.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      await createBooking(restaurant.id, {
        tableId: selectedSlot.tableId,
        customerName,
        date,
        time: selectedSlot.time,
        partySize,
      });
      setSuccess(true);
      setSlots([]);
      setSelectedSlot(null);
      setCustomerName("");
      onBookingCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Book a Table at {restaurant.name}</h2>

      <form onSubmit={handleSearchSlots} style={{ marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Date:{" "}
            <input
              type="date"
              value={date}
              min={minDate}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>
            Party Size:{" "}
            <input
              type="number"
              min={1}
              max={10}
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              required
            />
          </label>
        </div>
        <button type="submit" disabled={loading || !date}>
          {loading ? "Searching..." : "Find Available Slots"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {slots.length > 0 && !selectedSlot && (
        <div>
          <h3>Available Time Slots</h3>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {slots.map((slot) => (
              <button
                key={`${slot.time}-${slot.tableId}`}
                onClick={() => setSelectedSlot(slot)}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid #0066cc",
                  borderRadius: "4px",
                  cursor: "pointer",
                  background: "#fff",
                }}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSlot && (
        <form onSubmit={handleBooking} style={{ marginTop: "1rem" }}>
          <h3>Confirm Booking for {selectedSlot.time}</h3>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>
              Your Name:{" "}
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
          <button
            type="button"
            onClick={() => setSelectedSlot(null)}
            style={{ marginLeft: "0.5rem" }}
          >
            Cancel
          </button>
        </form>
      )}

      {success && (
        <p style={{ color: "green", marginTop: "1rem" }}>
          Booking confirmed! Your table has been reserved.
        </p>
      )}
    </div>
  );
}
