import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, CalendarDays } from 'lucide-react'
import type { Restaurant } from '@/api/booking-api'

interface BookingCardProps {
  restaurant: Restaurant
  onSelect: (id: string) => void
}

function BookingCard({ restaurant, onSelect }: BookingCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{restaurant.name}</CardTitle>
          <Badge variant="secondary">{restaurant.cuisine}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {restaurant.address}
        </p>
        <Button
          className="w-full"
          onClick={() => onSelect(restaurant.id)}
          aria-label={`Book a table at ${restaurant.name}`}
        >
          <CalendarDays className="size-4" aria-hidden="true" />
          Book a Table
        </Button>
      </CardContent>
    </Card>
  )
}

export default BookingCard
