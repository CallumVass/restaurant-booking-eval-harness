export interface Restaurant {
  id: string;
  name: string;
  description: string;
  tables: Table[];
}

export interface Table {
  id: string;
  seats: number;
}

export interface TimeSlot {
  time: string;
  durationMinutes: number;
  tableId: string;
}

export interface CreateBookingRequest {
  tableId: string;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
}

export interface Booking {
  id: string;
  restaurantId: string;
  tableId: string;
  customerName: string;
  date: string;
  time: string;
  partySize: number;
}

export interface ApiError {
  code: string;
  message: string;
}
