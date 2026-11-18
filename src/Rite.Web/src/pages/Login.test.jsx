import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LanguageProvider } from "../i18n.jsx";
import { AccountProvider, useAccount } from "../context/AccountContext.jsx";
import { Login } from "./Login.jsx";

beforeEach(() => {
  window.localStorage.clear();
});

function Seed() {
  const { register, signOut } = useAccount();
  return (
    <button
      onClick={() => {
        register("pat@example.com", { name: "Pat Lee" });
        signOut();
      }}
    >
      seed
    </button>
  );
}

function renderLogin() {
  return render(
    <LanguageProvider>
      <AccountProvider>
        <MemoryRouter>
          <Seed />
          <Login />
        </MemoryRouter>
      </AccountProvider>
    </LanguageProvider>
  );
}

describe("Login", () => {
  it("rejects an email with no matching account", async () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText("name@example.org"), { target: { value: "nobody@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() =>
      expect(screen.getByText("No account found for this email in this browser. Register first.")).toBeInTheDocument()
    );
  });

  it("signs in a known account", async () => {
    renderLogin();
    fireEvent.click(screen.getByText("seed"));
    fireEvent.change(screen.getByPlaceholderText("name@example.org"), { target: { value: "pat@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() =>
      expect(screen.queryByText("No account found for this email in this browser. Register first.")).not.toBeInTheDocument()
    );
  });
});
