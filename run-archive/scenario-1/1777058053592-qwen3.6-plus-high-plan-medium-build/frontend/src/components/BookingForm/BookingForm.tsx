import { useState } from "react";
import type { Booking, Restaurant, TimeSlot } from "../../api/types";
import { createBooking, getAvailableSlots } from "../../api/client";

interface Props {
  restaurant: Restaurant;
  onBooked: (booking: Booking) => void;
  onError: (message: string) => void;
}

export function BookingForm({ restaurant, onBooked, onError }: Props) {
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const maxCapacity = Math.max(...restaurant.tables.map((t) => t.capacity));

  async function loadSlots(selectedDate: string, size: number) {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const result = await getAvailableSlots(restaurant.id, selectedDate, size);
      setSlots(result);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to load slots");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  function handleDateChange(d: string) {
    setDate(d);
    setSelectedSlot("");
    loadSlots(d, partySize);
  }

  function handlePartySizeChange(size: number) {
    setPartySize(size);
    setSelectedSlot("");
    if (date) loadSlots(date, size);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) {
      onError("Please select a time slot");
      return;
    }

    setSubmitting(true);
    try {
      const booking = await createBooking({
        restaurantId: restaurant.id,
        guestName,
        email,
        partySize,
        startTime: selectedSlot,
      });
      onBooked(booking);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
      <h2>Book at {restaurant.name}</h2>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "4px" }}>
          Guest Name
        </label>
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "4px" }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "4px" }}>
          Party Size (1-{maxCapacity})
        </label>
        <input
          type="number"
          min={1}
          max={maxCapacity}
          value={partySize}
          onChange={(e) => handlePartySizeChange(Number(e.target.value))}
          required
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "4px" }}>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          required
          style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
        />
      </div>

      {loading && <p>Loading available slots...</p>}

      {slots.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>
            Time Slot
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {slots.map((slot) => {
              const time = new Date(slot.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <button
                  key={slot.start}
                  type="button"
                  onClick={() =>
                    slot.isAvailable && setSelectedSlot(slot.start)
                  }
                  disabled={!slot.isAvailable}
                  style={{
                    padding: "8px 12px",
                    border:
                      selectedSlot === slot.start
                        ? "2px solid #2563eb"
                        : "1px solid #e5e7eb",
                    borderRadius: "4px",
                    background: slot.isAvailable
                      ? selectedSlot === slot.start
                        ? "#2563eb"
                        : "#fff"
                      : "#f3f4f6",
                    color: slot.isAvailable
                      ? selectedSlot === slot.start
                        ? "#fff"
                        : "#000"
                      : "#9ca3af",
                    cursor: slot.isAvailable ? "pointer" : "not-allowed",
                  }}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !selectedSlot}
        style={{
          padding: "12px 24px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: submitting || !selectedSlot ? "not-allowed" : "pointer",
        }}
      >
        {submitting ? "Booking..." : "Book Table"}
      </button>
    </form>
  );
}
