import { Routes, Route, Link } from "react-router-dom";
import RestaurantList from "./pages/RestaurantList";
import BookingPage from "./pages/BookingPage";
import BookingsPage from "./pages/BookingsPage";

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link
                                to="/"
                                className="text-xl font-bold text-gray-900"
                            >
                                Restaurant Booking
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Restaurants
                            </Link>
                            <Link
                                to="/bookings"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                My Bookings
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <Routes>
                    <Route path="/" element={<RestaurantList />} />
                    <Route
                        path="/book/:restaurantId"
                        element={<BookingPage />}
                    />
                    <Route path="/bookings" element={<BookingsPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
