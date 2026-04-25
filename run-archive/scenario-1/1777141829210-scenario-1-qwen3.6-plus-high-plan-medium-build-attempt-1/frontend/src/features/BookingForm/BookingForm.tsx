import { useState } from 'react';
import {
  useGetRestaurants,
  useGetAvailableSlots,
  useCreateBooking,
  getGetBookingsQueryKey,
} from '@/api/generated';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, Clock, Users, Mail, User } from 'lucide-react';

interface BookingFormProps {
  onBookingComplete: (booking: {
    id: string;
    restaurantName: string;
    guestName: string;
    partySize: number;
    dateTime: string;
  }) => void;
}

export function BookingForm({ onBookingComplete }: BookingFormProps) {
  const queryClient = useQueryClient();
  const [restaurantId, setRestaurantId] = useState('');
  const [date, setDate] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const { data: restaurants } = useGetRestaurants();
  const { data: slots, isLoading: slotsLoading } = useGetAvailableSlots(
    restaurantId,
    { date, partySize: Number(partySize) },
    { query: { enabled: !!restaurantId && !!date && !!partySize } },
  );
  const createBooking = useCreateBooking({
    mutation: {
      onSuccess: (response) => {
        const bookingData = response?.headers?.get('location')?.split('/').pop() ?? '';
        const restaurant = restaurants?.data?.find((r) => r.id === restaurantId);
        toast.success('Booking confirmed!');
        queryClient.invalidateQueries({ queryKey: getGetBookingsQueryKey() });
        onBookingComplete({
          id: bookingData,
          restaurantName: restaurant?.name ?? '',
          guestName,
          partySize: Number(partySize),
          dateTime: selectedSlot,
        });
      },
      onError: (error: { error?: string }) => {
        toast.error(error?.error ?? 'Failed to create booking');
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId || !selectedSlot || !guestName || !guestEmail) {
      toast.error('Please fill in all fields');
      return;
    }
    createBooking.mutate({
      data: {
        restaurantId,
        guestName,
        guestEmail,
        partySize: Number(partySize),
        dateTime: selectedSlot,
      },
    });
  };

  const restaurantList = restaurants?.data ?? [];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-amber-900 sm:text-4xl">
          Reserve Your Table
        </h1>
        <p className="mt-2 text-muted-foreground">
          Select a restaurant, date, and time to book your dining experience
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-amber-600" />
              Booking Details
            </CardTitle>
            <CardDescription>Choose your preferred restaurant and time slot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="restaurant" className="flex items-center gap-2">
                <Users className="size-4" />
                Restaurant
              </Label>
              <Select
                value={restaurantId}
                onValueChange={(v) => {
                  if (v) {
                    setRestaurantId(v);
                    setSelectedSlot('');
                  }
                }}
              >
                <SelectTrigger id="restaurant">
                  <SelectValue placeholder="Select a restaurant" />
                </SelectTrigger>
                <SelectContent>
                  {restaurantList.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name} — {r.cuisine}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setSelectedSlot('');
                  }}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partySize" className="flex items-center gap-2">
                  <Users className="size-4" />
                  Party Size
                </Label>
                <Select
                  value={partySize}
                  onValueChange={(v) => {
                    if (v) {
                      setPartySize(v);
                      setSelectedSlot('');
                    }
                  }}
                >
                  <SelectTrigger id="partySize">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? 'guest' : 'guests'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {slotsLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4 animate-spin" />
                Loading available slots...
              </div>
            )}

            {slots?.data && slots.data.length > 0 && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="size-4" />
                  Available Time Slots
                </Label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.data.map((slot) => (
                    <Button
                      key={slot.time}
                      type="button"
                      variant={selectedSlot === slot.time ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => setSelectedSlot(slot.time)}
                    >
                      {new Date(slot.time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {slots?.data && slots.data.length === 0 && restaurantId && date && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800">
                No available slots for the selected date and party size.
              </div>
            )}

            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="guestName" className="flex items-center gap-2">
                  <User className="size-4" />
                  Your Name
                </Label>
                <Input
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guestEmail" className="flex items-center gap-2">
                  <Mail className="size-4" />
                  Email
                </Label>
                <Input
                  id="guestEmail"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={createBooking.isPending || !selectedSlot}
            >
              {createBooking.isPending ? 'Confirming...' : 'Confirm Booking'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
