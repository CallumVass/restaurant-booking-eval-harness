import { z } from "zod";

export const bookingFormSchema = z.object({
  customerName: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  partySize: z
    .number()
    .min(1, "Party size must be at least 1")
    .max(8, "Party size cannot exceed 8"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  restaurantId: z.string().min(1, "Restaurant ID is required"),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;
