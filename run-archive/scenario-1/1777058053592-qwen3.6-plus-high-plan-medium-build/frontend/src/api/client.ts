import type { Restaurant, Booking, BookingRequest, TimeSlot } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:5000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export async function getRestaurants(): Promise<Restaurant[]> {
  return request<Restaurant[]>("/api/restaurants");
}

export async function getAvailableSlots(
  restaurantId: string,
  date: string,
  partySize: number,
): Promise<TimeSlot[]> {
  return request<TimeSlot[]>(
    `/api/restaurants/${restaurantId}/slots?date=${date}&partySize=${partySize}`,
  );
}

export async function createBooking(req: BookingRequest): Promise<Booking> {
  return request<Booking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getBookings(): Promise<Booking[]> {
  return request<Booking[]>("/api/bookings");
}
