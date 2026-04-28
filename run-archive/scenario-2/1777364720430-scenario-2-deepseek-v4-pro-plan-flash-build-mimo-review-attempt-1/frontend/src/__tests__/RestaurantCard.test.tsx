import { describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { RestaurantCard } from "../components/restaurant/RestaurantCard";
import type { Restaurant } from "../generated/booking-hooks";

afterEach(cleanup);

const restaurant: Restaurant = {
  id: "ember-table",
  name: "Ember Table",
  cuisine: "Wood-fired seasonal",
  neighborhood: "Riverside",
  description:
    "Open-flame cooking, warm lighting, and produce-led tasting plates.",
  tables: [
    { id: "t2", capacity: 2 },
    { id: "t4", capacity: 4 },
  ],
};

describe("RestaurantCard", () => {
  it("renders restaurant name, cuisine, and neighborhood", () => {
    render(
      <RestaurantCard
        restaurant={restaurant}
        active={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Ember Table")).toBeInTheDocument();
    expect(screen.getByText("Wood-fired seasonal")).toBeInTheDocument();
    expect(screen.getByText("Riverside")).toBeInTheDocument();
  });

  it("calls onSelect when select button is clicked", async () => {
    const onSelect = vi.fn();
    render(
      <RestaurantCard
        restaurant={restaurant}
        active={false}
        onSelect={onSelect}
      />,
    );

    await screen.getByText("Select restaurant").click();
    expect(onSelect).toHaveBeenCalledWith("ember-table");
  });

  it("shows Selected when active", () => {
    render(
      <RestaurantCard
        restaurant={restaurant}
        active={true}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Selected")).toBeInTheDocument();
  });

  it("shows max capacity from tables", () => {
    render(
      <RestaurantCard
        restaurant={restaurant}
        active={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText(/Up to 4/)).toBeInTheDocument();
  });
});
