import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listRestaurants, listBookings } from "@/api/endpoints";
import type { Restaurant, Booking } from "@/api/model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BookingsListPage() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("r1");

  const { data: restaurantsResponse } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const response = await listRestaurants();
      return response.data as Restaurant[];
    },
  });

  const { data: bookingsResponse, isLoading } = useQuery({
    queryKey: ["bookings", selectedRestaurantId],
    queryFn: async () => {
      const response = await listBookings({
        restaurantId: selectedRestaurantId,
      });
      return response.data as Booking[];
    },
    enabled: !!selectedRestaurantId,
  });

  const restaurants = restaurantsResponse as Restaurant[] | undefined;
  const bookings = bookingsResponse as Booking[] | undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-gray-600">View your reservations</p>
      </div>

      <div>
        <label
          htmlFor="restaurant"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Select Restaurant
        </label>
        <select
          id="restaurant"
          value={selectedRestaurantId}
          onChange={(e) => setSelectedRestaurantId(e.target.value)}
          className="w-full max-w-xs px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {restaurants?.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : bookings && bookings.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Party Size</TableHead>
                  <TableHead>Table</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.customerName}
                    </TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>
                      {booking.startTime} - {booking.endTime}
                    </TableCell>
                    <TableCell>{booking.partySize}</TableCell>
                    <TableCell>{booking.tableId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-gray-500">
              No bookings found for this restaurant.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
