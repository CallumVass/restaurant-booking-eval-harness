import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import BookPage from '@/pages/BookPage'
import BookingsPage from '@/pages/BookingsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/book/:restaurantId" element={<BookPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
