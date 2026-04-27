import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { cn } from './lib/utils';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { BookingPage } from './pages/BookingPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { BookingsPage } from './pages/BookingsPage';
import { UtensilsCrossed, CalendarDays, ListOrdered } from 'lucide-react';

function NavLink({
  to,
  children,
  active,
}: {
  to: string;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      {children}
    </Link>
  );
}

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
            <UtensilsCrossed className="size-5" />
            TableBook
          </Link>
          <nav className="flex gap-1">
            <NavLink to="/" active={location.pathname === '/'}>
              <UtensilsCrossed className="size-4" />
              Restaurants
            </NavLink>
            <NavLink to="/book" active={location.pathname.startsWith('/book')}>
              <CalendarDays className="size-4" />
              Book
            </NavLink>
            <NavLink to="/bookings" active={location.pathname === '/bookings'}>
              <ListOrdered className="size-4" />
              Bookings
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<RestaurantsPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/book/:restaurantId" element={<BookingPage />} />
          <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
