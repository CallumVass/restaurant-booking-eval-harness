import {
  getRestaurants,
  getRestaurant,
  getAvailability,
  createBooking,
  getBookings,
  getBooking,
  type Restaurant,
  type Booking,
  type CreateBookingRequest,
} from '@/api/booking-api'

export async function fetchRestaurants(): Promise<Restaurant[]> {
  const response = await getRestaurants()
  return response.data ?? []
}

export async function fetchRestaurant(id: string): Promise<Restaurant> {
  const response = await getRestaurant(id)
  if (response.status !== 200) throw new Error('Restaurant not found')
  return response.data
}

export async function fetchAvailability(id: string, date: string, partySize: number) {
  const response = await getAvailability(id, { date, partySize })
  if (response.status !== 200) throw new Error('Failed to fetch availability')
  return response.data
}

export async function fetchBookings(): Promise<Booking[]> {
  const response = await getBookings()
  return response.data ?? []
}

export async function fetchBooking(id: string): Promise<Booking> {
  const response = await getBooking(id)
  if (response.status !== 200) throw new Error('Booking not found')
  return response.data
}

export async function submitBooking(request: CreateBookingRequest): Promise<Booking> {
  const response = await createBooking(request)
  if (response.status === 201) return response.data
  const error = response as { status: number; data?: { message?: string; code?: string } }
  throw { status: error.status, body: error.data ?? { message: 'Booking failed', code: 'UNKNOWN' } }
}
