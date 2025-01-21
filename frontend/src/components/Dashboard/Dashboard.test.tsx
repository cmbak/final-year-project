import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Dashboard from "./Dashboard";

describe("Dashboard", () => {
  it("should have the dashboard text", () => {
    render(<Dashboard />);

    const dashboardText = screen.getByText("Dashboard");

    expect(dashboardText).to.exist;
  });
});
