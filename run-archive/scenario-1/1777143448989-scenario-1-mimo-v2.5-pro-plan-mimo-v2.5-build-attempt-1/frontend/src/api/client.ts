const API_BASE = "/api";

export interface Restaurant {
    id: string;
    name: string;
    address: string;
    maxPartySize: number;
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
}

export interface Booking {
    id: string;
    restaurantId: string;
    tableId: string;
    customerName: string;
    customerEmail: string;
    partySize: number;
    date: string;
    startTime: string;
    endTime: string;
}

export interface CreateBookingRequest {
    customerName: string;
    customerEmail: string;
    partySize: number;
    date: string;
    startTime: string;
}

export interface ErrorResponse {
    error: string;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${url}`, {
        headers: {
            "Content-Type": "application/json",
        },
        ...options,
    });

    if (!response.ok) {
        const error = (await response.json()) as ErrorResponse;
        throw new Error(error.error || `HTTP error ${response.status}`);
    }

    return response.json();
}

export const api = {
    restaurants: {
        list: () => fetchJson<Restaurant[]>("/restaurants"),
        get: (id: string) => fetchJson<Restaurant>(`/restaurants/${id}`),
        getAvailableSlots: (id: string, date: string, partySize: number) =>
            fetchJson<TimeSlot[]>(
                `/restaurants/${id}/available-slots?date=${date}&partySize=${partySize}`,
            ),
    },
    bookings: {
        list: (restaurantId: string, date?: string) => {
            const params = date ? `?filterDate=${date}` : "";
            return fetchJson<Booking[]>(
                `/restaurants/${restaurantId}/bookings${params}`,
            );
        },
        create: (restaurantId: string, request: CreateBookingRequest) =>
            fetchJson<Booking>(`/restaurants/${restaurantId}/bookings`, {
                method: "POST",
                body: JSON.stringify(request),
            }),
    },
};
