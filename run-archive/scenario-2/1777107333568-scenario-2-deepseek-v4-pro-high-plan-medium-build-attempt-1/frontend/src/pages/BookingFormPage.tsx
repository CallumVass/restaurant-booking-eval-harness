import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import {
  useGetApiTimeslots,
  getGetApiTimeslotsQueryKey,
} from '@/api/bookings/bookings';
import { usePostApiBookings } from '@/api/bookings/bookings';
import {
  useGetApiRestaurants,
  getGetApiRestaurantsQueryKey,
} from '@/api/restaurants/restaurants';
import type { BookingRequest, TimeSlot } from '@/api/model';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

type FormValues = {
  customerName: string;
  customerEmail: string;
  partySize: number;
  date: string;
  startTime: string;
};

export function BookingFormPage() {
  const { restaurantId: rid } = useParams<{ restaurantId: string }>();
  const restaurantId = Number(rid);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      customerName: '',
      customerEmail: '',
      partySize: 2,
      date: '',
      startTime: '',
    },
  });

  const date = watch('date');
  const partySize = watch('partySize');

  const { data: restaurantsData } = useGetApiRestaurants({
    query: { queryKey: getGetApiRestaurantsQueryKey() },
  });
  const restaurant = restaurantsData?.data?.find((r) => r.id === restaurantId);

  const { data: slotsData, isPending: slotsLoading } = useGetApiTimeslots(
    {
      restaurantId,
      date: date || '',
      partySize,
    },
    {
      query: {
        queryKey: getGetApiTimeslotsQueryKey({
          restaurantId,
          date: date || '',
          partySize,
        }),
        enabled: !!date && partySize > 0,
      },
    },
  );

  const bookingMutation = usePostApiBookings();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    if (!selectedSlot) return;

    const request: BookingRequest = {
      restaurantId,
      customerName: values.customerName,
      customerEmail: values.customerEmail,
      partySize: Number(values.partySize),
      date: values.date,
      startTime: selectedSlot,
    };

    bookingMutation.mutate(
      { data: request },
      {
        onSuccess: (result) => {
          queryClient.invalidateQueries({
            queryKey: getGetApiRestaurantsQueryKey(),
          });
          navigate(
            `/confirmation?booking=${encodeURIComponent(JSON.stringify(result.data))}`,
          );
        },
        onError: () => {
          toast.error(
            'Failed to create booking. Please check availability and try again.',
          );
        },
      },
    );
  };

  if (!restaurant) {
    return (
      <div className="py-16 text-center">
        <Skeleton className="mx-auto h-8 w-64" />
      </div>
    );
  }

  const slots: TimeSlot[] =
    slotsData && Array.isArray(slotsData.data) ? slotsData.data : [];
  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Book at {restaurant.name}</CardTitle>
          <CardDescription>
            Fill in your details and pick an available time slot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="customerName">Name</Label>
                <Input
                  id="customerName"
                  {...register('customerName', {
                    required: 'Name is required',
                  })}
                  placeholder="Your name"
                />
                {errors.customerName && (
                  <p className="text-destructive text-sm">
                    {errors.customerName.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  {...register('customerEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email',
                    },
                  })}
                  placeholder="you@example.com"
                />
                {errors.customerEmail && (
                  <p className="text-destructive text-sm">
                    {errors.customerEmail.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  min={today}
                  {...register('date', { required: 'Date is required' })}
                />
                {errors.date && (
                  <p className="text-destructive text-sm">
                    {errors.date.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="partySize">Party Size</Label>
                <Input
                  id="partySize"
                  type="number"
                  min={1}
                  max={8}
                  {...register('partySize', {
                    required: 'Party size is required',
                    min: { value: 1, message: 'Minimum 1 guest' },
                    max: { value: 8, message: 'Maximum 8 guests' },
                    valueAsNumber: true,
                  })}
                />
                {errors.partySize && (
                  <p className="text-destructive text-sm">
                    {errors.partySize.message}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <Label className="mb-3 block">Available Time Slots</Label>
              {!date ? (
                <p className="text-muted-foreground text-sm">
                  Select a date to see available slots.
                </p>
              ) : slotsLoading ? (
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              ) : slots.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No time slots available for this date and party size.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <Badge
                      key={slot.startTime}
                      variant={
                        selectedSlot === slot.startTime ? 'default' : 'outline'
                      }
                      className="cursor-pointer px-3 py-2 text-sm"
                      onClick={() => setSelectedSlot(slot.startTime)}
                    >
                      {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={!selectedSlot || bookingMutation.isPending}
              className="w-full"
            >
              {bookingMutation.isPending ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
