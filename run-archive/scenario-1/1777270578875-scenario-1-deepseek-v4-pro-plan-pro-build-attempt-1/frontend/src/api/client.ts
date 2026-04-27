export interface RestaurantDto {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  tables: TableDto[];
  totalCapacity: number;
  tableCount: number;
}

export interface TableDto {
  id: string;
  capacity: number;
  label: string | null;
}

export interface BookingRequestDto {
  restaurantId: string;
  tableId: string;
  customerName: string;
  customerEmail: string;
  partySize: number;
  reservationTime: string;
  durationMinutes?: number;
}

export interface BookingDto {
  id: string;
  restaurantId: string;
  tableId: string;
  customerName: string;
  customerEmail: string;
  partySize: number;
  reservationTime: string;
  durationMinutes: number;
  endTime?: string;
}

export interface TimeSlotDto {
  time: string;
  tableId: string;
  tableLabel: string;
  capacity: number;
}

export interface ApiError {
  error: string;
  message: string;
}

const BASE_URL = 'http://localhost:5000';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown', message: 'Request failed' }));
    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  getRestaurants: () => request<RestaurantDto[]>('/api/restaurants'),

  getRestaurant: (id: string) => request<RestaurantDto>(`/api/restaurants/${id}`),

  getAvailability: (id: string, date: string, partySize: number) =>
    request<TimeSlotDto[]>(
      `/api/restaurants/${id}/availability?date=${date}&partySize=${partySize}`,
    ),

  createBooking: (booking: BookingRequestDto) =>
    request<BookingDto>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    }),

  getBookings: () => request<BookingDto[]>('/api/bookings'),

  getBooking: (id: string) => request<BookingDto>(`/api/bookings/${id}`),
};
