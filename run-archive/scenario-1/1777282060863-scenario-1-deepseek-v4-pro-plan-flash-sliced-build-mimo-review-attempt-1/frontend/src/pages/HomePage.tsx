import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getRestaurants } from '@/api/list-restaurants-endpoint/list-restaurants-endpoint'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function SkeletonCard() {
  return (
    <Card className="animate-pulse">
      <CardHeader>
        <div className="h-6 w-3/4 rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-muted" />
          <div className="h-5 w-12 rounded-full bg-muted" />
          <div className="h-5 w-14 rounded-full bg-muted" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 w-full rounded-md bg-muted" />
      </CardFooter>
    </Card>
  )
}

function HomePage() {
  const {
    data: restaurants,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => {
      const res = await getRestaurants()
      return res.data
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Restaurants</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Restaurants</h2>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              Failed to load restaurants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error instanceof Error
                ? error.message
                : 'An unexpected error occurred.'}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Restaurants</h2>
        <Card>
          <CardHeader>
            <CardTitle>No restaurants available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please check back later — restaurants will appear here once
              available.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Restaurants</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => {
          const capacities = [
            ...new Set(
              restaurant.tables.map((t) =>
                typeof t.capacity === 'number'
                  ? t.capacity
                  : parseInt(t.capacity, 10),
              ),
            ),
          ].sort((a, b) => a - b)

          return (
            <Card key={restaurant.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{restaurant.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {capacities.map((cap) => (
                    <Badge key={cap} variant="secondary">
                      Up to {cap} guests
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/book/${restaurant.id}`}>Book a Table</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default HomePage
