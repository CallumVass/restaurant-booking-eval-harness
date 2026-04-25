import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "./api/client";
import type { RestaurantDto } from "./api/model";
import { RestaurantList } from "./components/RestaurantList";
import { BookingForm } from "./components/BookingForm";
import { BookingConfirmation } from "./components/BookingConfirmation";
import { BookingsList } from "./components/BookingsList";
import { Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Skeleton } from "./components/ui/skeleton";
import { UtensilsCrossed, CalendarCheck } from "lucide-react";

type View = "restaurants" | "booking" | "confirmation" | "bookings";

interface ConfirmationData {
  bookingId: string;
  restaurantName: string;
  dateTime: string;
  partySize: number;
}

function App() {
  const [view, setView] = useState<View>("restaurants");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(
    null,
  );

  const { data: response, isLoading } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => getRestaurants(),
  });

  const restaurants: RestaurantDto[] = response?.data ?? [];

  const handleSelectRestaurant = (restaurantId: string) => {
    setSelectedRestaurantId(restaurantId);
    setView("booking");
  };

  const handleBookingSuccess = (
    bookingId: string,
    restaurantName: string,
    dateTime: string,
    partySize: number,
  ) => {
    setConfirmation({ bookingId, restaurantName, dateTime, partySize });
    setView("confirmation");
  };

  const handleNewBooking = () => {
    setSelectedRestaurantId(null);
    setConfirmation(null);
    setView("restaurants");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Restaurant Booking
              </h1>
              <p className="text-xs text-slate-500">
                Reserve your perfect table
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {view !== "restaurants" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setView("restaurants")}
              >
                <UtensilsCrossed className="w-4 h-4 mr-1" />
                Restaurants
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("bookings")}
            >
              <CalendarCheck className="w-4 h-4 mr-1" />
              My Bookings
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {view === "restaurants" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">
                Find a Restaurant
              </h2>
              <p className="text-slate-600">
                Browse our selection of partner restaurants and book your next
                dining experience
              </p>
            </div>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-2/3" />
                  </Card>
                ))}
              </div>
            ) : (
              <RestaurantList
                restaurants={restaurants}
                onSelect={handleSelectRestaurant}
              />
            )}
          </div>
        )}

        {view === "booking" && selectedRestaurantId && (
          <BookingForm
            restaurantId={selectedRestaurantId}
            restaurants={restaurants}
            onSuccess={handleBookingSuccess}
            onCancel={() => setView("restaurants")}
          />
        )}

        {view === "confirmation" && confirmation && (
          <BookingConfirmation
            bookingId={confirmation.bookingId}
            restaurantName={confirmation.restaurantName}
            dateTime={confirmation.dateTime}
            partySize={confirmation.partySize}
            onNewBooking={handleNewBooking}
          />
        )}

        {view === "bookings" && <BookingsList restaurants={restaurants} />}
      </main>
    </div>
  );
}

export default App;
