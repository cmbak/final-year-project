import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/dom";
import { render } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";

describe("Navbar", async () => {
  it("should display name text", () => {
    render(<Navbar />);

    const nameText = screen.getByText("Name");

    expect(nameText).to.exist;
  });

  it("should display logout button", async () => {
    render(<Navbar />);

    // Need to wait for user data to be fetched and cause a rerender
    const logoutButton = await screen.findByText("logout");

    expect(logoutButton).to.exist;
  });

  it("should show login text after logout button pressed", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const logoutButton = await screen.findByText("logout");
    await user.click(logoutButton);

    expect(screen.getByText("login")).to.exist;
  });
});
