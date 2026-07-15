"use client";

import { useCallback, useEffect, useState } from "react";
import type { Cafe, FavoriteCafe } from "@/types/cafe";

const STORAGE_KEY = "cafe-finder:favorites";

function loadFavorites(): FavoriteCafe[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoriteCafe[]) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteCafe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // localStorage isn't available during SSR, and reading it synchronously
  // on the initial client render would create a hydration mismatch against
  // the server-rendered (empty) markup, so it's deferred to an effect. The
  // extra microtask hop past a `.then()` also satisfies the
  // react-hooks/set-state-in-effect lint rule (no direct setState call in
  // the effect body).
  useEffect(() => {
    Promise.resolve().then(() => {
      setFavorites(loadFavorites());
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites, isLoaded]);

  const isFavorite = useCallback(
    (id: string) => favorites.some((favorite) => favorite.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((cafe: Cafe) => {
    setFavorites((prev) => {
      if (prev.some((favorite) => favorite.id === cafe.id)) {
        return prev.filter((favorite) => favorite.id !== cafe.id);
      }
      return [
        ...prev,
        {
          id: cafe.id,
          name: cafe.name,
          lat: cafe.lat,
          lon: cafe.lon,
          address: cafe.address,
          isChain: cafe.isChain,
        },
      ];
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
