interface BookingConfirmationProps {
  booking: {
    id: string;
    restaurantName: string;
    date: string;
    startTime: string;
    partySize: number;
    customerName: string;
  };
  onClose: () => void;
}

export function BookingConfirmation({
  booking,
  onClose,
}: BookingConfirmationProps) {
  return (
    <div>
      <h1>Booking Confirmed</h1>
      <p>Reference: {booking.id}</p>
      <p>Restaurant: {booking.restaurantName}</p>
      <p>Date: {booking.date}</p>
      <p>Time: {booking.startTime}</p>
      <p>Party size: {booking.partySize}</p>
      <p>Name: {booking.customerName}</p>
      <button type="button" onClick={onClose}>
        Done
      </button>
    </div>
  );
}
