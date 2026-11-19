import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "../i18n.jsx";
import { AccountProvider } from "../context/AccountContext.jsx";
import { api } from "../api.js";
import { Login } from "./Login.jsx";

vi.mock("../api.js", () => ({
  api: {
    getCurrentAccount: vi.fn(),
    registerAccount: vi.fn(),
    loginAccount: vi.fn(),
    logoutAccount: vi.fn(),
    updateAccountProfile: vi.fn(),
    getClaim: vi.fn(),
    listMemories: vi.fn()
  }
}));

beforeEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
  api.getCurrentAccount.mockResolvedValue({ ok: false, status: 401, data: null });
  api.getClaim.mockResolvedValue({ ok: true, status: 204, data: null });
  api.listMemories.mockResolvedValue({ ok: true, status: 200, data: [] });
});

function renderLogin() {
  return render(
    <LanguageProvider>
      <AccountProvider>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<div>Account page</div>} />
          </Routes>
        </MemoryRouter>
      </AccountProvider>
    </LanguageProvider>
  );
}

function submitLogin(email, password) {
  fireEvent.change(screen.getByPlaceholderText("name@example.org"), { target: { value: email } });
  fireEvent.change(screen.getByPlaceholderText("At least 8 characters"), { target: { value: password } });
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
}

describe("Login", () => {
  it("shows an invalid-credentials error for an unknown email", async () => {
    api.loginAccount.mockResolvedValue({ ok: false, status: 401, data: null });
    renderLogin();
    submitLogin("nobody@example.com", "password1");

    await waitFor(() => expect(screen.getByText("Invalid email or password.")).toBeInTheDocument());
  });

  it("signs in with the right credentials and navigates to the account page", async () => {
    api.loginAccount.mockResolvedValue({
      ok: true,
      status: 200,
      data: { email: "pat@example.com", name: "Pat Lee" }
    });
    renderLogin();
    submitLogin("pat@example.com", "password1");

    await waitFor(() => expect(screen.getByText("Account page")).toBeInTheDocument());
    expect(api.loginAccount).toHaveBeenCalledWith({ email: "pat@example.com", password: "password1" });
  });
});
