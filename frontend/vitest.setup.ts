import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { beforeAll, afterEach, afterAll } from "vitest";

export const handlers = [
  // Intercept GET /api/users requests
  http.get(`${import.meta.env.BACKEND_URL}/api/current-user/`, () => {
    return HttpResponse.json({ user: {} });
  }),
];

const server = setupServer(...handlers);

// Start msw server before all tests
beforeAll(() => server.listen());
// Clost msw server after all tests finished
afterAll(() => server.close());
// Reset request handlers after each test
afterEach(() => server.resetHandlers());
