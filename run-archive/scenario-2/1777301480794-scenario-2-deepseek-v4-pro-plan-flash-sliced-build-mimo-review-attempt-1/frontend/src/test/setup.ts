import "@testing-library/jest-dom/vitest";
import { setupServer } from "msw/node";
import { handlers } from "./mocks";
import { beforeAll, afterAll, afterEach } from "vitest";

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
