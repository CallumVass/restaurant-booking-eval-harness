import { useEffect, useState } from "react";
import type { Restaurant } from "../../api/types";
import { getRestaurants } from "../../api/client";

interface Props {
  onSelect: (restaurant: Restaurant) => void;
  selectedId?: string;
}

export function RestaurantList({ onSelect, selectedId }: Props) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRestaurants()
      .then(setRestaurants)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading restaurants...</p>;

  return (
    <div>
      <h2>Restaurants</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {restaurants.map((r) => (
          <li
            key={r.id}
            onClick={() => onSelect(r)}
            style={{
              padding: "12px",
              margin: "8px 0",
              border:
                r.id === selectedId ? "2px solid #2563eb" : "1px solid #e5e7eb",
              borderRadius: "8px",
              cursor: "pointer",
              background: r.id === selectedId ? "#eff6ff" : "#fff",
            }}
          >
            <strong>{r.name}</strong>
            <p style={{ margin: "4px 0 0", color: "#6b7280" }}>{r.address}</p>
            <p
              style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}
            >
              {r.tables.length} tables (max{" "}
              {Math.max(...r.tables.map((t) => t.capacity))} guests)
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
