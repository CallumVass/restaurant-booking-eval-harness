import { describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { SlotPicker } from "../components/booking/SlotPicker";
import type { AvailabilitySlot } from "../generated/booking-hooks";

afterEach(cleanup);

describe("SlotPicker", () => {
  const slots: AvailabilitySlot[] = [
    { time: "17:00:00", availableTableCount: 2 },
    { time: "18:00:00", availableTableCount: 1 },
    { time: "19:00:00", availableTableCount: 0 },
  ];

  it("renders available time slots", () => {
    render(
      <SlotPicker
        slots={slots}
        selectedTime=""
        loading={false}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("17:00")).toBeInTheDocument();
    expect(screen.getByText("18:00")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(
      <SlotPicker
        slots={[]}
        selectedTime=""
        loading={true}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Checking available tables..."),
    ).toBeInTheDocument();
  });

  it("shows error state", () => {
    render(
      <SlotPicker
        slots={[]}
        selectedTime=""
        loading={false}
        error="Failed to load availability"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Failed to load availability")).toBeInTheDocument();
  });

  it("shows empty state when no slots available", () => {
    render(
      <SlotPicker
        slots={[]}
        selectedTime=""
        loading={false}
        onSelect={vi.fn()}
      />,
    );

    expect(
      screen.getByText("No matching slots for this date and party size."),
    ).toBeInTheDocument();
  });

  it("handles time selection", async () => {
    const onSelect = vi.fn();
    render(
      <SlotPicker
        slots={slots}
        selectedTime=""
        loading={false}
        onSelect={onSelect}
      />,
    );

    await screen.getByText("17:00").click();
    expect(onSelect).toHaveBeenCalledWith("17:00:00");
  });
});
