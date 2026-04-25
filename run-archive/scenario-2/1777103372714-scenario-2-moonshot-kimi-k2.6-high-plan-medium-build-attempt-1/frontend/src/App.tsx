import { useState } from 'react'
import RestaurantList from './features/restaurants/RestaurantList'
import BookingForm from './features/bookings/BookingForm'
import BookingConfirmation from './features/bookings/BookingConfirmation'
import BookingsList from './features/bookings/BookingsList'

type View = 'restaurants' | 'booking' | 'confirmation' | 'bookings'

export default function App() {
  const [view, setView] = useState<View>('restaurants')
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null)
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">TableReserve</h1>
          <nav className="flex gap-2">
            <button
              onClick={() => setView('restaurants')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'restaurants'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              Restaurants
            </button>
            <button
              onClick={() => setView('bookings')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                view === 'bookings'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              My Bookings
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {view === 'restaurants' && (
          <RestaurantList
            onBook={(id) => {
              setSelectedRestaurantId(id)
              setView('booking')
            }}
          />
        )}
        {view === 'booking' && selectedRestaurantId && (
          <BookingForm
            restaurantId={selectedRestaurantId}
            onCancel={() => setView('restaurants')}
            onSuccess={(bookingId) => {
              setConfirmedBookingId(bookingId)
              setView('confirmation')
            }}
          />
        )}
        {view === 'confirmation' && confirmedBookingId && (
          <BookingConfirmation
            bookingId={confirmedBookingId}
            onDone={() => {
              setConfirmedBookingId(null)
              setSelectedRestaurantId(null)
              setView('bookings')
            }}
          />
        )}
        {view === 'bookings' && <BookingsList />}
      </main>
    </div>
  )
}
