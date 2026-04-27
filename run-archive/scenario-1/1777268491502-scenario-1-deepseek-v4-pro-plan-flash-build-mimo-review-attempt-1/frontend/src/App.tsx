import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import RestaurantList from './components/RestaurantList';
import BookingForm from './components/BookingForm';
import BookingConfirmation from './components/BookingConfirmation';
import BookingList from './components/BookingList';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<RestaurantList />} />
        <Route path="/book" element={<BookingForm />} />
        <Route path="/book/confirm" element={<BookingConfirmation />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
