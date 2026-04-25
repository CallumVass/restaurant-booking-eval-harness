import { useCallback, useEffect, useState } from "react";
import type { Booking } from "../../api/types";
import { getBookings } from "../../api/client";

export function ExistingBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    getBookings()
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    getBookings()
      .then((data) => {
        if (!cancelled) {
          setBookings(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Existing Bookings</h2>
        <button
          onClick={refresh}
          style={{ padding: "6px 12px", cursor: "pointer" }}
        >
          Refresh
        </button>
      </div>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
              <th style={{ textAlign: "left", padding: "8px" }}>Guest</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Party</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Start</th>
              <th style={{ textAlign: "left", padding: "8px" }}>End</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "8px" }}>{b.guestName}</td>
                <td style={{ padding: "8px" }}>{b.partySize}</td>
                <td style={{ padding: "8px" }}>
                  {new Date(b.startTime).toLocaleString()}
                </td>
                <td style={{ padding: "8px" }}>
                  {new Date(b.endTime).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
