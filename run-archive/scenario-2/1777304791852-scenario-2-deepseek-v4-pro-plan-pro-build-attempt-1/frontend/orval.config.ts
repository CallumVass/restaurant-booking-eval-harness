import { defineConfig } from "orval";

export default defineConfig({
  booking: {
    input: "./openapi/restaurant-booking.json",
    output: {
      target: "./src/generated/booking-client.ts",
      client: "react-query",
      clean: true,
      prettier: true,
      override: {
        query: {
          useQuery: true,
          useSuspenseQuery: false,
        },
        mutation: {
          useMutation: true,
        },
      },
    },
  },
});
