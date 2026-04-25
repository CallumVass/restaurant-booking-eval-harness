import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBookings } from '../api/bookings/bookings'
import type { GetBookingsParams } from '../api/model'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Skeleton } from '../components/ui/skeleton'
import { Search } from 'lucide-react'

function toTimeDisplay(time: string): string {
  return time.slice(0, 5)
}

export function BookingsView() {
  const [dateFilter, setDateFilter] = useState('')

  const params: GetBookingsParams | undefined = dateFilter ? { date: dateFilter } : undefined

  const {
    data: response,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['bookings', dateFilter],
    queryFn: () => getBookings(params),
  })

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-2xl">My Bookings</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFilter(e.target.value)}
                className="w-auto"
                placeholder="Filter by date"
              />
              {dateFilter && (
                <button
                  onClick={() => setDateFilter('')}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>Failed to load bookings.</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

          {response && response.data.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="size-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No bookings found</p>
              <p className="text-sm">
                {dateFilter ? 'No bookings for this date.' : 'Book a table at a restaurant to get started.'}
              </p>
            </div>
          )}

          {response && response.data.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {response.data.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.restaurantName}</TableCell>
                    <TableCell>{b.date}</TableCell>
                    <TableCell>{toTimeDisplay(b.startTime)}</TableCell>
                    <TableCell>{b.partySize}</TableCell>
                    <TableCell>{b.guestName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        Confirmed
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
