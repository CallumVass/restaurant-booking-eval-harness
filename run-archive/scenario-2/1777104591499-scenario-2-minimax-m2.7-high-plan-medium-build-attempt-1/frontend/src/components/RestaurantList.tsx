import type { RestaurantDto } from "@/api/model";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Users } from "lucide-react";

interface RestaurantListProps {
  restaurants: RestaurantDto[];
  onSelect: (restaurantId: string) => void;
}

export function RestaurantList({ restaurants, onSelect }: RestaurantListProps) {
  if (restaurants.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-slate-500">
          No restaurants available at the moment.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {restaurants.map((restaurant) => {
        const capacities = restaurant.tables?.map((t) => t.capacity ?? 0) ?? [];
        const minCapacity = capacities.length > 0 ? Math.min(...capacities) : 0;
        const maxCapacity = capacities.length > 0 ? Math.max(...capacities) : 0;

        return (
          <Card
            key={restaurant.id}
            className="group hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{restaurant.name}</CardTitle>
                <Badge className="bg-violet-100 text-violet-700">
                  {restaurant.tables?.length ?? 0} tables
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {restaurant.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-slate-600 gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{restaurant.address}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600 gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span>
                  Seats {minCapacity}–{maxCapacity} guests
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full group-hover:bg-violet-600 transition-colors"
                onClick={() => onSelect(restaurant.id!)}
              >
                Book a Table
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
