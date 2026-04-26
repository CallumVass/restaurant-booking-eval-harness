import { defineConfig } from "orval";

export default defineConfig({
  booking: {
    input: "./openapi/restaurant-booking.json",
    output: {
      target: "./src/generated/booking-client.ts",
      client: "react-query",
      clean: true,
      prettier: true,
      httpClient: "fetch",
      override: {
        mutator: {
          path: "./src/lib/api-fetch.ts",
          name: "apiFetch",
        },
      },
    },
  },
});
