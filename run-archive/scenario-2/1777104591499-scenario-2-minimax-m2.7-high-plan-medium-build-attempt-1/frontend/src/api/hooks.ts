import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getRestaurants,
  getBookings,
  getAvailability,
  createBooking,
} from "./client";
import type {
  RestaurantDto,
  BookingDto,
  CreateBookingRequest,
  GetAvailabilityParams,
  GetBookingsParams,
} from "./model";

export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const response = await getRestaurants();
      return response.data as RestaurantDto[];
    },
  });
}

export function useBookings(params?: GetBookingsParams) {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: async () => {
      const response = await getBookings(params);
      return response.data as BookingDto[];
    },
  });
}

export function useAvailability(
  restaurantId: string,
  params: GetAvailabilityParams,
) {
  return useQuery({
    queryKey: ["availability", restaurantId, params],
    queryFn: async () => {
      const response = await getAvailability(restaurantId, params);
      return response.data;
    },
    enabled: !!restaurantId && !!params.date && params.partySize > 0,
  });
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (data: CreateBookingRequest) => {
      const response = await createBooking(data);
      return response.data as BookingDto;
    },
  });
}
