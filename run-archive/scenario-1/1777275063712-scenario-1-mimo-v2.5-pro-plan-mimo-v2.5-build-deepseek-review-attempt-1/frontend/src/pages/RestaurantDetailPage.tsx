import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getRestaurant, getAvailability, createBooking } from "@/api/endpoints";
import type { AvailableSlot } from "@/api/model";
import { bookingFormSchema, type BookingFormData } from "@/lib/validations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [partySize, setPartySize] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: "",
      partySize: 2,
      date: date,
      startTime: "",
      endTime: "",
      restaurantId: id ?? "",
    },
  });

  const { data: restaurant, isLoading: restaurantLoading } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const response = await getRestaurant(id!);
      return response.data;
    },
    enabled: !!id,
  });

  const { data: slotsResponse, isLoading: slotsLoading } = useQuery({
    queryKey: ["availability", id, date, partySize],
    queryFn: async () => {
      const response = await getAvailability(id!, { date, partySize });
      return response.data;
    },
    enabled: !!id && partySize > 0,
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const response = await createBooking(data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      toast.success("Booking confirmed!");
      reset();
      setShowBookingForm(false);
      setSelectedSlot(null);
      navigate(`/bookings/confirmation/${(data as { id?: string })?.id}`);
    },
    onError: () => {
      toast.error("Failed to create booking. Please try again.");
    },
  });

  const onSubmit = (data: BookingFormData) => {
    bookingMutation.mutate(data);
  };

  const handleSlotSelect = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
    setShowBookingForm(true);
    reset({
      customerName: "",
      partySize,
      date,
      startTime: slot.slot?.startTime ?? "",
      endTime: slot.slot?.endTime ?? "",
      restaurantId: id ?? "",
    });
  };

  if (restaurantLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Restaurant not found.</p>
      </div>
    );
  }

  const slots =
    (slotsResponse as { data?: AvailableSlot[] })?.data ??
    (Array.isArray(slotsResponse) ? (slotsResponse as AvailableSlot[]) : []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
        <p className="mt-2 text-gray-600">{restaurant.address}</p>
        <p className="text-sm text-gray-400">
          {restaurant.cuisineType} &middot; {restaurant.openingTime} -{" "}
          {restaurant.closingTime}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find Available Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="partySize">Party Size</Label>
              <select
                id="partySize"
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {slotsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : slots && slots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSlotSelect(slot)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedSlot === slot
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {slot.slot?.startTime} - {slot.slot?.endTime}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {slot.tableLocation} &middot; {slot.tableSeats} seats
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No available time slots for this date and party size.
            </p>
          )}
        </CardContent>
      </Card>

      {showBookingForm && selectedSlot && (
        <Card>
          <CardHeader>
            <CardTitle>Complete Your Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Selected:</span> {date} at{" "}
                {selectedSlot.slot?.startTime} - {selectedSlot.slot?.endTime}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Table:</span>{" "}
                {selectedSlot.tableLocation} ({selectedSlot.tableSeats} seats)
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Party Size:</span> {partySize}
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register("restaurantId")} />
              <input type="hidden" {...register("partySize")} />
              <input type="hidden" {...register("date")} />
              <input type="hidden" {...register("startTime")} />
              <input type="hidden" {...register("endTime")} />

              <div>
                <Label htmlFor="customerName">Your Name</Label>
                <Input
                  id="customerName"
                  {...register("customerName")}
                  placeholder="Enter your name"
                  className="mt-1"
                  aria-invalid={errors.customerName ? "true" : "false"}
                />
                {errors.customerName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.customerName.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={bookingMutation.isPending}>
                  {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowBookingForm(false);
                    setSelectedSlot(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
