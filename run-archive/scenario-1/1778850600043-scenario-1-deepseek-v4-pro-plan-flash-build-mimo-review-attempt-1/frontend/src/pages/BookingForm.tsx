import { useState, useCallback } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetRestaurantById } from "@/api/generated/restaurants/restaurants";
import { useGetAvailableSlots } from "@/api/generated/slots/slots";
import { useCreateBooking } from "@/api/generated/bookings/bookings";
import type { CreateBookingRequest } from "@/api/generated/schemas/createBookingRequest";
import type { AvailableSlotResponse } from "@/api/generated/schemas/availableSlotResponse";
import type { RestaurantResponse } from "@/api/generated/schemas/restaurantResponse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, Clock, Loader2, Users } from "lucide-react";

const DATE_BOUNDS = (() => {
  const now = Date.now();
  return {
    min: new Date().toISOString().split("T")[0],
    max: new Date(now + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  };
})();

export default function BookingForm() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();

  const { data: restaurantResp, isLoading: restaurantLoading } = useGetRestaurantById(restaurantId!);

  const [date, setDate] = useState(DATE_BOUNDS.min);
  const [partySize, setPartySize] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const { data: slotsResp, isLoading: slotsLoading } = useGetAvailableSlots(
    restaurantId!,
    { date, partySize },
    { query: { enabled: !!restaurantId && !!date && partySize > 0 } },
  );

  const createMutation = useCreateBooking({
    mutation: {
      onSuccess: (res) => {
        if (res.status === 201) {
          navigate("/confirmation", { state: { booking: res.data } });
        } else {
          const err = res.data as unknown as { code: string; message: string };
          toast.error(err.message || "Booking failed");
        }
      },
      onError: () => {
        toast.error("Network error. Please try again.");
      },
    },
  });

  const restaurant: RestaurantResponse | undefined = restaurantResp?.status === 200 ? restaurantResp.data : undefined;

  const slots: AvailableSlotResponse[] = slotsResp?.status === 200 ? slotsResp.data : [];

  const handleSubmit = useCallback(() => {
    if (!selectedSlot || !restaurantId || !name || !email) return;

    const body: CreateBookingRequest = {
      restaurantId,
      date,
      startTime: selectedSlot,
      partySize,
      customerName: name,
      customerEmail: email,
      notes: notes || null,
    };

    createMutation.mutate({ data: body });
  }, [selectedSlot, restaurantId, date, partySize, name, email, notes, createMutation]);

  if (restaurantLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center py-16 gap-4">
        <AlertCircle className="size-12 text-destructive" />
        <p className="text-muted-foreground">Restaurant not found</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Back to Restaurants
        </Button>
      </div>
    );
  }

  const isSubmitting = createMutation.isPending;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-2">
          <ArrowLeft className="size-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold">{restaurant.name}</h1>
        <p className="text-muted-foreground">{restaurant.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date & Party Size */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                min={DATE_BOUNDS.min}
                max={DATE_BOUNDS.max}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setDate(e.target.value);
                  setSelectedSlot(null);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partySize">Party Size</Label>
              <Input
                id="partySize"
                type="number"
                min={1}
                max={20}
                value={partySize}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setPartySize(Number(e.target.value));
                  setSelectedSlot(null);
                }}
              />
            </div>
          </div>

          <Separator />

          {/* Available Slots */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <Label>Available Time Slots</Label>
            </div>

            {slotsLoading ? (
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-9 w-24" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <p className="text-sm text-muted-foreground">No available slots for this date and party size.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => {
                  const timeStr = slot.startTime.slice(0, 5);
                  const isSelected = selectedSlot === slot.startTime;
                  return (
                    <Button
                      key={slot.startTime}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSlot(slot.startTime)}
                    >
                      <Clock className="size-3" />
                      {timeStr}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Customer Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              <Label>Your Information</Label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
                placeholder="Any special requests?"
              />
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            disabled={!selectedSlot || !name || !email || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
