import { RestaurantDto } from "../types";

interface RestaurantListProps {
  restaurants: RestaurantDto[];
  onSelect: (restaurant: RestaurantDto) => void;
  onViewBookings: () => void;
}

export function RestaurantList({
  restaurants,
  onSelect,
  onViewBookings,
}: RestaurantListProps) {
  return (
    <div>
      <h1>Restaurants</h1>
      <button type="button" onClick={onViewBookings}>
        View Bookings
      </button>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <h2>{restaurant.name}</h2>
            <p>
              Hours: {restaurant.openingTime} - {restaurant.closingTime}
            </p>
            <button type="button" onClick={() => onSelect(restaurant)}>
              Book a table
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
