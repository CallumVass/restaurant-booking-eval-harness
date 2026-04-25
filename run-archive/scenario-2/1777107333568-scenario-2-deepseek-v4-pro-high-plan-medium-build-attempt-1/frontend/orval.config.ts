import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: './openapi.json',
    },
    output: {
      target: './src/api/endpoints.ts',
      schemas: './src/api/model',
      client: 'react-query',
      mode: 'tags-split',
      httpClient: 'fetch',
      clean: true,
      prettier: true,
    },
  },
});
