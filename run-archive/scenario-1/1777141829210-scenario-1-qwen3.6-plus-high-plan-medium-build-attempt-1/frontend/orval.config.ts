import { defineConfig } from 'orval';

export default defineConfig({
  restaurant: {
    input: {
      target: './openapi/openapi.json',
    },
    output: {
      target: './src/api/generated.ts',
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'single',
      override: {
        mutator: {
          path: './src/api/custom-fetch.ts',
          name: 'customFetch',
        },
      },
    },
  },
});
