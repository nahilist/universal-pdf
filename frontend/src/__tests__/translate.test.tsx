import React from "react";
import { render, screen } from "@testing-library/react";
import TranslatePage from "@/app/translate/page";

describe("Translate Page Component", () => {
  it("renders translate page header and dropzone", () => {
    render(<TranslatePage />);
    expect(screen.getByText("Translate your document")).toBeInTheDocument();
    expect(screen.getByText("Drop PDF here")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Hindi")).toBeInTheDocument();
  });
});
