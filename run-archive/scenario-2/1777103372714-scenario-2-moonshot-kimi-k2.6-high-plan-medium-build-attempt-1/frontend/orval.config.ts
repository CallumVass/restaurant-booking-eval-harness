import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: {
      target: './openapi.json',
    },
    output: {
      target: './src/api',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'tags',
      clean: true,
      baseUrl: '',
    },
  },
})
