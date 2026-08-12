"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "e-sagashi:ads-removed";

export function useAdsRemoved() {
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // See favorites.ts for why this is deferred past a microtask.
  useEffect(() => {
    Promise.resolve().then(() => {
      setAdsRemoved(localStorage.getItem(STORAGE_KEY) === "true");
      setIsLoaded(true);
    });
  }, []);

  const markAdsRemoved = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setAdsRemoved(true);
  }, []);

  return { adsRemoved, isLoaded, markAdsRemoved };
}
