import { Route, Routes } from 'react-router-dom';
import { RestaurantListPage } from './pages/RestaurantListPage';
import { BookingFormPage } from './pages/BookingFormPage';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage';
import { BookingsPage } from './pages/BookingsPage';

function App() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <a href="/" className="text-xl font-bold">
            TableBook
          </a>
          <nav className="flex gap-4">
            <a href="/" className="text-sm hover:underline">
              Restaurants
            </a>
            <a href="/bookings" className="text-sm hover:underline">
              Bookings
            </a>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<RestaurantListPage />} />
          <Route path="/book/:restaurantId" element={<BookingFormPage />} />
          <Route path="/confirmation" element={<BookingConfirmationPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
