import { useGetRestaurants } from '@/api/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export function RestaurantList() {
  const { data, isLoading, error } = useGetRestaurants()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Restaurants</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-3/4 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">Failed to load restaurants. Please try again.</p>
      </div>
    )
  }

  const restaurants = data?.data ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Restaurants</h1>
        <p className="mt-1 text-muted-foreground">Choose a restaurant to make a reservation</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{restaurant.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{restaurant.address}</p>
              <div className="flex flex-wrap gap-1">
                {restaurant.tables?.map((table) => (
                  <Badge key={table.id} variant="secondary" className="text-xs">
                    {table.seats} seats
                  </Badge>
                ))}
              </div>
              <Button render={<Link to={`/book/${restaurant.id}`} />} className="w-full" size="sm">
                Book a Table
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
