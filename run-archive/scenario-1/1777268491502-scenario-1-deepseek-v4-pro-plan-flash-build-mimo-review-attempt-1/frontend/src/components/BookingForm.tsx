import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useListRestaurants, useGetAvailability, useCreateBooking } from '../api/booking-api';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { format, addDays } from 'date-fns';

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 11; h <= 21; h++) {
    for (let m = 0; m < 60; m += 30) {
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`);
    }
  }
  return slots;
}

export default function BookingForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [restaurantId, setRestaurantId] = useState(searchParams.get('restaurantId') ?? '');
  const [date, setDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [time, setTime] = useState('12:00:00');
  const [partySize, setPartySize] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const { data: restaurants } = useListRestaurants();
  const { data: availability, isLoading: loadingSlots } = useGetAvailability(
    restaurantId,
    { date, partySize },
    { query: { enabled: !!restaurantId && !!date && partySize > 0 } },
  );

  const mutation = useCreateBooking({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
        navigate(`/book/confirm?bookingId=${data.id}`);
      },
      onError: (err: unknown) => {
        const msg =
          err && typeof err === 'object' && 'message' in err
            ? (err as { message: string }).message
            : 'Failed to create booking';
        toast.error(msg);
      },
    },
  });

  const availableTimes = availability?.slots?.filter((s) => s.available).map((s) => s.time) ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId || !date || !time || !guestName || !guestEmail) {
      toast.error('Please fill in all fields');
      return;
    }
    mutation.mutate({
      data: {
        restaurantId,
        date,
        time,
        partySize,
        guestName,
        guestEmail,
      },
    });
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-2 text-2xl font-bold tracking-tight">Book a Table</h1>
      <p className="mb-8 text-neutral-500">Fill in the details to reserve your table</p>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Reservation Details</CardTitle>
            <CardDescription>Choose your restaurant, date, and party size</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="restaurant">Restaurant</Label>
              <Select
                id="restaurant"
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                required
              >
                <option value="">Select a restaurant</option>
                {restaurants?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.cuisine})
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="partySize">Party Size</Label>
              <Input
                id="partySize"
                type="number"
                min={1}
                max={20}
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="time">Time</Label>
              {loadingSlots ? (
                <div className="h-10 animate-pulse rounded border border-neutral-200 bg-neutral-100" />
              ) : (
                <Select id="time" value={time} onChange={(e) => setTime(e.target.value)} required>
                  <option value="">Select a time</option>
                  {generateTimeSlots().map((t) => {
                    const isAvailable = availableTimes.includes(t);
                    const h = Number(t.split(':')[0]);
                    const m = t.split(':')[1];
                    const label = `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
                    return (
                      <option key={t} value={t} disabled={!isAvailable}>
                        {label} {isAvailable ? '' : '(unavailable)'}
                      </option>
                    );
                  })}
                </Select>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="guestName">Name</Label>
              <Input
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="guestEmail">Email</Label>
              <Input
                id="guestEmail"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>

            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
