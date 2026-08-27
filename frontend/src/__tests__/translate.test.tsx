import React from "react";
import { render, screen } from "@testing-library/react";
import TranslatePage from "@/app/translate/page";

describe("Translate Page Component", () => {
  it("renders translate page header and dropzone", () => {
    render(<TranslatePage />);
    expect(
      screen.getByRole("heading", {
        name: "Translate your PDF without losing its structure.",
      })
    ).toBeInTheDocument();
    expect(screen.getByText("Drop PDF here")).toBeInTheDocument();
    expect(screen.getByLabelText("Translate from")).toHaveValue("auto");
    expect(screen.getByLabelText("Translate to")).toHaveValue("hi");
  });
});
