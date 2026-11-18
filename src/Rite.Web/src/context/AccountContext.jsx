import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import {
  StorageBudgetError,
  clearClaimsMemories,
  detectStorageAvailable,
  readClaimsMemories,
  writeClaimsMemories
} from "../lib/account.js";

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [storageAvailable] = useState(() => detectStorageAvailable());
  const [profile, setProfile] = useState(null);
  const [claimsMemories, setClaimsMemories] = useState(null);
  // "loading" covers the one GET /api/account/me this makes on mount to restore
  // an existing session cookie — consumers (Account.jsx) must wait for "ready"
  // before treating a null account as "signed out" and redirecting.
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    api.getCurrentAccount().then(({ ok, data }) => {
      if (cancelled) {
        return;
      }
      if (ok && data) {
        setProfile(data);
        setClaimsMemories(readClaimsMemories(storageAvailable, data.email));
      }
      setStatus("ready");
    });
    return () => {
      cancelled = true;
    };
    // storageAvailable is fixed for the component's lifetime (useState initializer).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const account = profile
    ? { ...profile, claim: claimsMemories?.claim ?? null, memories: claimsMemories?.memories ?? [] }
    : null;

  async function register(fields) {
    const { ok, data } = await api.registerAccount(fields);
    if (!ok) {
      return { ok: false, error: data?.error || "unknown" };
    }
    setProfile(data);
    setClaimsMemories(readClaimsMemories(storageAvailable, data.email));
    return { ok: true };
  }

  async function signIn(email, password) {
    const { ok, data } = await api.loginAccount({ email, password });
    if (!ok) {
      return { ok: false, error: data?.error || "unknown" };
    }
    setProfile(data);
    setClaimsMemories(readClaimsMemories(storageAvailable, data.email));
    return { ok: true };
  }

  async function signOut() {
    await api.logoutAccount();
    setProfile(null);
    setClaimsMemories(null);
  }

  async function updateProfile(fields) {
    const { ok, data } = await api.updateAccountProfile(fields);
    if (ok) {
      setProfile(data);
    }
    return ok;
  }

  function saveClaim(claim) {
    if (!account) {
      return;
    }
    setClaimsMemories(
      writeClaimsMemories(storageAvailable, account.email, (existing) => ({ ...existing, claim }))
    );
  }

  function withdrawClaim() {
    if (!account) {
      return;
    }
    setClaimsMemories(
      writeClaimsMemories(storageAvailable, account.email, (existing) => ({ ...existing, claim: null }))
    );
  }

  function saveMemory(memory, isNew) {
    if (!account) {
      return;
    }
    setClaimsMemories(
      writeClaimsMemories(storageAvailable, account.email, (existing) => ({
        ...existing,
        memories: isNew
          ? existing.memories.concat(memory)
          : existing.memories.map((item) => (item.id === memory.id ? memory : item))
      }))
    );
  }

  function deleteMemory(memoryId) {
    if (!account) {
      return;
    }
    setClaimsMemories(
      writeClaimsMemories(storageAvailable, account.email, (existing) => ({
        ...existing,
        memories: existing.memories.filter((item) => item.id !== memoryId)
      }))
    );
  }

  async function clearAccountData() {
    if (account) {
      clearClaimsMemories(storageAvailable, account.email);
    }
    await signOut();
  }

  const value = useMemo(
    () => ({
      account,
      status,
      storageAvailable,
      register,
      signIn,
      signOut,
      updateProfile,
      saveClaim,
      withdrawClaim,
      saveMemory,
      deleteMemory,
      clearAccountData
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, status, storageAvailable]
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

export { StorageBudgetError };
