import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { api, type RestaurantDto } from '../api/client';
import { Users, Table2 } from 'lucide-react';

export function RestaurantsPage() {
  const { data: restaurants, isLoading } = useQuery({
    queryKey: ['restaurants'],
    queryFn: api.getRestaurants,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Restaurants</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants?.map((r: RestaurantDto) => (
          <Card key={r.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle>{r.name}</CardTitle>
                  <CardDescription className="mt-1">{r.address}</CardDescription>
                </div>
                <Badge variant="secondary">{r.cuisine}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Table2 className="size-4" />
                  {r.tableCount} tables
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-4" />
                  {r.totalCapacity} capacity
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Link
                to={`/book/${r.id}`}
                className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Book a Table
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
