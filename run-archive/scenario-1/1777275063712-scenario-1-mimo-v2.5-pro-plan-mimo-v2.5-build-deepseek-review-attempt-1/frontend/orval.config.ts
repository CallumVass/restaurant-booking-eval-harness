import { defineConfig } from 'orval';

export default defineConfig({
  restaurantBooking: {
    input: {
      target: './openapi.json',
    },
    output: {
      target: './src/api/endpoints.ts',
      schemas: './src/api/model',
      client: 'react-query',
      httpClient: 'fetch',
      baseUrl: '',
      clean: true,
    },
  },
});
