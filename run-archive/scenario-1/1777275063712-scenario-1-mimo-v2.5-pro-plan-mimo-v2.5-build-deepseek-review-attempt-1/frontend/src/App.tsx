import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { RestaurantListPage } from "./pages/RestaurantListPage";
import { RestaurantDetailPage } from "./pages/RestaurantDetailPage";
import { BookingConfirmationPage } from "./pages/BookingConfirmationPage";
import { BookingsListPage } from "./pages/BookingsListPage";
import { Navbar } from "./components/Navbar";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<RestaurantListPage />} />
              <Route
                path="/restaurants/:id"
                element={<RestaurantDetailPage />}
              />
              <Route
                path="/bookings/confirmation/:id"
                element={<BookingConfirmationPage />}
              />
              <Route path="/bookings" element={<BookingsListPage />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
