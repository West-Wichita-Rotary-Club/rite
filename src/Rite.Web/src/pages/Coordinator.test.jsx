import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LanguageProvider } from "../i18n.jsx";
import { AccountProvider } from "../context/AccountContext.jsx";
import { api } from "../api.js";
import { Coordinator } from "./Coordinator.jsx";

vi.mock("../api.js", () => ({
  api: {
    getCurrentAccount: vi.fn(),
    registerAccount: vi.fn(),
    loginAccount: vi.fn(),
    logoutAccount: vi.fn(),
    updateAccountProfile: vi.fn(),
    listAccounts: vi.fn(),
    deactivateAccount: vi.fn(),
    reactivateAccount: vi.fn(),
    getClaim: vi.fn(),
    listMemories: vi.fn(),
    listPendingClaims: vi.fn(),
    approveClaim: vi.fn(),
    rejectClaim: vi.fn(),
    listPendingMemories: vi.fn(),
    approveMemory: vi.fn(),
    rejectMemory: vi.fn()
  }
}));

const COORDINATOR_PROFILE = {
  email: "lead@example.com",
  name: "Lead Coordinator",
  role: "coordinator",
  country: "",
  city: "",
  languages: "",
  years: "",
  bio: "",
  isCoordinator: true
};

const NON_COORDINATOR_PROFILE = { ...COORDINATOR_PROFILE, email: "pat@example.com", isCoordinator: false };

const USERS = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "lead@example.com",
    name: "Lead Coordinator",
    role: "coordinator",
    isActive: true,
    isCoordinator: true,
    createdAt: "2026-01-01T00:00:00Z"
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    email: "someone@example.com",
    name: "Someone Else",
    role: "teacher",
    isActive: true,
    isCoordinator: false,
    createdAt: "2026-01-02T00:00:00Z"
  }
];

beforeEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
  api.getClaim.mockResolvedValue({ ok: true, status: 204, data: null });
  api.listMemories.mockResolvedValue({ ok: true, status: 200, data: [] });
  api.listPendingClaims.mockResolvedValue({ ok: true, status: 200, data: [] });
  api.listPendingMemories.mockResolvedValue({ ok: true, status: 200, data: [] });
});

function renderCoordinator() {
  return render(
    <LanguageProvider>
      <AccountProvider>
        <MemoryRouter initialEntries={["/coordinator"]}>
          <Routes>
            <Route path="/coordinator" element={<Coordinator />} />
            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>
      </AccountProvider>
    </LanguageProvider>
  );
}

