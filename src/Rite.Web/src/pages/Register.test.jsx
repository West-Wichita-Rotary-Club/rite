import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "../i18n.jsx";
import { AccountProvider } from "../context/AccountContext.jsx";
import { api } from "../api.js";
import { Register } from "./Register.jsx";

vi.mock("../api.js", () => ({
  api: {
    getCurrentAccount: vi.fn(),
    registerAccount: vi.fn(),
    loginAccount: vi.fn(),
    logoutAccount: vi.fn(),
    updateAccountProfile: vi.fn()
  }
}));

beforeEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
  api.getCurrentAccount.mockResolvedValue({ ok: false, status: 401, data: null });
});

function renderRegister() {
  return render(
    <LanguageProvider>
      <AccountProvider>
        <MemoryRouter initialEntries={["/register"]}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<div>Account page</div>} />
          </Routes>
        </MemoryRouter>
      </AccountProvider>
    </LanguageProvider>
  );
}

function fillForm() {
  fireEvent.change(screen.getByPlaceholderText("e.g. Maria Camarena"), { target: { value: "Pat Lee" } });
  fireEvent.change(screen.getByPlaceholderText("name@example.org"), { target: { value: "pat@example.com" } });
  fireEvent.change(screen.getByPlaceholderText("At least 8 characters"), { target: { value: "password1" } });
}

describe("Register", () => {
  it("creates an account and navigates to the account page", async () => {
    api.registerAccount.mockResolvedValue({
      ok: true,
      status: 200,
      data: { email: "pat@example.com", name: "Pat Lee" }
    });
    renderRegister();
    fillForm();
    fireEvent.click(screen.getByText("Create account"));

    await waitFor(() => expect(screen.getByText("Account page")).toBeInTheDocument());
    expect(api.registerAccount).toHaveBeenCalledWith(
      expect.objectContaining({ email: "pat@example.com", password: "password1", name: "Pat Lee" })
    );
  });

  it("shows the server's error for a duplicate email", async () => {
    api.registerAccount.mockResolvedValue({ ok: false, status: 409, data: { error: "duplicate-email" } });
    renderRegister();
    fillForm();
    fireEvent.click(screen.getByText("Create account"));

    await waitFor(() =>
      expect(screen.getByText("This email already has an account. Sign in instead.")).toBeInTheDocument()
    );
  });

  it("shows a weak-password error from the server", async () => {
    api.registerAccount.mockResolvedValue({ ok: false, status: 400, data: { error: "weak-password" } });
    renderRegister();
    fillForm();
    fireEvent.click(screen.getByText("Create account"));

    await waitFor(() =>
      expect(screen.getByText("Password must be at least 8 characters.")).toBeInTheDocument()
    );
  });
});
