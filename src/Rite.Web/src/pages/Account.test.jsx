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
    updateAccountProfile: vi.fn(),
    getClaim: vi.fn(),
    saveClaim: vi.fn(),
    withdrawClaim: vi.fn(),
    listMemories: vi.fn(),
    createMemory: vi.fn(),
    updateMemory: vi.fn(),
    deleteMemory: vi.fn()
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
    functions: {
      leader: { label: { en: "Leader", es: "Lider" } },
      host: { label: { en: "Host", es: "Anfitrion" } },
      teacher: { label: { en: "Teacher", es: "Docente" } }
    },
    profiles: []
  });
  api.getCurrentAccount.mockResolvedValue({ ok: false, status: 401, data: null });
  api.getClaim.mockResolvedValue({ ok: true, status: 204, data: null });
  api.listMemories.mockResolvedValue({ ok: true, status: 200, data: [] });
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

  it("shows an error, not a silent no-op, when the profile update fails", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: SIGNED_IN_PROFILE });
    api.updateAccountProfile.mockResolvedValue({ ok: false, status: 401, data: null });
    renderAccount();
    await waitFor(() => expect(screen.getByDisplayValue("Pat Lee")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Save details"));

    await waitFor(() =>
      expect(screen.getByText("Something went wrong saving your details. Try again.")).toBeInTheDocument()
    );
    expect(screen.queryByText("Details saved.")).not.toBeInTheDocument();
  });

  it("shares a memory through the API and reflects it in the dashboard summary", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: SIGNED_IN_PROFILE });
    api.createMemory.mockResolvedValue({
      ok: true,
      status: 200,
      data: { id: "m1", title: "My first seminar", text: "It was unforgettable.", photos: [] }
    });
    renderAccount();
    await waitFor(() => expect(screen.getByText("Share a memory")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Share a memory"));
    fireEvent.change(screen.getByLabelText("Memory title"), { target: { value: "My first seminar" } });
    fireEvent.change(screen.getByLabelText("Your story"), { target: { value: "It was unforgettable." } });
    fireEvent.click(screen.getByText("Save memory"));

    await waitFor(() => expect(screen.getByText("My first seminar")).toBeInTheDocument());
    expect(screen.getByText("Memories shared").previousSibling).toHaveTextContent("1");
    expect(api.createMemory).toHaveBeenCalledWith({
      title: "My first seminar",
      text: "It was unforgettable.",
      keepPhotoIds: [],
      newPhotos: []
    });
  });

  it("shows an error, not a silent no-op, when sharing a memory fails", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: SIGNED_IN_PROFILE });
    api.createMemory.mockResolvedValue({ ok: false, status: 400, data: { error: "invalid-memory" } });
    renderAccount();
    await waitFor(() => expect(screen.getByText("Share a memory")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Share a memory"));
    fireEvent.change(screen.getByLabelText("Memory title"), { target: { value: "My first seminar" } });
    fireEvent.change(screen.getByLabelText("Your story"), { target: { value: "It was unforgettable." } });
    fireEvent.click(screen.getByText("Save memory"));

    await waitFor(() =>
      expect(screen.getByText("Something went wrong saving your memory. Try again.")).toBeInTheDocument()
    );
    expect(screen.queryByText("My first seminar")).not.toBeInTheDocument();
  });

  it("saves a claim through the API and shows it as pending review", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: SIGNED_IN_PROFILE });
    api.saveClaim.mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        country: "panama",
        participation: [{ role: "teacher", yearFrom: 2015, yearTo: null }],
        matchedProfileId: "",
        selfDeclaredName: "Pat Lee"
      }
    });
    renderAccount();
    await waitFor(() => expect(screen.getByText("You haven't claimed alumni status yet.")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: "Claim your alumni status" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Country" }), { target: { value: "panama" } });
    fireEvent.change(screen.getByLabelText("Role"), { target: { value: "teacher" } });
    fireEvent.change(screen.getByLabelText("Year"), { target: { value: "2015" } });
    fireEvent.change(screen.getByLabelText("Your name for this claim"), { target: { value: "Pat Lee" } });
    fireEvent.click(screen.getByText("Save claim"));

    await waitFor(() => expect(screen.getByText("Pending review")).toBeInTheDocument());
    expect(api.saveClaim).toHaveBeenCalledWith({
      country: "panama",
      participation: [{ role: "teacher", yearFrom: 2015, yearTo: null }],
      matchedProfileId: "",
      selfDeclaredName: "Pat Lee"
    });
  });

  it("shows an approved claim with the approved badge, not pending", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: SIGNED_IN_PROFILE });
    api.getClaim.mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        country: "panama",
        participation: [{ role: "teacher", yearFrom: 2015, yearTo: null }],
        matchedProfileId: "",
        selfDeclaredName: "Pat Lee",
        status: "approved",
        rejectionReason: null
      }
    });
    renderAccount();

    // "Approved" appears both in the dashboard summary's claim-status tile and
    // the claim panel's own badge.
    await waitFor(() => expect(screen.getAllByText("Approved")).toHaveLength(2));
    expect(screen.queryByText("Pending review")).not.toBeInTheDocument();
  });

  it("shows a rejected claim's reason to the member", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: SIGNED_IN_PROFILE });
    api.getClaim.mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        country: "panama",
        participation: [{ role: "teacher", yearFrom: 2015, yearTo: null }],
        matchedProfileId: "",
        selfDeclaredName: "Pat Lee",
        status: "rejected",
        rejectionReason: "Years don't match our records"
      }
    });
    renderAccount();

    await waitFor(() => expect(screen.getAllByText("Rejected")).toHaveLength(2));
    expect(screen.getByText(/Years don't match our records/)).toBeInTheDocument();
  });

  it("shows a rejected memory's reason to the member", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: SIGNED_IN_PROFILE });
    api.listMemories.mockResolvedValue({
      ok: true,
      status: 200,
      data: [
        {
          id: "m1",
          title: "My first seminar",
          text: "It was unforgettable.",
          photos: [],
          status: "rejected",
          rejectionReason: "Please add more context"
        }
      ]
    });
    renderAccount();

    await waitFor(() => expect(screen.getByText("My first seminar")).toBeInTheDocument());
    expect(screen.getByText("Rejected")).toBeInTheDocument();
    expect(screen.getByText(/Please add more context/)).toBeInTheDocument();
  });
});