describe("Coordinator", () => {
  it("redirects to /login when signed out", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: false, status: 401, data: null });
    renderCoordinator();
    await waitFor(() => expect(screen.getByText("Login page")).toBeInTheDocument());
  });

  it("shows a forbidden notice for a signed-in non-coordinator", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: NON_COORDINATOR_PROFILE });
    renderCoordinator();
    await waitFor(() =>
      expect(screen.getByText("Only coordinators can see this page.")).toBeInTheDocument()
    );
    expect(api.listAccounts).not.toHaveBeenCalled();
  });

  it("lists every account for a coordinator", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: COORDINATOR_PROFILE });
    api.listAccounts.mockResolvedValue({ ok: true, status: 200, data: USERS });
    renderCoordinator();

    await waitFor(() => expect(screen.getByText("someone@example.com")).toBeInTheDocument());
    expect(screen.getByText("lead@example.com")).toBeInTheDocument();
    expect(screen.getAllByText("Active")).toHaveLength(2);
  });

  it("deactivates an account after confirmation", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: COORDINATOR_PROFILE });
    api.listAccounts.mockResolvedValue({ ok: true, status: 200, data: USERS });
    api.deactivateAccount.mockResolvedValue({
      ok: true,
      status: 200,
      data: { ...USERS[1], isActive: false }
    });
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderCoordinator();
    await waitFor(() => expect(screen.getByText("someone@example.com")).toBeInTheDocument());

    const row = screen.getByText("someone@example.com").closest("tr");
    fireEvent.click(within(row).getByText("Deactivate"));

    await waitFor(() => expect(screen.getByText("Deactivated")).toBeInTheDocument());
    expect(api.deactivateAccount).toHaveBeenCalledWith(USERS[1].id);
  });

  it("does not deactivate when the confirmation is declined", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: COORDINATOR_PROFILE });
    api.listAccounts.mockResolvedValue({ ok: true, status: 200, data: USERS });
    vi.spyOn(window, "confirm").mockReturnValue(false);

    renderCoordinator();
    await waitFor(() => expect(screen.getByText("someone@example.com")).toBeInTheDocument());

    fireEvent.click(screen.getAllByText("Deactivate")[0]);

    expect(api.deactivateAccount).not.toHaveBeenCalled();
  });

  it("shows an error when the account list fails to load", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: COORDINATOR_PROFILE });
    api.listAccounts.mockResolvedValue({ ok: false, status: 403, data: null });

    renderCoordinator();
    await waitFor(() =>
      expect(
        screen.getByText("Could not load the account list. Confirm you're signed in as a coordinator.")
      ).toBeInTheDocument()
    );
  });

  it("shows an empty review queue when nothing is pending", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: COORDINATOR_PROFILE });
    api.listAccounts.mockResolvedValue({ ok: true, status: 200, data: USERS });

    renderCoordinator();
    await waitFor(() => expect(screen.getAllByText("Nothing is waiting for review.")).toHaveLength(2));
  });

  it("lists pending claims and approves one", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: COORDINATOR_PROFILE });
    api.listAccounts.mockResolvedValue({ ok: true, status: 200, data: USERS });
    const claim = {
      id: "claim-1",
      submitterEmail: "someone@example.com",
      submitterName: "Someone Else",
      country: "panama",
      participation: [{ role: "teacher", yearFrom: 2015, yearTo: null }],
      selfDeclaredName: "Someone Else"
    };
    api.listPendingClaims.mockResolvedValue({ ok: true, status: 200, data: [claim] });
    api.approveClaim.mockResolvedValue({ ok: true, status: 200, data: null });

    renderCoordinator();
    await waitFor(() => expect(screen.getByText(/Someone Else \(someone@example.com\)/)).toBeInTheDocument());

    fireEvent.click(screen.getByText("Approve"));

    await waitFor(() => expect(api.approveClaim).toHaveBeenCalledWith("claim-1"));
    await waitFor(() => expect(screen.queryByText(/Someone Else \(someone@example.com\)/)).not.toBeInTheDocument());
  });

  it("rejects a pending memory with a reason", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: COORDINATOR_PROFILE });
    api.listAccounts.mockResolvedValue({ ok: true, status: 200, data: USERS });
    const memory = {
      id: "memory-1",
      submitterEmail: "someone@example.com",
      submitterName: "Someone Else",
      title: "My first seminar",
      text: "It was unforgettable."
    };
    api.listPendingMemories.mockResolvedValue({ ok: true, status: 200, data: [memory] });
    api.rejectMemory.mockResolvedValue({ ok: true, status: 200, data: null });
    vi.spyOn(window, "prompt").mockReturnValue("Please add more context");

    renderCoordinator();
    await waitFor(() => expect(screen.getByText("My first seminar")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Reject"));

    await waitFor(() => expect(api.rejectMemory).toHaveBeenCalledWith("memory-1", "Please add more context"));
    await waitFor(() => expect(screen.queryByText("My first seminar")).not.toBeInTheDocument());
  });

  it("requires a non-blank reason to reject a claim", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: COORDINATOR_PROFILE });
    api.listAccounts.mockResolvedValue({ ok: true, status: 200, data: USERS });
    const claim = {
      id: "claim-1",
      submitterEmail: "someone@example.com",
      submitterName: "Someone Else",
      country: "panama",
      participation: [],
      selfDeclaredName: "Someone Else"
    };
    api.listPendingClaims.mockResolvedValue({ ok: true, status: 200, data: [claim] });
    vi.spyOn(window, "prompt").mockReturnValue("   ");

    renderCoordinator();
    await waitFor(() => expect(screen.getByText(/Someone Else \(someone@example.com\)/)).toBeInTheDocument());

    fireEvent.click(screen.getByText("Reject"));

    await waitFor(() => expect(screen.getByText("A reason is required to reject.")).toBeInTheDocument());
    expect(api.rejectClaim).not.toHaveBeenCalled();
  });
});
