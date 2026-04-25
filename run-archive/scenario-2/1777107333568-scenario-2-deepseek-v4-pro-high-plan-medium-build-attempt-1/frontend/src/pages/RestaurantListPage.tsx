import { useNavigate } from 'react-router-dom';
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function RestaurantListPage() {
  const { data, isPending, isError } = useGetApiRestaurants({
    query: { queryKey: getGetApiRestaurantsQueryKey() },
  });
  const navigate = useNavigate();

  if (isPending) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-destructive text-lg">Failed to load restaurants.</p>
        <p className="text-muted-foreground mt-2">
          Please ensure the backend is running.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Choose a Restaurant</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data?.data?.map((restaurant) => (
          <Card
            key={restaurant.id}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => navigate(`/book/${restaurant.id}`)}
          >
            <CardHeader>
              <CardTitle>{restaurant.name}</CardTitle>
              <CardDescription>
                Select a table and book your reservation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {restaurant.tableCapacities.map((cap, i) => (
                  <Badge key={i} variant="secondary">
                    {cap}p
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
