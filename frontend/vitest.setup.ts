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

  http.post(`${import.meta.env.BACKEND_URL}/logout/`, () => {
    // After logging out, /api/current-user/ will return an empty object
    // since there would be no signed in user
    user = {};
    return new HttpResponse(null, {
      status: 200,
    });
  }),
];

export const server = setupServer(...handlers);
const { location } = window;

// Start msw server before all tests
beforeAll(() => server.listen());

// Clost msw server after all tests finished
afterAll(() => server.close());

beforeEach(() =>
  // jsdom (used to emulate browser for tests) can't actually implement navigation between urls etc.
  // So the following code allows things such as window.location(.href) = ... to work without throwing any errors
  // https://stackoverflow.com/questions/59954101/jest-error-when-setting-or-assigning-window-location
  // https://www.joshmcarthur.com/til/2022/01/19/assert-windowlocation-properties-with-jest.html

  Object.defineProperty(window, "location", {
    value: new URL("http://localhost:3000"),
    writable: true, // Normal location property is read-only
  }),
);

afterEach(() => {
  // Reset request handlers after each test
  server.resetHandlers();
  // Need to reassign default location property just in case it has been modified by a test (e.g. by ProtecteRoute.test.tsx)
  window.location = location;
});
