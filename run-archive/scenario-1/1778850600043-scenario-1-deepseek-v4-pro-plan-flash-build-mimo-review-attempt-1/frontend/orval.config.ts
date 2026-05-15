import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "./openapi.json",
    },
    output: {
      client: "react-query",
      httpClient: "fetch",
      mode: "tags-split",
      target: "./src/api/generated/endpoints.ts",
      schemas: "./src/api/generated/schemas",
      clean: true,
      mock: false,
      prettier: true,
      indexFiles: false,
      baseUrl: "http://localhost:5111",
    },
  },
});
