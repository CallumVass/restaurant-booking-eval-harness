import { defineConfig } from 'orval';

export default defineConfig({
  booking: {
    input: './openapi.json',
    output: {
      target: './src/api/booking-api.ts',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/lib/api-client.ts',
          name: 'axiosInstance',
        },
      },
    },
  },
});
