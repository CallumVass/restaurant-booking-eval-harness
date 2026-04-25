import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchRestaurants } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function RestaurantList() {
  const {
    data: restaurants,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['restaurants'],
    queryFn: fetchRestaurants,
  })

  if (isLoading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Restaurants</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-9 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Oops!</h1>
        <p className="text-muted-foreground">Unable to load restaurants. Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (!restaurants?.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-2xl font-bold">No Restaurants</h1>
        <p className="text-muted-foreground">No restaurants are available at this time.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Restaurants</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((r) => (
          <Card key={r.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{r.name}</CardTitle>
              <CardDescription>
                <Badge variant="secondary">{r.cuisine}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-end gap-4">
              <p className="text-sm text-muted-foreground">
                {r.tables.length} tables &middot; up to {Math.max(...r.tables.map((t) => t.capacity))} guests
              </p>
              <Link to={`/restaurants/${r.id}/book`}>
                <Button className="w-full">Book a Table</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
