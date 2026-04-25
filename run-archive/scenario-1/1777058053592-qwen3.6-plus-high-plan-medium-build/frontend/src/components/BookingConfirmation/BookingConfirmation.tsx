import type { Booking } from "../../api/types";

interface Props {
  booking: Booking;
  onDone: () => void;
}

export function BookingConfirmation({ booking, onDone }: Props) {
  const start = new Date(booking.startTime).toLocaleString();
  const end = new Date(booking.endTime).toLocaleString();

  return (
    <div
      style={{
        padding: "24px",
        border: "2px solid #10b981",
        borderRadius: "8px",
        background: "#ecfdf5",
        maxWidth: "500px",
      }}
    >
      <h2 style={{ color: "#10b981", marginTop: 0 }}>Booking Confirmed!</h2>
      <p>
        <strong>Guest:</strong> {booking.guestName}
      </p>
      <p>
        <strong>Email:</strong> {booking.email}
      </p>
      <p>
        <strong>Party Size:</strong> {booking.partySize}
      </p>
      <p>
        <strong>Start:</strong> {start}
      </p>
      <p>
        <strong>End:</strong> {end}
      </p>
      <p style={{ fontSize: "14px", color: "#6b7280" }}>
        Booking ID: {booking.id}
      </p>
      <button
        onClick={onDone}
        style={{
          padding: "8px 16px",
          background: "#10b981",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "8px",
        }}
      >
        Done
      </button>
    </div>
  );
}
