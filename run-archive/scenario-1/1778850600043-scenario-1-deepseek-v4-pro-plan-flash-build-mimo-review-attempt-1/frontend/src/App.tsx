import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarCheck, List, Utensils } from "lucide-react";
import RestaurantList from "@/pages/RestaurantList";
import BookingForm from "@/pages/BookingForm";
import BookingConfirmation from "@/pages/BookingConfirmation";
import BookingsList from "@/pages/BookingsList";

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
            <Utensils className="size-5 text-primary" />
            <span>RestaurantBook</span>
          </Link>
          <nav className="flex gap-2">
            <Button variant={location.pathname === "/" ? "default" : "ghost"} size="sm" asChild>
              <Link to="/">
                <List className="size-4" />
                Restaurants
              </Link>
            </Button>
            <Button variant={location.pathname === "/bookings" ? "default" : "ghost"} size="sm" asChild>
              <Link to="/bookings">
                <CalendarCheck className="size-4" />
                My Bookings
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<RestaurantList />} />
          <Route path="/book/:restaurantId" element={<BookingForm />} />
          <Route path="/confirmation" element={<BookingConfirmation />} />
          <Route path="/bookings" element={<BookingsList />} />
        </Routes>
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        RestaurantBook &mdash; Reservation System
      </footer>
    </div>
  );
}

export default App;
