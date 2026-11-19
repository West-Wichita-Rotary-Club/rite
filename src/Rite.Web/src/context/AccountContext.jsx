import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { photosToSave } from "../lib/account.js";

const AccountContext = createContext(null);

async function fetchClaimAndMemories() {
  const [claimResult, memoriesResult] = await Promise.all([api.getClaim(), api.listMemories()]);
  return {
    claim: claimResult.ok ? claimResult.data : null,
    memories: memoriesResult.ok ? memoriesResult.data : []
  };
}

export function AccountProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [claim, setClaim] = useState(null);
  const [memories, setMemories] = useState([]);
  // "loading" covers the one GET /api/account/me this makes on mount to restore
  // an existing session cookie — consumers (Account.jsx) must wait for "ready"
  // before treating a null account as "signed out" and redirecting.
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    api.getCurrentAccount().then(async ({ ok, data }) => {
      if (ok && data) {
        const claimsMemories = await fetchClaimAndMemories();
        if (cancelled) {
          return;
        }
        setProfile(data);
        setClaim(claimsMemories.claim);
        setMemories(claimsMemories.memories);
      }
      if (!cancelled) {
        setStatus("ready");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const account = profile ? { ...profile, claim, memories } : null;

  async function register(fields) {
    const { ok, data } = await api.registerAccount(fields);
    if (!ok) {
      return { ok: false, error: data?.error || "unknown" };
    }
    setProfile(data);
    setClaim(null);
    setMemories([]);
    return { ok: true };
  }

  async function signIn(email, password) {
    const { ok, data } = await api.loginAccount({ email, password });
    if (!ok) {
      return { ok: false, error: data?.error || "unknown" };
    }
    setProfile(data);
    const claimsMemories = await fetchClaimAndMemories();
    setClaim(claimsMemories.claim);
    setMemories(claimsMemories.memories);
    return { ok: true };
  }

  async function signOut() {
    await api.logoutAccount();
    setProfile(null);
    setClaim(null);
    setMemories([]);
  }

  async function updateProfile(fields) {
    const { ok, data } = await api.updateAccountProfile(fields);
    if (ok) {
      setProfile(data);
    }
    return ok;
  }

  // claimPayload's participation rows must already be {role, yearFrom, yearTo}
  // ints (see lib/account.js's participationPayload) — the caller owns that
  // coercion since it has the raw form-state rows.
  async function saveClaim(claimPayload) {
    const { ok, data } = await api.saveClaim(claimPayload);
    if (ok) {
      setClaim(data);
    }
    return ok;
  }

  async function withdrawClaim() {
    const { ok } = await api.withdrawClaim();
    if (ok) {
      setClaim(null);
    }
    return ok;
  }

  async function saveMemory(memoryDraft, isNew) {
    const { keepPhotoIds, newPhotos } = photosToSave(memoryDraft.photos);
    const payload = { title: memoryDraft.title, text: memoryDraft.text, keepPhotoIds, newPhotos };
    const { ok, data } = isNew
      ? await api.createMemory(payload)
      : await api.updateMemory(memoryDraft.id, payload);
    if (ok) {
      setMemories((existing) =>
        isNew ? existing.concat(data) : existing.map((item) => (item.id === data.id ? data : item))
      );
    }
    return ok;
  }

  async function deleteMemory(memoryId) {
    const { ok } = await api.deleteMemory(memoryId);
    if (ok) {
      setMemories((existing) => existing.filter((item) => item.id !== memoryId));
    }
    return ok;
  }

  const value = useMemo(
    () => ({
      account,
      status,
      register,
      signIn,
      signOut,
      updateProfile,
      saveClaim,
      withdrawClaim,
      saveMemory,
      deleteMemory
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, status]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
