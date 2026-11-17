import { useEffect, useState } from "react";

// `loader` must be a stable function reference (e.g. api.getTimeline) —
// passing a fresh arrow function on every render would re-fetch in a loop.
export function useContent(loader) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null, error: null });

    loader()
      .then((data) => {
        if (!cancelled) {
          setState({ status: "ready", data, error: null });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({ status: "error", data: null, error });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [loader]);

  return state;
}
