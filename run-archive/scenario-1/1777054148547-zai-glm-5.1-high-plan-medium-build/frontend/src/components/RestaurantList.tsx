import type { Restaurant } from "../types";

interface RestaurantListProps {
  restaurants: Restaurant[];
  onSelect: (restaurant: Restaurant) => void;
  selectedId: string | null;
}

export function RestaurantList({
  restaurants,
  onSelect,
  selectedId,
}: RestaurantListProps) {
  return (
    <div>
      <h2>Restaurants</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {restaurants.map((r) => (
          <div
            key={r.id}
            onClick={() => onSelect(r)}
            style={{
              border:
                r.id === selectedId ? "2px solid #0066cc" : "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
              minWidth: "200px",
              background: r.id === selectedId ? "#e6f0ff" : "#fff",
            }}
          >
            <h3>{r.name}</h3>
            <p>{r.description}</p>
            <p style={{ fontSize: "0.85rem", color: "#666" }}>
              Tables: {r.tables.map((t) => `${t.seats}-seat`).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
