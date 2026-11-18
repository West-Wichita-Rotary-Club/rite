import "@testing-library/jest-dom/vitest";

// Node 26's own experimental global `localStorage` shadows jsdom's (vitest's
// jsdom environment makes `window === globalThis`), leaving
// window.localStorage undefined with no error until something calls it —
// same root cause docs/js/__tests__/test-helpers.js's installWindowStorageStub
// already works around. A minimal in-memory stub, forced on regardless of
// which implementation (or lack of one) was already there.
const localStorageBacking = new Map();
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key) => (localStorageBacking.has(key) ? localStorageBacking.get(key) : null),
    setItem: (key, value) => localStorageBacking.set(key, String(value)),
    removeItem: (key) => localStorageBacking.delete(key),
    clear: () => localStorageBacking.clear()
  }
});
