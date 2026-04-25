import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Restaurant } from "../api/client";
import { MapPin, Users, ArrowRight } from "lucide-react";

export default function RestaurantList() {
    const {
        data: restaurants,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["restaurants"],
        queryFn: () => api.restaurants.list(),
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg shadow-sm border p-6 animate-pulse"
                    >
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">
                    Failed to load restaurants. Please try again later.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Restaurants
                </h1>
                <p className="text-gray-600 mt-1">
                    Choose a restaurant to make a reservation
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants?.map((restaurant: Restaurant) => (
                    <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                    />
                ))}
            </div>
        </div>
    );
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {restaurant.name}
                </h2>

                <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{restaurant.address}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                        Up to {restaurant.maxPartySize} guests
                    </span>
                </div>

                <Link
                    to={`/book/${restaurant.id}`}
                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                    Book a Table
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </div>
        </div>
    );
}
