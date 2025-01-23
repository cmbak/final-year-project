import { describe, expect, it, vi } from "vitest";
import { render } from "../../test-utils";
import { screen } from "@testing-library/dom";
import ProtectedRoute from "./ProtectedRoute";
import { server } from "../../../vitest.setup";
import { http, HttpResponse } from "msw";
import Home from "../Home/Home";
import { Route, Routes } from "react-router";

describe("ProtectedRoute", () => {
  it("should redirect to login page if no user signed in", async () => {
    // Needs to return empty user object for there to be no logged in user
    server.use(
      http.get(`${import.meta.env.BACKEND_URL}/api/current-user/`, () => {
        return HttpResponse.json({ user: {} });
      }),
    );

    render(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>,
    );

    expect(window.location.href).toStrictEqual(
      `${import.meta.env.BACKEND_URL}/login/`,
    );
  });

  it("should show home page if user signed in", async () => {
    render(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>,
    );

    const homeText = await screen.findByText("Home");

    expect(homeText).to.exist;
  });

  it("should show error message if query throws error", async () => {
    server.use(
      http.get(`${import.meta.env.BACKEND_URL}/api/current-user/`, () => {
        return HttpResponse.error();
      }),
    );

    render(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>,
    );

    const errorMsg = await screen.findByText(/Error:/); // Match substring 'Error:'

    expect(errorMsg).to.exist;
  });
});
