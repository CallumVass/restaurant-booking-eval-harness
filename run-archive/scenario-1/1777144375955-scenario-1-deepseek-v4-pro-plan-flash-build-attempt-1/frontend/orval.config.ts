import { defineConfig } from 'orval'

export default defineConfig({
  'booking-api': {
    input: {
      target: './openapi.json',
    },
    output: {
      target: './src/api/booking-api.ts',
      client: 'react-query',
      httpClient: 'fetch',
      mode: 'single',
      override: {
        mutator: {
          path: './src/api/mutator.ts',
          name: 'customFetch',
        },
      },
    },
  },
})
