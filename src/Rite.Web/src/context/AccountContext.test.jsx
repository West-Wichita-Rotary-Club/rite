import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AccountProvider, useAccount } from "./AccountContext.jsx";
import { api } from "../api.js";

vi.mock("../api.js", () => ({
  api: {
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

const PROFILE = {
  email: "pat@example.com",
  name: "Pat",
  role: "teacher",
  country: "",
  city: "",
  languages: "",
  years: "",
  bio: ""
};

beforeEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
  api.getCurrentAccount.mockResolvedValue({ ok: false, status: 401, data: null });
  api.registerAccount.mockResolvedValue({ ok: true, status: 200, data: PROFILE });
  api.logoutAccount.mockResolvedValue({ ok: true, status: 200, data: null });
  api.getClaim.mockResolvedValue({ ok: true, status: 204, data: null });
  api.listMemories.mockResolvedValue({ ok: true, status: 200, data: [] });
});

function Probe() {
  const { account, status, register, signIn, signOut, updateProfile, saveClaim, saveMemory } = useAccount();
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="email">{account?.email ?? "none"}</span>
      <span data-testid="name">{account?.name ?? ""}</span>
      <span data-testid="memories">{account?.memories?.length ?? 0}</span>
      <span data-testid="claim">{account?.claim ? "claimed" : "none"}</span>
      <button onClick={() => register({ email: "pat@example.com", password: "password1", name: "Pat" })}>
        register
      </button>
      <button onClick={() => signIn("pat@example.com", "password1")}>sign in</button>
      <button onClick={() => signOut()}>sign out</button>
      <button onClick={() => updateProfile({ name: "Pat Updated" })}>update</button>
      <button onClick={() => saveClaim({ country: "panama", participation: [], matchedProfileId: "", selfDeclaredName: "" })}>
        claim
      </button>
      <button onClick={() => saveMemory({ id: null, title: "Trip", text: "...", photos: [] }, true)}>memory</button>
    </div>
  );
}

function renderProbe() {
  return render(
    <AccountProvider>
      <Probe />
    </AccountProvider>
  );
}

describe("AccountProvider", () => {
  it("starts signed out and resolves to ready once the session check completes", async () => {
    renderProbe();
    expect(screen.getByTestId("status")).toHaveTextContent("loading");
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("ready"));
    expect(screen.getByTestId("email")).toHaveTextContent("none");
  });

  it("restores a signed-in account from an existing session cookie", async () => {
    api.getCurrentAccount.mockResolvedValue({ ok: true, status: 200, data: PROFILE });
    renderProbe();
    await waitFor(() => expect(screen.getByTestId("email")).toHaveTextContent("pat@example.com"));
  });

  it("registers an account via the API and signs in", async () => {
    renderProbe();
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("ready"));

    fireEvent.click(screen.getByText("register"));
    await waitFor(() => expect(screen.getByTestId("email")).toHaveTextContent("pat@example.com"));
    expect(screen.getByTestId("name")).toHaveTextContent("Pat");
    expect(api.registerAccount).toHaveBeenCalledWith({ email: "pat@example.com", password: "password1", name: "Pat" });
  });

  it("signs out and back in", async () => {
    api.loginAccount.mockResolvedValue({ ok: true, status: 200, data: PROFILE });
    renderProbe();
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("ready"));

    fireEvent.click(screen.getByText("register"));
    await waitFor(() => expect(screen.getByTestId("email")).toHaveTextContent("pat@example.com"));

    fireEvent.click(screen.getByText("sign out"));
    await waitFor(() => expect(screen.getByTestId("email")).toHaveTextContent("none"));

    fireEvent.click(screen.getByText("sign in"));
    await waitFor(() => expect(screen.getByTestId("email")).toHaveTextContent("pat@example.com"));
  });

  it("updates the profile via the API", async () => {
    api.updateAccountProfile.mockResolvedValue({ ok: true, status: 200, data: { ...PROFILE, name: "Pat Updated" } });
    renderProbe();
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("ready"));

    fireEvent.click(screen.getByText("register"));
    await waitFor(() => expect(screen.getByTestId("email")).toHaveTextContent("pat@example.com"));

    fireEvent.click(screen.getByText("update"));
    await waitFor(() => expect(screen.getByTestId("name")).toHaveTextContent("Pat Updated"));
  });

  it("saves a claim and a memory through the real API, not browser storage", async () => {
    api.saveClaim.mockResolvedValue({
      ok: true,
      status: 200,
      data: { country: "panama", participation: [], matchedProfileId: "", selfDeclaredName: "" }
    });
    api.createMemory.mockResolvedValue({
      ok: true,
      status: 200,
      data: { id: "m1", title: "Trip", text: "...", photos: [] }
    });
    renderProbe();
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("ready"));

    fireEvent.click(screen.getByText("register"));
    await waitFor(() => expect(screen.getByTestId("email")).toHaveTextContent("pat@example.com"));

    fireEvent.click(screen.getByText("claim"));
    await waitFor(() => expect(screen.getByTestId("claim")).toHaveTextContent("claimed"));
    expect(api.saveClaim).toHaveBeenCalledWith({
      country: "panama",
      participation: [],
      matchedProfileId: "",
      selfDeclaredName: ""
    });

    fireEvent.click(screen.getByText("memory"));
    await waitFor(() => expect(screen.getByTestId("memories")).toHaveTextContent("1"));
    expect(api.createMemory).toHaveBeenCalledWith({ title: "Trip", text: "...", keepPhotoIds: [], newPhotos: [] });
  });

  it("surfaces a failed registration without signing in", async () => {
    api.registerAccount.mockResolvedValue({ ok: false, status: 409, data: { error: "duplicate-email" } });
    renderProbe();
    await waitFor(() => expect(screen.getByTestId("status")).toHaveTextContent("ready"));

    fireEvent.click(screen.getByText("register"));
    await waitFor(() => expect(api.registerAccount).toHaveBeenCalled());
    expect(screen.getByTestId("email")).toHaveTextContent("none");
  });
});
