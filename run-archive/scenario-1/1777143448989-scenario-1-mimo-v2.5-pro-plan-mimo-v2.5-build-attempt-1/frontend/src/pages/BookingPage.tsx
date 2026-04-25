import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import type { TimeSlot, CreateBookingRequest } from "../api/client";
import { Calendar, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function BookingPage() {
    const { restaurantId } = useParams<{ restaurantId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        partySize: 2,
        date: new Date().toISOString().split("T")[0],
        selectedSlot: null as TimeSlot | null,
    });

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [bookingId, setBookingId] = useState<string | null>(null);

    const { data: restaurant } = useQuery({
        queryKey: ["restaurant", restaurantId],
        queryFn: () => api.restaurants.get(restaurantId!),
        enabled: !!restaurantId,
    });

    const { data: availableSlots, isLoading: slotsLoading } = useQuery({
        queryKey: [
            "availableSlots",
            restaurantId,
            formData.date,
            formData.partySize,
        ],
        queryFn: () =>
            api.restaurants.getAvailableSlots(
                restaurantId!,
                formData.date,
                formData.partySize,
            ),
        enabled: !!restaurantId && !!formData.date && formData.partySize > 0,
    });

    const createBookingMutation = useMutation({
        mutationFn: (request: CreateBookingRequest) =>
            api.bookings.create(restaurantId!, request),
        onSuccess: (booking) => {
            setBookingId(booking.id);
            setShowConfirmation(true);
            queryClient.invalidateQueries({
                queryKey: ["bookings", restaurantId],
            });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.selectedSlot) return;

        createBookingMutation.mutate({
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            partySize: formData.partySize,
            date: formData.date,
            startTime: formData.selectedSlot.startTime,
        });
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":");
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        const hour12 = h % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    if (showConfirmation && bookingId) {
        return (
            <div className="max-w-md mx-auto">
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Booking Confirmed!
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Your reservation has been successfully created.
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-gray-600">
                            <strong>Booking ID:</strong> {bookingId.slice(0, 8)}
                            ...
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Restaurant:</strong> {restaurant?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Date:</strong> {formData.date}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Time:</strong>{" "}
                            {formData.selectedSlot &&
                                formatTime(formData.selectedSlot.startTime)}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Party Size:</strong> {formData.partySize}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Back to Restaurants
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Book a Table
                </h1>
                {restaurant && (
                    <p className="text-gray-600 mt-1">
                        {restaurant.name} - {restaurant.address}
                    </p>
                )}
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow-sm border p-6 space-y-6"
            >
                {createBookingMutation.isError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                        <p className="text-red-800 text-sm">
                            {createBookingMutation.error.message ||
                                "Failed to create booking. Please try again."}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.customerName}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    customerName: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.customerEmail}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    customerEmail: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="john@example.com"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Date
                        </label>
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split("T")[0]}
                            value={formData.date}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    date: e.target.value,
                                    selectedSlot: null,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <Users className="w-4 h-4 inline mr-1" />
                            Party Size
                        </label>
                        <select
                            value={formData.partySize}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    partySize: parseInt(e.target.value),
                                    selectedSlot: null,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        >
                            {Array.from(
                                { length: restaurant?.maxPartySize || 10 },
                                (_, i) => i + 1,
                            ).map((size) => (
                                <option key={size} value={size}>
                                    {size} {size === 1 ? "guest" : "guests"}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Select Time Slot
                    </label>

                    {slotsLoading ? (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-10 bg-gray-100 rounded animate-pulse"
                                ></div>
                            ))}
                        </div>
                    ) : availableSlots && availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                            {availableSlots.map((slot, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            selectedSlot: slot,
                                        })
                                    }
                                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                                        formData.selectedSlot === slot
                                            ? "bg-gray-900 text-white border-gray-900"
                                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
                                    }`}
                                >
                                    {formatTime(slot.startTime)}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">
                            No available slots for this date and party size.
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={
                        !formData.selectedSlot ||
                        createBookingMutation.isPending
                    }
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {createBookingMutation.isPending
                        ? "Creating Booking..."
                        : "Confirm Booking"}
                </button>
            </form>
        </div>
    );
}
