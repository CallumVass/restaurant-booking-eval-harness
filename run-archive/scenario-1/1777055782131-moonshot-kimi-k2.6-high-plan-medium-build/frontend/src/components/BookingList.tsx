import { BookingDto } from "../types";

interface BookingListProps {
  bookings: BookingDto[];
  onBack: () => void;
}

export function BookingList({ bookings, onBack }: BookingListProps) {
  return (
    <div>
      <h1>Bookings</h1>
      <button type="button" onClick={onBack}>
        Back
      </button>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              <strong>{booking.restaurantName}</strong> — {booking.date}{" "}
              {booking.startTime} ({booking.partySize} people) —{" "}
              {booking.customerName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
