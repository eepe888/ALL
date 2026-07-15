"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import CafeList from "./CafeList";
import type { Cafe } from "@/types/cafe";
import type { LatLon } from "@/lib/geo";
import { haversineDistance } from "@/lib/geo";
import { useFavorites } from "@/lib/favorites";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-900">
      地図を読み込み中...
    </div>
  ),
});

const SEARCH_RADIUS_METERS = 1500;
const RE_SEARCH_THRESHOLD_METERS = 300;

type GeoStatus = "loading" | "success" | "error";

interface CafesResponse {
  cafes: Cafe[];
}

async function cafesFetcher(url: string): Promise<CafesResponse> {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data.error ?? "周辺のカフェ情報の取得に失敗しました。"
    );
  }
  return data;
}

function isGeolocationSupported(): boolean {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
}

function geolocationErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "位置情報の利用が許可されていません。ブラウザの設定で位置情報を許可してください。";
    case error.POSITION_UNAVAILABLE:
      return "現在地を取得できませんでした。電波状況の良い場所で再度お試しください。";
    case error.TIMEOUT:
      return "現在地の取得がタイムアウトしました。再度お試しください。";
    default:
      return "現在地の取得中にエラーが発生しました。";
  }
}

export default function CafeFinder() {
  // Always start at "loading" so the server-rendered markup (which has no
  // access to `navigator`) matches the client's first render and avoids a
  // hydration mismatch. Browser capability is only checked client-side,
  // after mount, inside the effect below.
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("loading");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LatLon | null>(null);
  const [searchCenter, setSearchCenter] = useState<LatLon | null>(null);

  const [selectedCafeId, setSelectedCafeId] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<LatLon | null>(null);
  const [focusSignal, setFocusSignal] = useState(0);

  const [pendingMapCenter, setPendingMapCenter] = useState<LatLon | null>(
    null
  );

  const [hideChains, setHideChains] = useState(false);
  const [activeTab, setActiveTab] = useState<"nearby" | "favorites">(
    "nearby"
  );

  const [pinLocation, setPinLocation] = useState<LatLon | null>(null);
  const [pinPlacementMode, setPinPlacementMode] = useState(false);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  // Only ever called from event handlers (click, or the async geolocation
  // callback itself) so it's safe to setState synchronously here.
  const beginLocationRequest = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setUserLocation(location);
        setSearchCenter(location);
        setFocusTarget(location);
        setGeoStatus("success");
      },
      (error) => {
        setGeoStatus("error");
        setGeoError(geolocationErrorMessage(error));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const requestLocation = useCallback(() => {
    setGeoStatus("loading");
    setGeoError(null);
    beginLocationRequest();
  }, [beginLocationRequest]);

  useEffect(() => {
    if (!isGeolocationSupported()) {
      // Deferred to a microtask: this runs after the initial (matching)
      // client render, the same way the async geolocation callbacks below
      // do, rather than synchronously during the effect itself.
      Promise.resolve().then(() => {
        setGeoStatus("error");
        setGeoError("お使いのブラウザは位置情報取得に対応していません。");
      });
      return;
    }
    beginLocationRequest();
  }, [beginLocationRequest]);

  const cafeQueryKey = searchCenter
    ? `/api/cafes?lat=${searchCenter.lat}&lon=${searchCenter.lon}&radius=${SEARCH_RADIUS_METERS}`
    : null;

  const {
    data: cafesData,
    error: cafesFetchError,
    isLoading: cafesLoading,
    mutate: retryCafes,
  } = useSWR(cafeQueryKey, cafesFetcher);

  const allCafes = cafesData?.cafes ?? [];
  const cafes = hideChains ? allCafes.filter((cafe) => !cafe.isChain) : allCafes;
  const cafesError = cafesFetchError instanceof Error ? cafesFetchError.message : null;

  const handleMapMoved = useCallback((center: LatLon) => {
    setPendingMapCenter(center);
  }, []);

  const showResearchButton =
    searchCenter &&
    pendingMapCenter &&
    haversineDistance(searchCenter, pendingMapCenter) >
      RE_SEARCH_THRESHOLD_METERS;

  const handleResearchArea = () => {
    if (pendingMapCenter) {
      setSearchCenter(pendingMapCenter);
      setPendingMapCenter(null);
    }
  };

  const handleGoToCurrentLocation = () => {
    if (userLocation) {
      setFocusTarget(userLocation);
      setFocusSignal((s) => s + 1);
    }
  };

  const handleTogglePinPlacementMode = () => {
    setPinPlacementMode((mode) => !mode);
  };

  const handleMapClick = (location: LatLon) => {
    if (!pinPlacementMode) return;
    setPinLocation(location);
    setSearchCenter(location);
    setPendingMapCenter(null);
    setPinPlacementMode(false);
  };

  const handleClearPin = () => {
    if (!userLocation) return;
    setPinLocation(null);
    setSearchCenter(userLocation);
    setPendingMapCenter(null);
    setFocusTarget(userLocation);
    setFocusSignal((s) => s + 1);
  };

  const handleSelectCafeFromList = (id: string) => {
    setSelectedCafeId(id);

    if (activeTab === "favorites") {
      // A favorite may be well outside the current search results, so
      // selecting one re-centers the search there instead of just panning
      // (the same way dropping a pin does), otherwise its marker would
      // never appear on the map.
      const favorite = favorites.find((f) => f.id === id);
      if (favorite) {
        const location = { lat: favorite.lat, lon: favorite.lon };
        setPinLocation(location);
        setSearchCenter(location);
        setPendingMapCenter(null);
        setFocusTarget(location);
        setFocusSignal((s) => s + 1);
      }
      return;
    }

    const cafe = cafes.find((c) => c.id === id);
    if (cafe) {
      setFocusTarget({ lat: cafe.lat, lon: cafe.lon });
      setFocusSignal((s) => s + 1);
    }
  };

  if (geoStatus === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-zinc-500">
        現在地を取得しています...
      </div>
    );
  }

  if (geoStatus === "error" || !userLocation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          {geoError}
        </p>
        <button
          type="button"
          onClick={requestLocation}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background"
        >
          再試行
        </button>
      </div>
    );
  }

  const origin = pinLocation ?? userLocation;
  const favoriteCafes: Cafe[] = favorites
    .map((favorite) => ({
      ...favorite,
      distanceMeters: Math.round(haversineDistance(origin, favorite)),
    }))
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  const listCafes = activeTab === "favorites" ? favoriteCafes : cafes;

  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <div className="order-2 flex h-[45%] min-h-0 flex-col border-t border-zinc-200 md:order-1 md:h-auto md:w-90 md:border-t-0 md:border-r dark:border-zinc-800">
        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab("nearby")}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "nearby"
                ? "border-b-2 border-pink-600 text-pink-600 dark:text-pink-400"
                : "border-b-2 border-transparent text-zinc-500 dark:text-zinc-400"
            }`}
          >
            近くのカフェ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "favorites"
                ? "border-b-2 border-pink-600 text-pink-600 dark:text-pink-400"
                : "border-b-2 border-transparent text-zinc-500 dark:text-zinc-400"
            }`}
          >
            お気に入り{favorites.length > 0 ? ` (${favorites.length})` : ""}
          </button>
        </div>

        {activeTab === "nearby" && (
          <label className="flex items-center gap-2 border-b border-zinc-200 px-4 py-2.5 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={hideChains}
              onChange={(e) => setHideChains(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 accent-pink-600 dark:border-zinc-700"
            />
            チェーン店を表示しない
          </label>
        )}

        {activeTab === "nearby" && cafesError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-sm text-zinc-500">
            <p>{cafesError}</p>
            <button
              type="button"
              onClick={() => retryCafes()}
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm dark:border-zinc-700"
            >
              再試行
            </button>
          </div>
        ) : (
          <CafeList
            cafes={listCafes}
            selectedCafeId={selectedCafeId}
            onSelectCafe={handleSelectCafeFromList}
            isLoading={activeTab === "nearby" && cafesLoading}
            searchOriginLabel={pinLocation ? "ピン地点" : "現在地"}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            emptyMessage={
              activeTab === "favorites"
                ? "まだお気に入りがありません。\n☆をタップして登録しましょう。"
                : undefined
            }
          />
        )}
      </div>

      <div className="relative order-1 h-[55%] flex-1 md:order-2 md:h-auto">
        <MapView
          initialCenter={userLocation}
          userLocation={userLocation}
          pinLocation={pinLocation}
          focusTarget={focusTarget ?? userLocation}
          focusSignal={focusSignal}
          cafes={cafes}
          selectedCafeId={selectedCafeId}
          searchOriginLabel={pinLocation ? "ピン地点" : "現在地"}
          isFavorite={isFavorite}
          onSelectCafe={setSelectedCafeId}
          onToggleFavorite={toggleFavorite}
          onMapMoved={handleMapMoved}
          onMapClick={handleMapClick}
        />

        {pinPlacementMode && (
          <div className="absolute top-[calc(1rem+env(safe-area-inset-top))] left-1/2 z-1000 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-lg dark:bg-zinc-900 dark:text-zinc-50">
            地図をタップしてピンを立てます
          </div>
        )}

        {!pinPlacementMode && pinLocation && (
          <div className="absolute top-[calc(1rem+env(safe-area-inset-top))] left-1/2 z-1000 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-lg dark:bg-zinc-900 dark:text-zinc-50">
            📌 ピンの地点で検索中
            <button
              type="button"
              onClick={handleClearPin}
              className="text-violet-600 underline dark:text-violet-400"
            >
              現在地に戻す
            </button>
          </div>
        )}

        {!pinPlacementMode && !pinLocation && showResearchButton && (
          <button
            type="button"
            onClick={handleResearchArea}
            className="absolute top-[calc(1rem+env(safe-area-inset-top))] left-1/2 z-1000 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-lg dark:bg-zinc-900 dark:text-zinc-50"
          >
            このエリアを再検索
          </button>
        )}

        <button
          type="button"
          onClick={handleTogglePinPlacementMode}
          className={`absolute right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(5rem+env(safe-area-inset-bottom))] z-1000 flex h-12 w-12 items-center justify-center rounded-full text-xl text-white shadow-lg transition-transform active:scale-90 ${
            pinPlacementMode
              ? "animate-pulse bg-linear-to-br from-pink-500 to-rose-600 shadow-pink-500/50"
              : "bg-linear-to-br from-violet-400 to-purple-600 shadow-purple-500/40"
          }`}
          aria-label="ピンを立てて検索"
          aria-pressed={pinPlacementMode}
        >
          📌
        </button>

        <button
          type="button"
          onClick={handleGoToCurrentLocation}
          className="absolute right-[calc(1rem+env(safe-area-inset-right))] bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-1000 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-blue-500/40 transition-transform active:scale-90"
          aria-label="現在地に戻る"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="12" y1="1" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="23" />
            <line x1="1" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="23" y2="12" />
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </div>
    </div>
  );
}
