import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccountProvider, useAccount } from "./AccountContext.jsx";

beforeEach(() => {
  window.localStorage.clear();
});

function Probe() {
  const { account, register, signIn, signOut, updateProfile, saveClaim, saveMemory } = useAccount();
  return (
    <div>
      <span data-testid="email">{account?.email ?? "none"}</span>
      <span data-testid="name">{account?.name ?? ""}</span>
      <span data-testid="memories">{account?.memories?.length ?? 0}</span>
      <span data-testid="claim">{account?.claim ? "claimed" : "none"}</span>
      <button onClick={() => register("pat@example.com", { name: "Pat" })}>register</button>
      <button onClick={() => signIn("pat@example.com")}>sign in</button>
      <button onClick={() => signOut()}>sign out</button>
      <button onClick={() => updateProfile({ name: "Pat Updated" })}>update</button>
      <button onClick={() => saveClaim({ country: "panama", participation: [], matchedProfileId: "", selfDeclaredName: "" })}>
        claim
      </button>
      <button onClick={() => saveMemory({ id: "m1", title: "Trip", text: "...", photos: [] }, true)}>memory</button>
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
  it("starts signed out", () => {
    renderProbe();
    expect(screen.getByTestId("email")).toHaveTextContent("none");
  });

  it("registers an account, signs in automatically, and persists across remounts", () => {
    const { unmount } = renderProbe();
    fireEvent.click(screen.getByText("register"));
    expect(screen.getByTestId("email")).toHaveTextContent("pat@example.com");
    expect(screen.getByTestId("name")).toHaveTextContent("Pat");

    unmount();
    renderProbe();
    expect(screen.getByTestId("email")).toHaveTextContent("pat@example.com");
  });

  it("signs out and back in", () => {
    renderProbe();
    fireEvent.click(screen.getByText("register"));
    fireEvent.click(screen.getByText("sign out"));
    expect(screen.getByTestId("email")).toHaveTextContent("none");

    fireEvent.click(screen.getByText("sign in"));
    expect(screen.getByTestId("email")).toHaveTextContent("pat@example.com");
  });

  it("updates the profile, saves a claim, and saves a memory", () => {
    renderProbe();
    fireEvent.click(screen.getByText("register"));
    fireEvent.click(screen.getByText("update"));
    expect(screen.getByTestId("name")).toHaveTextContent("Pat Updated");

    fireEvent.click(screen.getByText("claim"));
    expect(screen.getByTestId("claim")).toHaveTextContent("claimed");

    fireEvent.click(screen.getByText("memory"));
    expect(screen.getByTestId("memories")).toHaveTextContent("1");
  });
});
