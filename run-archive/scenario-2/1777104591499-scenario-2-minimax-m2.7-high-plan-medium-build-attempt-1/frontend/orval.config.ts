import { defineConfig } from "orval";

export default defineConfig({
  restaurantApi: {
    input: {
      target: "./openapi.json",
    },
    output: {
      target: "./src/api/client.ts",
      schemas: "./src/api/model",
      client: "react-query",
      mock: false,
    },
    hooks: {
      afterAllFilesWrite: "prettier --write",
    },
  },
});
