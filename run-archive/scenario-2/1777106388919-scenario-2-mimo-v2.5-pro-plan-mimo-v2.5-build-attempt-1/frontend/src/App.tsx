import { Routes, Route, Link } from 'react-router-dom'
import { RestaurantList } from './components/RestaurantList'
import { BookingPage } from './components/BookingPage'
import { BookingsList } from './components/BookingsList'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold text-foreground hover:opacity-80">
            Restaurant Booking
          </Link>
          <nav className="flex gap-4">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Restaurants
            </Link>
            <Link
              to="/bookings"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              My Bookings
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<RestaurantList />} />
          <Route path="/book/:restaurantId" element={<BookingPage />} />
          <Route path="/bookings" element={<BookingsList />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
