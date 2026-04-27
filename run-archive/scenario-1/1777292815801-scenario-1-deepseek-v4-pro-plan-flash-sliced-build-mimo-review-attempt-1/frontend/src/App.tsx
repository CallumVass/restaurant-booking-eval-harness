import { useState } from 'react'
import type { Booking } from '@/api/booking-api'
import Layout from '@/components/Layout'
import RestaurantList from '@/pages/RestaurantList'
import BookingForm from '@/pages/BookingForm'
import BookingConfirmation from '@/pages/BookingConfirmation'
import BookingsList from '@/pages/BookingsList'

type Route =
  | { name: 'restaurants' }
  | { name: 'booking-form'; restaurantId: string }
  | { name: 'booking-confirmation'; booking: Booking; restaurantName: string; restaurantId: string }
  | { name: 'bookings' }

function App() {
  const [route, setRoute] = useState<Route>({ name: 'restaurants' })

  const navigate = (name: string) => {
    switch (name) {
      case 'restaurants':
        setRoute({ name: 'restaurants' })
        break
      case 'bookings':
        setRoute({ name: 'bookings' })
        break
    }
  }

  const routeLabel =
    route.name === 'restaurants'
      ? 'restaurants'
      : route.name === 'bookings'
        ? 'bookings'
        : 'restaurant-'

  return (
    <Layout currentRoute={routeLabel} onNavigate={navigate}>
      {route.name === 'restaurants' && (
        <RestaurantList
          onSelectRestaurant={(id) => setRoute({ name: 'booking-form', restaurantId: id })}
        />
      )}
      {route.name === 'booking-form' && (
        <BookingForm
          restaurantId={route.restaurantId}
          onBack={() => setRoute({ name: 'restaurants' })}
          onBookingCreated={(booking, restaurantName, restaurantId) =>
            setRoute({ name: 'booking-confirmation', booking, restaurantName, restaurantId })
          }
        />
      )}
      {route.name === 'booking-confirmation' && (
        <BookingConfirmation
          booking={route.booking}
          restaurantName={route.restaurantName}
          onViewBookings={() => setRoute({ name: 'bookings' })}
          onBookAnother={() => setRoute({ name: 'restaurants' })}
        />
      )}
      {route.name === 'bookings' && <BookingsList />}
    </Layout>
  )
}

export default App
