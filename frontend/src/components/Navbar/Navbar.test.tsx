import { describe, it } from "vitest";
import { screen } from "@testing-library/dom";
import { providerRenderer } from "../../test-utils";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("should display Name text", async () => {
    providerRenderer(<Navbar />);

    screen.debug();
  });
});
