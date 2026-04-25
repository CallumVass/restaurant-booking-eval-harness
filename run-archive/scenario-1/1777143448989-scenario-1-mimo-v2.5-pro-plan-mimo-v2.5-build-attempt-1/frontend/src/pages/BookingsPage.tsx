import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { Booking, Restaurant } from "../api/client";
import { Calendar, Users, Clock, Building2 } from "lucide-react";

export default function BookingsPage() {
    const { data: restaurants } = useQuery({
        queryKey: ["restaurants"],
        queryFn: () => api.restaurants.list(),
    });

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    My Bookings
                </h1>
                <p className="text-gray-600 mt-1">
                    View your restaurant reservations
                </p>
            </div>

            {restaurants && restaurants.length > 0 ? (
                <div className="space-y-6">
                    {restaurants.map((restaurant: Restaurant) => (
                        <RestaurantBookings
                            key={restaurant.id}
                            restaurant={restaurant}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No restaurants available.</p>
                </div>
            )}
        </div>
    );
}

function RestaurantBookings({ restaurant }: { restaurant: Restaurant }) {
    const { data: bookings, isLoading } = useQuery({
        queryKey: ["bookings", restaurant.id],
        queryFn: () => api.bookings.list(restaurant.id),
    });

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                <div className="space-y-2">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="h-16 bg-gray-100 rounded animate-pulse"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!bookings || bookings.length === 0) {
        return null;
    }

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":");
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                    {restaurant.name}
                </h2>
            </div>

            <div className="divide-y">
                {bookings.map((booking: Booking) => (
                    <div
                        key={booking.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span className="text-sm">
                                        {booking.date}
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span className="text-sm">
                                        {formatTime(booking.startTime)} -{" "}
                                        {formatTime(booking.endTime)}
                                    </span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Users className="w-4 h-4 mr-1" />
                                    <span className="text-sm">
                                        {booking.partySize} guests
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                    {booking.customerName}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {booking.customerEmail}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
