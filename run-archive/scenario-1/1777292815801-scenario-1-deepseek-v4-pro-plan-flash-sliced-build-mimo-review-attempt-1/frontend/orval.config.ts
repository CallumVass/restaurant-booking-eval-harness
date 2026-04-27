import { defineConfig } from 'orval'

export default defineConfig({
  bookingApi: {
    input: {
      target: '../backend/Api/openapi.json',
    },
    output: {
      target: './src/api/booking-api.ts',
      client: 'react-query',
      httpClient: 'fetch',
      baseUrl: '/api',
      override: {
        mutator: {
          path: './src/api/mutator.ts',
          name: 'customFetch',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
})
