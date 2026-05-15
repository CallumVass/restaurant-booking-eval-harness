import { defineConfig } from "orval";

export default defineConfig({
  booking: {
    input: "./openapi/restaurant-booking.json",
    output: {
      target: "./src/generated/booking-client.ts",
      client: "react-query",
      httpClient: "fetch",
      clean: true,
      prettier: true,
      override: {
        fetch: {
          includeHttpResponseReturnType: true,
        },
      },
    },
  },
});
