import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "../i18n.jsx";
import { AccountProvider, useAccount } from "../context/AccountContext.jsx";
import { api } from "../api.js";
import { Account } from "./Account.jsx";

vi.mock("../api.js", () => ({
  api: {
    getAlumni: vi.fn()
  }
}));

beforeEach(() => {
  window.localStorage.clear();
  api.getAlumni.mockResolvedValue({
    countries: { panama: { label: { en: "Panama", es: "Panama" } } },
    functions: { teacher: { label: { en: "Teacher", es: "Docente" } } },
    profiles: []
  });
});

function Seed() {
  const { register } = useAccount();
  return (
    <button
      onClick={() => register("pat@example.com", { name: "Pat Lee", role: "teacher", country: "Panama" })}
    >
      seed
    </button>
  );
}

// Registering through the real Login/Register pages navigates to /account
// afterward; a bare useAccount().register() call here does not, so seeding
// must happen in localStorage *before* Account mounts — not by registering
// after Account has already redirected to /login — or the test would be
// asserting against a route a real user could never reach this way either.
function seedAccount() {
  render(
    <AccountProvider>
      <Seed />
    </AccountProvider>
  );
  fireEvent.click(screen.getByText("seed"));
  cleanup();
}

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
  it("redirects to /login when signed out", () => {
    renderAccount();
    expect(screen.getByText("Login page")).toBeInTheDocument();
  });

  it("shows the dashboard summary and profile once signed in", async () => {
    seedAccount();
    renderAccount();

    await waitFor(() => expect(screen.getByText("At a glance")).toBeInTheDocument());
    expect(screen.getByText("Not claimed")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Pat Lee")).toBeInTheDocument();
    expect(screen.getByText("You haven't claimed alumni status yet.")).toBeInTheDocument();
    expect(screen.getByText("You haven't shared any memories yet.")).toBeInTheDocument();
  });

  it("saves profile edits", async () => {
    seedAccount();
    renderAccount();
    await waitFor(() => expect(screen.getByDisplayValue("Pat Lee")).toBeInTheDocument());

    fireEvent.change(screen.getByDisplayValue("Pat Lee"), { target: { value: "Pat Updated" } });
    fireEvent.click(screen.getByText("Save details"));

    await waitFor(() => expect(screen.getByText("Details saved in this browser.")).toBeInTheDocument());
    expect(screen.getByDisplayValue("Pat Updated")).toBeInTheDocument();
  });

  it("saves a memory and reflects it in the dashboard summary", async () => {
    seedAccount();
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
