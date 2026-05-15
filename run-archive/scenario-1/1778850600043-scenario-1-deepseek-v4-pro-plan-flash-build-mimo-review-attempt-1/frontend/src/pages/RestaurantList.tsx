import { Link } from "react-router-dom";
import { useGetRestaurants } from "@/api/generated/restaurants/restaurants";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Calendar, MapPin, Users } from "lucide-react";

export default function RestaurantList() {
  const { data, isLoading, error } = useGetRestaurants();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold mb-6">Restaurants</h1>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-96" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <AlertCircle className="size-12 text-destructive" />
        <p className="text-muted-foreground">Could not load restaurants. Make sure the server is running.</p>
      </div>
    );
  }

  const restaurants = data.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Restaurants</h1>
        <p className="text-muted-foreground">Choose a restaurant to book a table</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                <Badge variant="secondary">{restaurant.cuisine}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-2">{restaurant.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                <span className="truncate">{restaurant.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4 shrink-0" />
                <span>
                  {String(restaurant.minCapacity)}&ndash;{String(restaurant.maxCapacity)} guests
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4 shrink-0" />
                <span>{String(restaurant.tableCount)} tables</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/book/${restaurant.id}`}>Book a Table</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
