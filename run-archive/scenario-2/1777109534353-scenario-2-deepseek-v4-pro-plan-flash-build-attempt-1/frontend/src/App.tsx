import { useState } from 'react'
import { RestaurantList } from './components/RestaurantList'
import { BookingForm } from './components/BookingForm'
import { BookingsView } from './components/BookingsView'
import { BookingConfirmation } from './components/BookingConfirmation'
import type { BookingResponse } from './api/model'

type View = 'restaurants' | 'bookings'

interface BookingFlowState {
  restaurantId: string
  restaurantName: string
  booking: BookingResponse
}

function App() {
  const [view, setView] = useState<View>('restaurants')
  const [selectedRestaurant, setSelectedRestaurant] = useState<{ id: string; name: string } | null>(null)
  const [confirmedBooking, setConfirmedBooking] = useState<BookingFlowState | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">Restaurant Booking</h1>
          <nav className="flex gap-1">
            <button
              onClick={() => {
                setView('restaurants')
                setSelectedRestaurant(null)
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'restaurants'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Restaurants
            </button>
            <button
              onClick={() => setView('bookings')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'bookings'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Bookings
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {view === 'restaurants' && !confirmedBooking && (
          <RestaurantList
            onBook={(id, name) => {
              setSelectedRestaurant({ id, name })
            }}
          />
        )}

        {view === 'restaurants' && selectedRestaurant && !confirmedBooking && (
          <BookingForm
            restaurantId={selectedRestaurant.id}
            restaurantName={selectedRestaurant.name}
            onBack={() => setSelectedRestaurant(null)}
            onConfirmed={(booking) => {
              setConfirmedBooking({
                restaurantId: selectedRestaurant.id,
                restaurantName: selectedRestaurant.name,
                booking,
              })
            }}
          />
        )}

        {confirmedBooking && (
          <BookingConfirmation
            restaurantName={confirmedBooking.restaurantName}
            booking={confirmedBooking.booking}
            onNewBooking={() => {
              setConfirmedBooking(null)
              setSelectedRestaurant(null)
            }}
            onViewBookings={() => {
              setConfirmedBooking(null)
              setSelectedRestaurant(null)
              setView('bookings')
            }}
          />
        )}

        {view === 'bookings' && <BookingsView />}
      </main>
    </div>
  )
}

export default App
