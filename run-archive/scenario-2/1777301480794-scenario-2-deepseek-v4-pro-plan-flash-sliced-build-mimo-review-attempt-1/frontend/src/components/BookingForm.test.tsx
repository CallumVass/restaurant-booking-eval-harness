import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingForm } from "./BookingForm";
import { renderWithProviders } from "../test/test-utils";

const mockRestaurant = {
  id: "ember-table",
  name: "Ember Table",
  cuisine: "Wood-fired seasonal",
  neighborhood: "Riverside",
  description:
    "Open-flame cooking, warm lighting, and produce-led tasting plates.",
  tables: [
    { id: "ember-2a", capacity: 2 },
    { id: "ember-2b", capacity: 2 },
    { id: "ember-4", capacity: 4 },
    { id: "ember-6", capacity: 6 },
  ],
};

describe("BookingForm", () => {
  it("renders date and party size fields", () => {
    renderWithProviders(
      <BookingForm
        selectedRestaurant={mockRestaurant}
        effectiveRestaurantId="ember-table"
      />,
    );

    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Party size")).toBeInTheDocument();
    expect(screen.getByLabelText("Guest name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows restaurant name in heading when selected", () => {
    renderWithProviders(
      <BookingForm
        selectedRestaurant={mockRestaurant}
        effectiveRestaurantId="ember-table"
      />,
    );

    expect(screen.getByText("Book Ember Table")).toBeInTheDocument();
  });

  it("shows available times when restaurant is selected", async () => {
    renderWithProviders(
      <BookingForm
        selectedRestaurant={mockRestaurant}
        effectiveRestaurantId="ember-table"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("17:00")).toBeInTheDocument();
    });

    expect(screen.getByText("18:00")).toBeInTheDocument();
    expect(screen.getByText("19:00")).toBeInTheDocument();
  });

  it("shows disabled submit button when no restaurant selected", () => {
    renderWithProviders(
      <BookingForm selectedRestaurant={undefined} effectiveRestaurantId="" />,
    );

    expect(
      screen.getByRole("button", { name: /confirm booking/i }),
    ).toBeDisabled();
  });

  it("shows validation message when submitting without selecting time", async () => {
    renderWithProviders(
      <BookingForm
        selectedRestaurant={mockRestaurant}
        effectiveRestaurantId="ember-table"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("17:00")).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText("Guest name"), "Test User");
    await userEvent.type(screen.getByLabelText("Email"), "test@example.com");

    const submitButton = screen.getByRole("button", {
      name: /confirm booking/i,
    });
    await userEvent.click(submitButton);

    expect(
      screen.getByText("Choose an available seating time before booking."),
    ).toBeInTheDocument();
  });
});
