import { useEffect } from 'react'
import { toast } from 'sonner'
import { useGetRestaurants } from '@/api/booking-api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import BookingCard from '@/components/BookingCard'

interface RestaurantListProps {
  onSelectRestaurant: (id: string) => void
}

function RestaurantList({ onSelectRestaurant }: RestaurantListProps) {
  const { data: response, isLoading, isError, error } = useGetRestaurants()

  useEffect(() => {
    if (isError) {
      toast.error(error instanceof Error ? error.message : 'Failed to load restaurants')
    }
  }, [isError, error])

  if (isLoading) {
    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold">Restaurants</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="mt-1 h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const restaurants = response?.data ?? []

  if (!isError && restaurants.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>No restaurants available</CardTitle>
            <CardDescription>Check back later for new listings.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Restaurants</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
          <BookingCard key={restaurant.id} restaurant={restaurant} onSelect={onSelectRestaurant} />
        ))}
      </div>
    </div>
  )
}

export default RestaurantList
