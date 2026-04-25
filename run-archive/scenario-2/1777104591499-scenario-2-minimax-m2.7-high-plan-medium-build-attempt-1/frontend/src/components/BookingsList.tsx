import { useState } from "react";
import { format } from "date-fns";
import { useBookings } from "@/api/hooks";
import type { RestaurantDto } from "@/api/model";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select } from "./ui/select";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

interface BookingsListProps {
  restaurants: RestaurantDto[];
}

export function BookingsList({ restaurants }: BookingsListProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );

  const { data: bookings, isLoading } = useBookings({
    restaurantId: selectedRestaurant || undefined,
    date: selectedDate || undefined,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">My Bookings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="filterRestaurant">Restaurant</Label>
              <Select
                id="filterRestaurant"
                value={selectedRestaurant}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedRestaurant(e.target.value)
                }
              >
                <option value="">All Restaurants</option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id!}>
                    {r.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filterDate">Date</Label>
              <Input
                id="filterDate"
                type="date"
                value={selectedDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSelectedDate(e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !bookings || bookings.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No bookings found for your criteria.</p>
          <p className="text-sm text-slate-400 mt-2">
            Try selecting a different restaurant or date.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const restaurant = restaurants.find(
              (r) => r.id === booking.restaurantId,
            );
            return (
              <Card
                key={booking.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {restaurant?.name ?? "Unknown Restaurant"}
                        </h3>
                        <Badge className="bg-violet-100 text-violet-700">
                          {booking.partySize} guests
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(
                            new Date(booking.startTime ?? ""),
                            "MMM d, yyyy",
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(
                            new Date(booking.startTime ?? ""),
                            "h:mm a",
                          )}{" "}
                          - {format(new Date(booking.endTime ?? ""), "h:mm a")}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <MapPin className="w-4 h-4" />
                        {restaurant?.address ?? "Unknown location"}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Confirmation</p>
                      <p className="font-mono text-sm font-medium">
                        {booking.id?.slice(0, 8)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
