import { RestaurantDto, BookingDto, CreateBookingRequest } from "../types";

const API_BASE = "/api";

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export function getRestaurants(): Promise<RestaurantDto[]> {
  return getJson<RestaurantDto[]>(`${API_BASE}/restaurants`);
}

export function getAvailableSlots(
  restaurantId: string,
  date: string,
  partySize: number,
): Promise<string[]> {
  return getJson<string[]>(
    `${API_BASE}/restaurants/${restaurantId}/slots?date=${date}&partySize=${partySize}`,
  );
}

export function createBooking(
  request: CreateBookingRequest,
): Promise<BookingDto> {
  return postJson<BookingDto>(`${API_BASE}/bookings`, request);
}

export function getBookings(): Promise<BookingDto[]> {
  return getJson<BookingDto[]>(`${API_BASE}/bookings`);
}
