/// <reference types="vite/types/importMeta.d.ts" />

import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { beforeAll, afterEach, afterAll, beforeEach } from "vitest";
import { AnonymousUser, User } from "./src/types";

// User to be used in responses
let user: User | AnonymousUser = {
  id: 1,
  email: "test.user@gmail.com",
  username: "testuser",
};

// Handlers for signed in user
export const handlers = [
  http.get(`${import.meta.env.BACKEND_URL}/api/current-user/`, () => {
    return HttpResponse.json({ user: user });
  }),

  http.post(`${import.meta.env.BACKEND_URL}/logout/`, ({ request }) => {
    // After logging out, /api/current-user/ will return an empty object
    // since there would be no signed in user
    user = {};
    return new HttpResponse(null, {
      status: 200,
    });
  }),

  http.get(`${import.meta.env.BACKEND_URL}/login/`, () => {
    return HttpResponse.json({ user: user });
  }),
];

export const server = setupServer(...handlers);
const { location } = window;

// Start msw server before all tests
beforeAll(() => server.listen());

// Clost msw server after all tests finished
afterAll(() => server.close());

// Reset request handlers after each test
afterEach(() => server.resetHandlers());

// Need to reassign default location property just in case it has been modified by a test (see ProtecteRoute.test.tsx)
beforeEach(() => (window.location = location));
