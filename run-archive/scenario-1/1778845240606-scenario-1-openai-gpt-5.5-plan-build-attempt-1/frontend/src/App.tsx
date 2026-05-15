import { CalendarCheck, Clock, MapPin, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button, Card, Field, Input, Select } from "./components/ui";
import {
  getGetBookingsQueryKey,
  type RestaurantDto,
  useGetBookings,
  useGetRestaurants,
  useGetRestaurantsRestaurantIdTimeslots,
  usePostBookings,
} from "./api/generated";

type FormState = {
  restaurantId: string;
  guestName: string;
  partySize: number;
  date: string;
  start: string;
};

const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function restaurantName(restaurants: RestaurantDto[] | undefined, id: string) {
  return (
    restaurants?.find((restaurant) => restaurant.id === id)?.name ??
    "Restaurant"
  );
}

export default function App() {
  const queryClient = useQueryClient();
  const restaurants = useGetRestaurants();
  const [form, setForm] = useState<FormState>({
    restaurantId: "",
    guestName: "",
    partySize: 2,
    date: tomorrow,
    start: "",
  });
  const [confirmation, setConfirmation] = useState<string>("");
  const selectedRestaurantId =
    form.restaurantId || restaurants.data?.data[0]?.id || "";
  const slots = useGetRestaurantsRestaurantIdTimeslots(
    selectedRestaurantId,
    { date: form.date, partySize: form.partySize },
    { query: { enabled: Boolean(selectedRestaurantId && form.date) } },
  );
  const bookings = useGetBookings();
  const availableSlots = useMemo(
    () => slots.data?.data.filter((slot) => slot.available) ?? [],
    [slots.data],
  );
  const createBooking = usePostBookings({
    mutation: {
      onSuccess: (booking) => {
        setConfirmation(
          `Confirmed for ${booking.data.guestName} at ${formatTime(booking.data.start)}.`,
        );
        void queryClient.invalidateQueries({
          queryKey: getGetBookingsQueryKey(),
        });
      },
    },
  });

  const activeRestaurant = selectedRestaurantId;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fee2e2,transparent_35%),linear-gradient(135deg,#f8fafc,#eef2ff)] px-4 py-8 text-slate-900">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_.95fr]">
        <header className="lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-600">
            Tablecraft
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight md:text-6xl">
            Book a memorable table in seconds.
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            Live availability, typed OpenAPI client calls, and conflict-safe
            reservations for every restaurant.
          </p>
        </header>

        <Card className="grid gap-4">
          <h2 className="text-2xl font-bold">Restaurants</h2>
          {restaurants.data?.data.map((restaurant) => (
            <button
              key={restaurant.id}
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  restaurantId: restaurant.id,
                  start: "",
                }))
              }
              className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${activeRestaurant === restaurant.id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold">{restaurant.name}</h3>
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                  Up to{" "}
                  {Math.max(
                    ...restaurant.tables.map((table) => Number(table.capacity)),
                  )}
                </span>
              </div>
              <p
                className={
                  activeRestaurant === restaurant.id
                    ? "text-slate-200"
                    : "text-slate-600"
                }
              >
                {restaurant.description}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm">
                <MapPin size={16} /> {restaurant.neighborhood}
              </p>
            </button>
          ))}
        </Card>

        <Card className="grid gap-4">
          <h2 className="text-2xl font-bold">Reserve</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Restaurant">
              <Select
                value={activeRestaurant}
                onChange={(event) =>
                  setForm({
                    ...form,
                    restaurantId: event.target.value,
                    start: "",
                  })
                }
              >
                {restaurants.data?.data.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Guest name">
              <Input
                value={form.guestName}
                onChange={(event) =>
                  setForm({ ...form, guestName: event.target.value })
                }
                placeholder="Alex Morgan"
              />
            </Field>
            <Field label="Party size">
              <Input
                type="number"
                min={1}
                max={12}
                value={form.partySize}
                onChange={(event) =>
                  setForm({
                    ...form,
                    partySize: Number(event.target.value),
                    start: "",
                  })
                }
              />
            </Field>
            <Field label="Date">
              <Input
                type="date"
                value={form.date}
                min={tomorrow}
                onChange={(event) =>
                  setForm({ ...form, date: event.target.value, start: "" })
                }
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {availableSlots.map((slot) => (
              <button
                key={slot.start}
                onClick={() => setForm({ ...form, start: slot.start })}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${form.start === slot.start ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-200 bg-slate-50"}`}
              >
                <Clock className="mr-1 inline" size={15} />
                {formatTime(slot.start)}
              </button>
            ))}
          </div>
          {slots.isError ? (
            <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              Availability could not be loaded. Check party size and date.
            </p>
          ) : null}
          <Button
            disabled={
              !form.guestName.trim() || !form.start || createBooking.isPending
            }
            onClick={() =>
              createBooking.mutate({
                data: {
                  restaurantId: activeRestaurant,
                  guestName: form.guestName,
                  partySize: form.partySize,
                  start: form.start,
                },
              })
            }
          >
            Book table
          </Button>
          {createBooking.isError ? (
            <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              That slot is no longer available.
            </p>
          ) : null}
          {confirmation ? (
            <p className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 font-semibold text-emerald-800">
              <CalendarCheck size={18} /> {confirmation}
            </p>
          ) : null}
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-2xl font-bold">Existing bookings</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {bookings.data?.data.length ? (
              bookings.data.data.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="font-bold">{booking.guestName}</h3>
                  <p className="text-slate-600">
                    {restaurantName(
                      restaurants.data?.data,
                      booking.restaurantId,
                    )}{" "}
                    · {formatTime(booking.start)} · {booking.partySize} guests
                  </p>
                </article>
              ))
            ) : (
              <p className="text-slate-600">
                <Users className="mr-2 inline" size={18} />
                No bookings yet. Be the first tonight.
              </p>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
