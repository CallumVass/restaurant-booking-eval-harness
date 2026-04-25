import { useState } from 'react';
import { RestaurantList } from '@/features/RestaurantList/RestaurantList';
import { BookingForm } from '@/features/BookingForm/BookingForm';
import { BookingConfirmation } from '@/features/BookingConfirmation/BookingConfirmation';
import { BookingList } from '@/features/BookingList/BookingList';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, CalendarPlus, ListChecks, Home } from 'lucide-react';

type Page = 'home' | 'book' | 'bookings';

interface BookingData {
  id: string;
  restaurantName: string;
  guestName: string;
  partySize: number;
  dateTime: string;
}

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [lastBooking, setLastBooking] = useState<BookingData | null>(null);

  const handleBookingComplete = (booking: BookingData) => {
    setLastBooking(booking);
    setPage('bookings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <button
            onClick={() => setPage('home')}
            className="flex items-center gap-2 text-xl font-bold text-amber-900"
          >
            <UtensilsCrossed className="size-6 text-amber-600" />
            <span className="hidden sm:inline">TableReserve</span>
          </button>
          <nav className="flex gap-1">
            <Button
              variant={page === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPage('home')}
            >
              <Home className="mr-1 size-4" />
              Restaurants
            </Button>
            <Button
              variant={page === 'book' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPage('book')}
            >
              <CalendarPlus className="mr-1 size-4" />
              Book
            </Button>
            <Button
              variant={page === 'bookings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPage('bookings')}
            >
              <ListChecks className="mr-1 size-4" />
              Bookings
            </Button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {page === 'home' && <RestaurantList onSelectRestaurant={() => setPage('book')} />}
        {page === 'book' && <BookingForm onBookingComplete={handleBookingComplete} />}
        {page === 'bookings' && (
          <>
            {lastBooking && <BookingConfirmation booking={lastBooking} />}
            <BookingList />
          </>
        )}
      </main>
    </div>
  );
}
