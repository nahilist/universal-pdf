import React from "react";
import { render, screen } from "@testing-library/react";
import TranslatePage from "@/app/translate/page";

jest.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    getToken: jest.fn().mockResolvedValue(null),
    isSignedIn: false,
    userId: null,
  }),
  SignedIn: () => null,
  SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  UserButton: () => <div data-testid="user-button">UserButton</div>,
}));

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
