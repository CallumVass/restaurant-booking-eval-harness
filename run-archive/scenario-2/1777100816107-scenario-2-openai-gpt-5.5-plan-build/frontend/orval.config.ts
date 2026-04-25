import { defineConfig } from "orval";

export default defineConfig({
  restaurantBooking: {
    input: {
      target: "./openapi/restaurant-booking.json",
    },
    output: {
      target: "./src/api/generated/restaurant-booking.ts",
      client: "react-query",
      httpClient: "fetch",
      mode: "single",
      clean: true,
      prettier: true,
      baseUrl: "http://localhost:5062",
    },
  },
});
