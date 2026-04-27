import { useNavigate } from 'react-router-dom';
import { useListRestaurants } from '../api/booking-api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export default function RestaurantList() {
  const { data: restaurants, isLoading, error } = useListRestaurants();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
              <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
              <div className="mt-6 h-3 w-1/4 animate-pulse rounded bg-neutral-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Failed to load restaurants. Is the backend running?</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">Find a Table</h1>
      <p className="mb-8 text-neutral-500">Choose from our curated selection of restaurants</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants?.map((r) => (
          <Card key={r.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>{r.name}</CardTitle>
                <Badge variant="secondary">{r.cuisine}</Badge>
              </div>
              <CardDescription>{r.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex gap-4 text-sm text-neutral-500">
                <span>{r.tableCount} tables</span>
                <span>
                  {r.minCapacity}–{r.maxCapacity} guests
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate(`/book?restaurantId=${r.id}`)}>
                Book a Table
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
