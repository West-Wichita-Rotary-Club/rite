// Minimal in-memory localStorage stub for modules that read/write
// `window.localStorage` (account.js). No jsdom dependency: these modules
// never touch the DOM itself, only Web Storage.
export function installWindowStorageStub() {
  const backing = new Map();
  globalThis.window = globalThis.window || globalThis;
  globalThis.window.localStorage = {
    getItem: (key) => (backing.has(key) ? backing.get(key) : null),
    setItem: (key, value) => backing.set(key, String(value)),
    removeItem: (key) => backing.delete(key),
    clear: () => backing.clear()
  };
  return globalThis.window.localStorage;
}
