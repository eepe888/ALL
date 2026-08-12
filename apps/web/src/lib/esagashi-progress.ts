"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "e-sagashi:progress";

/** ステージIDごとに発見済み動物IDの配列を保持する */
type Progress = Record<string, string[]>;

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

export function useEsagashiProgress(stageId: string) {
  const [progress, setProgress] = useState<Progress>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // See favorites.ts: deferred past a microtask to avoid a hydration
  // mismatch and to satisfy the react-hooks/set-state-in-effect lint rule.
  useEffect(() => {
    Promise.resolve().then(() => {
      setProgress(loadProgress());
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, isLoaded]);

  const foundIds = new Set(progress[stageId] ?? []);

  const markFound = useCallback(
    (animalId: string) => {
      setProgress((prev) => {
        const current = prev[stageId] ?? [];
        if (current.includes(animalId)) return prev;
        return { ...prev, [stageId]: [...current, animalId] };
      });
    },
    [stageId]
  );

  const resetStage = useCallback(() => {
    setProgress((prev) => ({ ...prev, [stageId]: [] }));
  }, [stageId]);

  return { foundIds, isLoaded, markFound, resetStage };
}
