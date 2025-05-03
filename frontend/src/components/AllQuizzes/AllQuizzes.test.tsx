import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Dashboard from "./AllQuizzes";
import { render } from "../../test-utils";

describe("Dashboard", () => {
  it("should have the dashboard text", async () => {
    render(<Dashboard />);

    const dashboardText = await screen.findByText("quizzes");

    expect(dashboardText).toBeVisible;
  });
});
