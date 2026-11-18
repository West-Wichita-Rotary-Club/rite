import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "../i18n.jsx";
import { AccountProvider } from "../context/AccountContext.jsx";
import { api } from "../api.js";
import { Account } from "./Account.jsx";

vi.mock("../api.js", () => ({
  api: {
    getAlumni: vi.fn(),
    getCurrentAccount: vi.fn(),
    registerAccount: vi.fn(),
    loginAccount: vi.fn(),
    logoutAccount: vi.fn(),
    updateAccountProfile: vi.fn()
  }
}));

const SIGNED_IN_PROFILE = {
  email: "pat@example.com",
  name: "Pat Lee",
  role: "teacher",
  country: "Panama",
  city: "",
  languages: "",
  years: "",
  bio: ""
};

beforeEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
  api.getAlumni.mockResolvedValue({
    countries: { panama: { label: { en: "Panama", es: "Panama" } } },
    functions: { teacher: { label: { en: "Teacher", es: "Docente" } } },
    profiles: []
  });
  api.getCurrentAccount.mockResolvedValue({ ok: false, status: 401, data: null });
});

function renderAccount() {
  return render(
    <LanguageProvider>
      <AccountProvider>
        <MemoryRouter initialEntries={["/account"]}>
          <Routes>
            <Route path="/account" element={<Account />} />
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>
      </AccountProvider>
    </LanguageProvider>
  );
}

describe("Account", () => {
  it("redirects to /login once the session check resolves signed-out", async () => {
    renderAccount();
    await waitFor(() => expect(screen.getByText("Login page")).toBeInTheDocument());
  });

  it("shows the dashboard summary and profile once signed in", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: SIGNED_IN_PROFILE });
    renderAccount();

    await waitFor(() => expect(screen.getByText("At a glance")).toBeInTheDocument());
    expect(screen.getByText("Not claimed")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Pat Lee")).toBeInTheDocument();
    expect(screen.getByText("You haven't claimed alumni status yet.")).toBeInTheDocument();
    expect(screen.getByText("You haven't shared any memories yet.")).toBeInTheDocument();
  });

  it("saves profile edits through the API", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: SIGNED_IN_PROFILE });
    api.updateAccountProfile.mockResolvedValue({
      ok: true,
      status: 200,
      data: { ...SIGNED_IN_PROFILE, name: "Pat Updated" }
    });
    renderAccount();
    await waitFor(() => expect(screen.getByDisplayValue("Pat Lee")).toBeInTheDocument());

    fireEvent.change(screen.getByDisplayValue("Pat Lee"), { target: { value: "Pat Updated" } });
    fireEvent.click(screen.getByText("Save details"));

    await waitFor(() => expect(screen.getByText("Details saved.")).toBeInTheDocument());
    expect(screen.getByDisplayValue("Pat Updated")).toBeInTheDocument();
    expect(api.updateAccountProfile).toHaveBeenCalled();
  });

  it("saves a memory locally and reflects it in the dashboard summary", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: SIGNED_IN_PROFILE });
    renderAccount();
    await waitFor(() => expect(screen.getByText("Share a memory")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Share a memory"));
    fireEvent.change(screen.getByLabelText("Memory title"), { target: { value: "My first seminar" } });
    fireEvent.change(screen.getByLabelText("Your story"), { target: { value: "It was unforgettable." } });
    fireEvent.click(screen.getByText("Save memory"));

    await waitFor(() => expect(screen.getByText("My first seminar")).toBeInTheDocument());
    expect(screen.getByText("Memories shared").previousSibling).toHaveTextContent("1");
  });
});
