import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../i18n.jsx";
import { AccountProvider } from "../context/AccountContext.jsx";
import { Register } from "./Register.jsx";

beforeEach(() => {
  window.localStorage.clear();
});

function renderRegister() {
  return render(
    <LanguageProvider>
      <AccountProvider>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AccountProvider>
    </LanguageProvider>
  );
}

describe("Register", () => {
  it("creates an account and shows a confirmation", async () => {
    renderRegister();
    fireEvent.change(screen.getByPlaceholderText("e.g. Maria Camarena"), { target: { value: "Pat Lee" } });
    fireEvent.change(screen.getByPlaceholderText("name@example.org"), { target: { value: "pat@example.com" } });
    fireEvent.click(screen.getByText("Create account"));

    await waitFor(() => expect(screen.getByText("Details saved in this browser.")).toBeInTheDocument());
  });

  it("rejects a duplicate email", async () => {
    renderRegister();
    fireEvent.change(screen.getByPlaceholderText("e.g. Maria Camarena"), { target: { value: "Pat Lee" } });
    fireEvent.change(screen.getByPlaceholderText("name@example.org"), { target: { value: "pat@example.com" } });
    fireEvent.click(screen.getByText("Create account"));
    await waitFor(() => expect(screen.getByText("Details saved in this browser.")).toBeInTheDocument());

    fireEvent.change(screen.getByPlaceholderText("name@example.org"), { target: { value: "pat@example.com" } });
    fireEvent.click(screen.getByText("Create account"));

    await waitFor(() =>
      expect(
        screen.getByText("This email already has an account in this browser. Sign in instead.")
      ).toBeInTheDocument()
    );
  });
});
