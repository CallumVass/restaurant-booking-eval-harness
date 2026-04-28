import { defineConfig } from "orval";

export default defineConfig({
  booking: {
    input: "./openapi/restaurant-booking.json",
    output: {
      target: "./src/generated/booking-client.ts",
      client: "fetch",
      clean: true,
      prettier: true,
    },
  },
  "booking-hooks": {
    input: "./openapi/restaurant-booking.json",
    output: {
      target: "./src/generated/booking-hooks.ts",
      client: "react-query",
      httpClient: "fetch",
      clean: true,
      prettier: true,
    },
  },
});
