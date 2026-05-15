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
        mutator: {
          path: "./src/lib/api-mutator.ts",
          name: "apiFetch",
        },
        query: {
          useQuery: true,
          useMutation: true,
          useSuspenseQuery: false,
          useSuspenseInfiniteQuery: false,
          usePrefetch: false,
          useInvalidate: false,
        },
      },
    },
  },
});
