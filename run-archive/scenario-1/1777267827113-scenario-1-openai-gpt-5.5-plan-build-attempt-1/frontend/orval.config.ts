import { defineConfig } from "orval";

export default defineConfig({
  restaurantBooking: {
    input: {
      target: "./openapi/restaurant-booking.openapi.json",
    },
    output: {
      target: "./src/api/generated/restaurant-booking.ts",
      client: "fetch",
      mode: "single",
      clean: true,
      prettier: true,
      baseUrl: "/api",
    },
  },
});
