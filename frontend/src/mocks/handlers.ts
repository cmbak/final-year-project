import { http, HttpResponse } from "msw";
import { AnonymousUser, User } from "../../src/types";

// User to be used in responses
let user: User | AnonymousUser = {
  id: 1,
  email: "test.user@gmail.com",
  username: "testuser",
};

// Handlers for signed in user
export const handlers = [
  http.get(`${import.meta.env.VITE_BACKEND_URL}/api/current-user/`, () => {
    return HttpResponse.json({ user: user });
  }),

  http.post(`${import.meta.env.VITE_BACKEND_URL}/logout/`, () => {
    // After logging out, /api/current-user/ will return an empty object
    // since there would be no signed in user
    user = {};
    return new HttpResponse(null, {
      status: 200,
    });
  }),
];
