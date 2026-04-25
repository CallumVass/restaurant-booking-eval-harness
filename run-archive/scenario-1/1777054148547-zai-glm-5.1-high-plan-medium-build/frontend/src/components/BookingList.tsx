import type { Booking } from "../types";

interface BookingListProps {
  bookings: Booking[];
}

export function BookingList({ bookings }: BookingListProps) {
  if (bookings.length === 0) {
    return <p>No bookings yet.</p>;
  }

  return (
    <div>
      <h2>Existing Bookings</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
              Name
            </th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
              Date
            </th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
              Time
            </th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
              Party Size
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                {b.customerName}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                {b.date}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                {b.time}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>
                {b.partySize}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
