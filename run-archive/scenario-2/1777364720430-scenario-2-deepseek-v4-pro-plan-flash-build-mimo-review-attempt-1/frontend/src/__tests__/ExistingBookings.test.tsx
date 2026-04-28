import { describe, expect, it, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ExistingBookings } from "../components/booking/ExistingBookings";
import type { Booking } from "../generated/booking-hooks";

afterEach(cleanup);

describe("ExistingBookings", () => {
  const bookings: Booking[] = [
    {
      id: "b1",
      restaurantId: "ember-table",
      restaurantName: "Ember Table",
      tableId: "t2",
      partySize: 2,
      date: "2026-05-15",
      time: "17:00:00",
      guestName: "Alice",
      guestEmail: "alice@example.com",
    },
    {
      id: "b2",
      restaurantId: "ember-table",
      restaurantName: "Ember Table",
      tableId: "t4",
      partySize: 4,
      date: "2026-05-15",
      time: "19:00:00",
      guestName: "Bob",
      guestEmail: "bob@example.com",
    },
  ];

  it("renders booking list", () => {
    render(<ExistingBookings bookings={bookings} loading={false} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Table t2")).toBeInTheDocument();
    expect(screen.getByText("Table t4")).toBeInTheDocument();
  });

  it("shows empty state when no bookings", () => {
    render(<ExistingBookings bookings={[]} loading={false} />);

    expect(
      screen.getByText("No bookings yet. The first table is yours."),
    ).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<ExistingBookings bookings={[]} loading={true} />);

    expect(screen.getByText("Loading bookings...")).toBeInTheDocument();
  });
});
