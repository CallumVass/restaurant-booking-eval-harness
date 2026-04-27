import { Link } from "react-router-dom";
import { useListRestaurants } from "@/api/endpoints";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const cuisineColors: Record<string, string> = {
  Italian: "bg-orange-100 text-orange-800",
  Japanese: "bg-pink-100 text-pink-800",
  French: "bg-indigo-100 text-indigo-800",
};

export function RestaurantListPage() {
  const { data, isLoading, error } = useListRestaurants();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-white rounded-lg shadow animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          Failed to load restaurants. Please try again.
        </p>
      </div>
    );
  }

  const restaurants = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
        <p className="mt-2 text-gray-600">
          Choose a restaurant to make a reservation
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants?.map((restaurant) => (
          <Link
            key={restaurant.id}
            to={`/restaurants/${restaurant.id}`}
            className="group block"
          >
            <Card className="h-full hover:shadow-md transition-shadow border group-hover:border-blue-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {restaurant.name}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className={
                      cuisineColors[restaurant.cuisineType ?? ""] ?? ""
                    }
                  >
                    {restaurant.cuisineType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm mb-4">
                  {restaurant.address}
                </p>
                <div className="flex items-center text-sm text-gray-400">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {restaurant.openingTime} - {restaurant.closingTime}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View &amp; Book
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
