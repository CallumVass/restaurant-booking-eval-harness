import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { MyBookings } from "./MyBookings";
import { renderWithProviders } from "../test/test-utils";

describe("MyBookings", () => {
  it("shows booking history when authenticated", async () => {
    renderWithProviders(<MyBookings />);

    await waitFor(() => {
      expect(screen.getByText("My Bookings")).toBeInTheDocument();
    });

    await waitFor(() => {
      const bookingItem = screen.getByText("Ember Table");
      expect(bookingItem).toBeInTheDocument();
    });
  });

  it("shows heading and description", () => {
    renderWithProviders(<MyBookings />);

    expect(screen.getByText("My Bookings")).toBeInTheDocument();
    expect(
      screen.getByText("Your confirmed reservations across all restaurants."),
    ).toBeInTheDocument();
  });
});
