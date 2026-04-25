import { defineConfig } from 'orval';

export default defineConfig({
  restaurantBooking: {
    input: {
      target: './openapi.json',
    },
    output: {
      target: './src/api/client.ts',
      schemas: './src/api/model',
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'split',
      baseUrl: 'http://localhost:5100',
      override: {
        mutator: {
          path: './src/api/custom-fetch.ts',
          name: 'customFetch',
        },
      },
    },
  },
});
