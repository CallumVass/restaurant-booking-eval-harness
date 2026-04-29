// pattern: Imperative Shell

import { Loader2, MapPin, Users } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { Restaurant } from "../generated/booking-client";
import { cn } from "../lib/utils";

interface RestaurantListProps {
  restaurants: Restaurant[];
  selectedId: string;
  isLoading: boolean;
  onSelect: (id: string) => void;
}

export function RestaurantList({
  restaurants,
  selectedId,
  isLoading,
  onSelect,
}: RestaurantListProps) {
  return (
    <section
      className="flex flex-col gap-4"
      aria-labelledby="restaurants-heading"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2
            id="restaurants-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            Restaurants
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose a room, then book against live table inventory.
          </p>
        </div>
        {isLoading ? (
          <Loader2 className="animate-spin" aria-label="Loading restaurants" />
        ) : null}
      </div>
      <div className="grid gap-3">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            active={restaurant.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

function RestaurantCard({
  restaurant,
  active,
  onSelect,
}: {
  restaurant: Restaurant;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const capacity = Math.max(
    ...restaurant.tables.map((table) => table.capacity),
  );

  return (
    <Card
      className={cn(
        "transition-colors duration-200",
        active && "border-primary bg-accent",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2 text-left">
            <CardTitle>{restaurant.name}</CardTitle>
            <CardDescription>{restaurant.description}</CardDescription>
          </div>
          <Badge className="bg-secondary text-secondary-foreground">
            {restaurant.cuisine}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin data-icon="inline-start" /> {restaurant.neighborhood}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users data-icon="inline-start" /> Up to {capacity}
        </span>
      </CardContent>
      <CardFooter>
        <Button
          variant={active ? "secondary" : "outline"}
          size="sm"
          onClick={() => onSelect(restaurant.id)}
        >
          {active ? "Selected" : "Select restaurant"}
        </Button>
      </CardFooter>
    </Card>
  );
}
