import { useForm } from 'react-hook-form';
import {
  useGetApiBookings,
  getGetApiBookingsQueryKey,
} from '@/api/bookings/bookings';
import {
  useGetApiRestaurants,
  getGetApiRestaurantsQueryKey,
} from '@/api/restaurants/restaurants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

type FilterValues = {
  restaurantId: string;
  date: string;
};

export function BookingsPage() {
  const { register, watch } = useForm<FilterValues>({
    defaultValues: { restaurantId: '', date: '' },
  });

  const restaurantId = watch('restaurantId');
  const date = watch('date');

  const { data: restaurantsData } = useGetApiRestaurants({
    query: { queryKey: getGetApiRestaurantsQueryKey() },
  });

  const {
    data: bookingsData,
    isPending,
    isError,
  } = useGetApiBookings(
    {
      restaurantId: restaurantId ? Number(restaurantId) : undefined,
      date: date || undefined,
    },
    {
      query: {
        queryKey: getGetApiBookingsQueryKey({
          restaurantId: restaurantId ? Number(restaurantId) : undefined,
          date: date || undefined,
        }),
        enabled: true,
      },
    },
  );

  const bookings = bookingsData?.data ?? [];

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Existing Bookings</CardTitle>
          <CardDescription>
            Filter by restaurant and date to view bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="restaurantId">Restaurant</Label>
              <select
                id="restaurantId"
                {...register('restaurantId')}
                className="border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
              >
                <option value="">All Restaurants</option>
                {restaurantsData?.data?.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register('date')} />
            </div>
          </div>

          <Separator className="mb-6" />

          {isPending ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : isError ? (
            <p className="text-destructive">Failed to load bookings.</p>
          ) : bookings.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              {restaurantId || date
                ? 'No bookings match your filters.'
                : 'Select a restaurant or date to view bookings.'}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {booking.customerName}
                      </span>
                      <Badge variant="secondary">
                        {String(booking.partySize)} guests
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {format(
                        new Date(booking.date + 'T00:00:00'),
                        'MMM d, yyyy',
                      )}{' '}
                      at {booking.startTime.slice(0, 5)} -{' '}
                      {booking.endTime.slice(0, 5)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Table #{booking.tableId}
                    </p>
                  </div>
                  <span className="text-muted-foreground font-mono text-xs">
                    {booking.id}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
