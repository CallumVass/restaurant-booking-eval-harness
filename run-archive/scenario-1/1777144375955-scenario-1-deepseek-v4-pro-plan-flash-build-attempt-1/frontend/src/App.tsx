import { Routes, Route, Link } from 'react-router-dom'
import RestaurantList from './pages/RestaurantList'
import BookingForm from './pages/BookingForm'
import BookingConfirmation from './pages/BookingConfirmation'
import BookingList from './pages/BookingList'

export default function App() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight">
            Restaurant Booking
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Restaurants
            </Link>
            <Link to="/bookings" className="text-muted-foreground hover:text-foreground transition-colors">
              My Bookings
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<RestaurantList />} />
          <Route path="/restaurants/:id/book" element={<BookingForm />} />
          <Route path="/bookings/:id" element={<BookingConfirmation />} />
          <Route path="/bookings" element={<BookingList />} />
        </Routes>
      </main>
    </div>
  )
}
