import { describe, expect, it, vi } from "vitest";
import { render } from "../../test-utils";
import { screen } from "@testing-library/dom";
import ProtectedRoute from "./ProtectedRoute";
import { server } from "../../../vitest.setup";
import { http, HttpResponse } from "msw";
import Home from "../Home/Home";
import { Route, Routes } from "react-router";

describe("ProtectedRoute", () => {
  it("should redirect to login page if no user signed in", () => {
    // Can't navigate from ProtectedRoute component to login url
    // So just need to allow window.location to be changed
    // And assert its new value
    // https://stackoverflow.com/questions/59954101/jest-error-when-setting-or-assigning-window-location
    // https://www.joshmcarthur.com/til/2022/01/19/assert-windowlocation-properties-with-jest.html

    Object.defineProperty(window, "location", {
      writable: true,
      value: { assign: vi.fn() }, // Prevents actual implementation from being called (can't navigate in jsdom)
    });

    // Needs to return empty user object for there to be no logged in user
    server.use(
      http.get(`${import.meta.env.BACKEND_URL}/api/current-user/`, () =>
        HttpResponse.json({ user: {} }),
      ),
    );
    render(<ProtectedRoute />);

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
});
