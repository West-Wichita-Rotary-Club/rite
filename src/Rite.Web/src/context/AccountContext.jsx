import { createContext, useContext, useMemo, useState } from "react";
import {
  StorageBudgetError,
  createAccountRecord,
  detectStorageAvailable,
  readAccounts,
  readSession,
  writeAccounts,
  writeSession
} from "../lib/account.js";

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [storageAvailable] = useState(() => detectStorageAvailable());
  const [accounts, setAccounts] = useState(() => readAccounts(storageAvailable));
  const [sessionEmail, setSessionEmail] = useState(() => readSession(storageAvailable));

  const account = sessionEmail ? accounts[sessionEmail] ?? null : null;

  function persist(next) {
    writeAccounts(next);
    setAccounts(next);
  }

  function signIn(email) {
    setSessionEmail(email);
    writeSession(email);
  }

  function signOut() {
    setSessionEmail(null);
    writeSession(null);
  }

  function register(email, fields) {
    const record = createAccountRecord(email, fields);
    persist({ ...accounts, [email]: record });
    signIn(email);
    return record;
  }

  function updateAccount(email, updater) {
    const existing = accounts[email];
    if (!existing) {
      return;
    }
    persist({ ...accounts, [email]: updater({ ...existing }) });
  }

  function updateProfile(fields) {
    if (!account) {
      return;
    }
    updateAccount(account.email, (existing) => ({ ...existing, ...fields }));
  }

  function saveClaim(claim) {
    if (!account) {
      return;
    }
    updateAccount(account.email, (existing) => ({ ...existing, claim }));
  }

  function withdrawClaim() {
    if (!account) {
      return;
    }
    updateAccount(account.email, (existing) => ({ ...existing, claim: null }));
  }

  function saveMemory(memory, isNew) {
    if (!account) {
      return;
    }
    updateAccount(account.email, (existing) => ({
      ...existing,
      memories: isNew
        ? existing.memories.concat(memory)
        : existing.memories.map((item) => (item.id === memory.id ? memory : item))
    }));
  }

  function deleteMemory(memoryId) {
    if (!account) {
      return;
    }
    updateAccount(account.email, (existing) => ({
      ...existing,
      memories: existing.memories.filter((item) => item.id !== memoryId)
    }));
  }

  function clearAccountData() {
    if (!account) {
      return;
    }
    const next = { ...accounts };
    delete next[account.email];
    persist(next);
    signOut();
  }

  const value = useMemo(
    () => ({
      account,
      accounts,
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
    [account, accounts, storageAvailable]
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
