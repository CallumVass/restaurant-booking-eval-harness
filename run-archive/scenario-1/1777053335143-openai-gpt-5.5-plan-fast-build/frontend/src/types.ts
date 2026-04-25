export interface RestaurantSummary {
  id: string;
  name: string;
  description: string;
  minPartySize: number;
  maxPartySize: number;
}

export interface BookingRequest {
  restaurantId: string;
  guestName: string;
  partySize: number;
  startsAt: string;
}

export interface BookingConfirmation extends BookingRequest {
  id: string;
  tableId: string;
  endsAt: string;
}

export interface AvailabilitySlot {
  startsAt: string;
  endsAt: string;
  availableTableCount: number;
}

export interface BookingError {
  code: string;
  message: string;
}
