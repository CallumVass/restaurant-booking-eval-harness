import type {
  Restaurant,
  TimeSlot,
  Booking,
  CreateBookingRequest,
  ApiError,
} from "../types";

const BASE_URL = "/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      code: "Unknown",
      message: response.statusText,
    }));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }
  return response.json();
}

export async function fetchRestaurants(): Promise<Restaurant[]> {
  const response = await fetch(`${BASE_URL}/restaurants`);
  return handleResponse<Restaurant[]>(response);
}

export async function fetchAvailableSlots(
  restaurantId: string,
  date: string,
  partySize: number,
): Promise<TimeSlot[]> {
  const response = await fetch(
    `${BASE_URL}/restaurants/${restaurantId}/slot?date=${date}&partySize=${partySize}`,
  );
  return handleResponse<TimeSlot[]>(response);
}

export async function createBooking(
  restaurantId: string,
  request: CreateBookingRequest,
): Promise<Booking> {
  const response = await fetch(
    `${BASE_URL}/restaurants/${restaurantId}/bookings`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    },
  );
  return handleResponse<Booking>(response);
}

export async function fetchBookings(restaurantId: string): Promise<Booking[]> {
  const response = await fetch(
    `${BASE_URL}/restaurants/${restaurantId}/bookings`,
  );
  return handleResponse<Booking[]>(response);
}
