// pattern: Imperative Shell
import type {
  AvailabilitySlot,
  BookingConfirmation,
  BookingError,
  BookingRequest,
  RestaurantSummary,
} from "./types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5076";

export async function listRestaurants() {
  return request<RestaurantSummary[]>("/api/restaurants");
}

export async function listBookings() {
  return request<BookingConfirmation[]>("/api/bookings");
}

export async function listAvailability(
  restaurantId: string,
  date: string,
  partySize: number,
) {
  const query = new URLSearchParams({ date, partySize: String(partySize) });
  return request<AvailabilitySlot[]>(
    `/api/restaurants/${restaurantId}/availability?${query}`,
  );
}

export async function createBooking(booking: BookingRequest) {
  return request<BookingConfirmation>("/api/bookings", {
    body: JSON.stringify(booking),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, init);
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }

  return (await response.json()) as T;
}

async function errorMessage(response: Response) {
  try {
    const error = (await response.json()) as BookingError;
    return error.message || `Request failed with ${response.status}`;
  } catch {
    return `Request failed with ${response.status}`;
  }
}
