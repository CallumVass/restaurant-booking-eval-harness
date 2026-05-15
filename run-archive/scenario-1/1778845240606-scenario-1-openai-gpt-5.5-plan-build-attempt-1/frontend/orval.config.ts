import { defineConfig } from "orval";

export default defineConfig({
  booking: {
    input: "./openapi.json",
    output: {
      target: "./src/api/generated.ts",
      client: "react-query",
      httpClient: "fetch",
    },
  },
});
