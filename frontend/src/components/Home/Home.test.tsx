import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./Home";

describe("Home", () => {
  it("should render home text", () => {
    render(<Home />);

    const homeText = screen.getByText("Home");

    expect(homeText).toBeVisible;
  });
});
