import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { api, type TimeSlotDto, type ApiError } from '../api/client';
import { CalendarDays, Users, Mail, User, ArrowLeft } from 'lucide-react';

export function BookingPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();

  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurantId || '');
  const [date, setDate] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotDto | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: api.getRestaurants,
  });

  const { data: slots, isLoading: slotsLoading } = useQuery({
    queryKey: ['availability', selectedRestaurant, date, partySize],
    queryFn: () => api.getAvailability(selectedRestaurant, date, partySize),
    enabled: !!selectedRestaurant && !!date && partySize > 0,
  });

  const bookingMutation = useMutation({
    mutationFn: api.createBooking,
    onSuccess: (booking) => {
      toast.success('Booking confirmed!');
      navigate(`/confirmation/${booking.id}`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Booking failed');
    },
  });

  const handleSubmit = () => {
    if (!selectedRestaurant || !selectedSlot || !customerName || !customerEmail) return;

    const timeParts = selectedSlot.time.split(':');
    const dateObj = new Date(date);
    dateObj.setHours(Number(timeParts[0]), Number(timeParts[1]), 0, 0);

    bookingMutation.mutate({
      restaurantId: selectedRestaurant,
      tableId: selectedSlot.tableId,
      customerName,
      customerEmail,
      partySize,
      reservationTime: dateObj.toISOString(),
    });
  };

  const isValid =
    selectedRestaurant && date && partySize > 0 && selectedSlot && customerName && customerEmail;

  if (restaurantId && !restaurants?.find((r) => r.id === restaurantId)) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">Restaurant not found.</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium"
          >
            Back to Restaurants
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>

      <h1 className="text-2xl font-bold tracking-tight">Book a Table</h1>

      <Card>
        <CardHeader>
          <CardTitle>Reservation Details</CardTitle>
          <CardDescription>Select a restaurant, date, time, and party size.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!restaurantId && (
            <div className="space-y-2">
              <Label htmlFor="restaurant">Restaurant</Label>
              <select
                id="restaurant"
                value={selectedRestaurant}
                onChange={(e) => {
                  setSelectedRestaurant(e.target.value);
                  setSelectedSlot(null);
                }}
                className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select a restaurant...</option>
                {restaurants?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">
                <CalendarDays className="mr-1 inline size-3.5" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSelectedSlot(null);
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partySize">
                <Users className="mr-1 inline size-3.5" />
                Party Size
              </Label>
              <Input
                id="partySize"
                type="number"
                min={1}
                max={20}
                value={partySize}
                onChange={(e) => {
                  setPartySize(Number(e.target.value));
                  setSelectedSlot(null);
                }}
              />
            </div>
          </div>

          <Separator />

          {selectedRestaurant && date && partySize > 0 && (
            <div className="space-y-2">
              <Label>Available Times</Label>
              {slotsLoading ? (
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-9 w-24" />
                  ))}
                </div>
              ) : slots && slots.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <Button
                      key={`${slot.time}-${slot.tableId}`}
                      variant={
                        selectedSlot?.tableId === slot.tableId && selectedSlot?.time === slot.time
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No available time slots for this date and party size.
                </p>
              )}
            </div>
          )}

          {selectedSlot && (
            <Badge variant="secondary" className="text-xs">
              Table: {selectedSlot.tableLabel} (up to {selectedSlot.capacity} guests)
            </Badge>
          )}
        </CardContent>
      </Card>

      {selectedSlot && (
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Enter your details to complete the reservation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                <User className="mr-1 inline size-3.5" />
                Name
              </Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="mr-1 inline size-3.5" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <Button
              className="w-full"
              disabled={!isValid || bookingMutation.isPending}
              onClick={handleSubmit}
            >
              {bookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
