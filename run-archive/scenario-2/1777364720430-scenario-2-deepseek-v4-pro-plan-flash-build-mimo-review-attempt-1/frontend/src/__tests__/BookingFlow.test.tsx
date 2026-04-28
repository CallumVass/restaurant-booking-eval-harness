import { describe, expect, it, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ConfirmationCard } from "../components/booking/ConfirmationCard";
import type { Booking } from "../generated/booking-hooks";

afterEach(cleanup);

describe("BookingFlow", () => {
  const booking: Booking = {
    id: "b1",
    restaurantId: "ember-table",
    restaurantName: "Ember Table",
    tableId: "t2",
    partySize: 2,
    date: "2026-05-15",
    time: "17:00:00",
    guestName: "Alice",
    guestEmail: "alice@example.com",
  };

  describe("ConfirmationCard", () => {
    it("renders booking confirmation with guest name and restaurant", () => {
      render(<ConfirmationCard booking={booking} />);

      expect(screen.getByText(/Booking confirmed/)).toBeInTheDocument();
      expect(screen.getByText(/Alice/)).toBeInTheDocument();
      expect(screen.getByText(/Ember Table/)).toBeInTheDocument();
      expect(screen.getByText(/17:00/)).toBeInTheDocument();
      expect(screen.getByText(/2026-05-15/)).toBeInTheDocument();
    });
  });
});
