export interface Restaurant {
  id: string;
  name: string;
  address: string;
  tables: Table[];
}

interface Table {
  id: string;
  restaurantId: string;
  capacity: number;
}

export interface Booking {
  id: string;
  restaurantId: string;
  tableId: string;
  guestName: string;
  email: string;
  partySize: number;
  startTime: string;
  endTime: string;
}

export interface BookingRequest {
  restaurantId: string;
  guestName: string;
  email: string;
  partySize: number;
  startTime: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
}
