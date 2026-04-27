import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: './openapi.json',
    },
    output: {
      mode: 'tags',
      target: 'src/api/generated.ts',
      schemas: 'src/api/schemas',
      client: 'react-query',
      httpClient: 'fetch',
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: 'src/api/mutator.ts',
          name: 'customFetch',
        },
      },
    },
  },
});
