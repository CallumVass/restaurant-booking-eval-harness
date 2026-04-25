import { useSuspenseQuery } from '@tanstack/react-query'
import { getRestaurants } from '../api/restaurants/restaurants'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Building2, Users, Table2 } from 'lucide-react'

interface RestaurantListProps {
  onBook: (id: string, name: string) => void
}

export function RestaurantList({ onBook }: RestaurantListProps) {
  const {
    data: response,
    error,
    isLoading,
  } = useSuspenseQuery({
    queryKey: ['restaurants'],
    queryFn: () => getRestaurants(),
  })

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load restaurants. Please try again later.</AlertDescription>
      </Alert>
    )
  }

  if (isLoading || !response) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  const restaurants = response.data

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Choose a Restaurant</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((r) => (
          <Card key={r.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="size-5 text-muted-foreground" />
                <CardTitle className="text-lg">{r.name}</CardTitle>
              </div>
              <CardDescription>{r.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Table2 className="size-4" />
                  {r.tableCount} tables
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-4" />
                  {r.minCapacity}–{r.maxCapacity} seats
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => onBook(r.id, r.name)}>
                Book a Table
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
