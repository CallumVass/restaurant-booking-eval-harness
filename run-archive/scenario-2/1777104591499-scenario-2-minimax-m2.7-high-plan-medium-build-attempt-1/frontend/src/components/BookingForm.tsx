import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { useAvailability, useCreateBooking } from "@/api/hooks";
import type { RestaurantDto, TimeSlotDto } from "@/api/model";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Calendar, Users, ArrowLeft, Loader2, Clock } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

const bookingSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  partySize: z.number().min(1, "Party size must be at least 1"),
  date: z.string().min(1, "Please select a date"),
  startTime: z.string().min(1, "Please select a time slot"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  restaurantId: string;
  restaurants: RestaurantDto[];
  onSuccess: (
    bookingId: string,
    restaurantName: string,
    dateTime: string,
    partySize: number,
  ) => void;
  onCancel: () => void;
}

export function BookingForm({
  restaurantId,
  restaurants,
  onSuccess,
  onCancel,
}: BookingFormProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const restaurant = restaurants.find((r) => r.id === restaurantId);
  const restaurantName = restaurant?.name ?? "Unknown Restaurant";
  const restaurantAddress = restaurant?.address ?? "";

  const tomorrow = format(new Date(Date.now() + 86400000), "yyyy-MM-dd");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      partySize: 2,
      date: tomorrow,
    },
  });

  const partySize = watch("partySize");
  const date = watch("date");

  const { data: availability, isLoading: isLoadingSlots } = useAvailability(
    restaurantId,
    {
      date: date || tomorrow,
      partySize: partySize || 2,
    },
  );

  const createBookingMutation = useCreateBooking();

  const onSubmit = async (formData: BookingFormData) => {
    if (!selectedSlot) return;

    const startTime = new Date(`${formData.date}T${selectedSlot}`);

    await createBookingMutation.mutateAsync({
      restaurantId,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      partySize: formData.partySize,
      startTime: startTime.toISOString(),
    });

    onSuccess(
      "pending",
      restaurantName,
      format(startTime, "MMM d, yyyy h:mm a"),
      formData.partySize,
    );
  };

  const timeSlots: TimeSlotDto[] = availability ?? [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Book at {restaurantName}</h2>
          <p className="text-slate-500">{restaurantAddress}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Date & Party Size</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                min={tomorrow}
                {...register("date")}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && (
                <p className="text-xs text-red-500">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="partySize">
                <Users className="w-4 h-4 inline mr-1" />
                Party Size
              </Label>
              <select
                {...register("partySize", { valueAsNumber: true })}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${errors.partySize ? "border-red-500" : ""}`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
              {errors.partySize && (
                <p className="text-xs text-red-500">
                  {errors.partySize.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <Clock className="w-5 h-5 inline mr-2" />
            Available Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingSlots ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No available slots for this date and party size.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((slot) => {
                const start = slot.start ?? "";
                const slotTime = format(new Date(start), "HH:mm");
                const displayTime = format(new Date(start), "h:mm a");
                return (
                  <button
                    key={slotTime}
                    onClick={() => setSelectedSlot(slotTime)}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-all",
                      selectedSlot === slotTime
                        ? "border-violet-500 bg-violet-50 text-violet-700 font-medium"
                        : "hover:border-violet-300 hover:bg-slate-50",
                    )}
                  >
                    {displayTime}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSlot && (
        <Card>
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name</Label>
                <Input
                  id="customerName"
                  placeholder="John Doe"
                  {...register("customerName")}
                  className={errors.customerName ? "border-red-500" : ""}
                />
                {errors.customerName && (
                  <p className="text-xs text-red-500">
                    {errors.customerName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    placeholder="john@example.com"
                    {...register("customerEmail")}
                    className={errors.customerEmail ? "border-red-500" : ""}
                  />
                  {errors.customerEmail && (
                    <p className="text-xs text-red-500">
                      {errors.customerEmail.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    {...register("customerPhone")}
                    className={errors.customerPhone ? "border-red-500" : ""}
                  />
                  {errors.customerPhone && (
                    <p className="text-xs text-red-500">
                      {errors.customerPhone.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={createBookingMutation.isPending}
              >
                {createBookingMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Booking...
                  </>
                ) : (
                  <>
                    Confirm Booking for{" "}
                    {format(
                      new Date(`${date}T${selectedSlot}`),
                      "MMM d, h:mm a",
                    )}
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
