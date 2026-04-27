import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getBooking } from "@/api/endpoints";
import type { Booking } from "@/api/model";

export function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      const response = await getBooking(id!);
      return response.data as Booking;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/2" />
        <div className="h-48 bg-gray-200 rounded" />
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <p className="text-red-600">Booking not found.</p>
        <Link
          to="/"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Back to restaurants
        </Link>
      </div>
    );
  }

  const booking = response as Booking;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg
          className="w-16 h-16 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-green-800">
          Booking Confirmed!
        </h1>
        <p className="text-green-600 mt-2">
          Your reservation has been successfully created.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Booking Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Confirmation ID</p>
            <p className="font-mono text-sm font-medium">{booking.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-medium">{booking.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{booking.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium">
              {booking.startTime} - {booking.endTime}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Party Size</p>
            <p className="font-medium">
              {booking.partySize}{" "}
              {booking.partySize === 1 ? "person" : "people"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Table</p>
            <p className="font-medium">{booking.tableId}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Link
          to="/"
          className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
        >
          Book Another Table
        </Link>
        <Link
          to="/bookings"
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          View All Bookings
        </Link>
      </div>
    </div>
  );
}
