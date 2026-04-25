export interface RestaurantDto {
  id: string;
  name: string;
  openingTime: string;
  closingTime: string;
}

export interface BookingDto {
  id: string;
  restaurantId: string;
  restaurantName: string;
  date: string;
  startTime: string;
  endTime: string;
  partySize: number;
  customerName: string;
}

export interface CreateBookingRequest {
  restaurantId: string;
  date: string;
  startTime: string;
  partySize: number;
  customerName: string;
}
