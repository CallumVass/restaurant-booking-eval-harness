import { useGetRestaurants } from '@/api/generated';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Star } from 'lucide-react';

interface RestaurantListProps {
  onSelectRestaurant: () => void;
}

const cuisineIcons: Record<string, string> = {
  French: '🥐',
  Japanese: '🍣',
  Italian: '🍝',
};

export function RestaurantList({ onSelectRestaurant }: RestaurantListProps) {
  const { data, isLoading, error } = useGetRestaurants();

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-600">Failed to load restaurants. Please try again.</p>
      </div>
    );
  }

  const restaurants = data?.data ?? [];

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-amber-900 sm:text-4xl">
          Discover Restaurants
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find your perfect dining experience and reserve your table
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
          <Card
            key={restaurant.id}
            className="group transition-all hover:shadow-lg hover:shadow-amber-100"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                <span className="text-2xl">{cuisineIcons[restaurant.cuisine] ?? '🍽️'}</span>
              </div>
              <CardDescription className="line-clamp-2">{restaurant.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="secondary">{restaurant.cuisine}</Badge>
                <Badge variant="outline" className="gap-1">
                  <Users className="size-3" />
                  Up to {restaurant.maxCapacity}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span>4.8</span>
                <span className="mx-1">•</span>
                <MapPin className="size-4" />
                <span>Downtown</span>
              </div>
              <Button className="mt-4 w-full" onClick={onSelectRestaurant}>
                Book a Table
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
