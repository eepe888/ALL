"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import CafeList from "./CafeList";
import type { Cafe } from "@/types/cafe";
import type { LatLon } from "@/lib/geo";
import { haversineDistance } from "@/lib/geo";

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

  const cafes = cafesData?.cafes ?? [];
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

  const handleSelectCafeFromList = (id: string) => {
    setSelectedCafeId(id);
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

  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <div className="order-2 flex h-[45vh] min-h-0 flex-col border-t border-zinc-200 md:order-1 md:h-auto md:w-90 md:border-t-0 md:border-r dark:border-zinc-800">
        {cafesError ? (
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
            cafes={cafes}
            selectedCafeId={selectedCafeId}
            onSelectCafe={handleSelectCafeFromList}
            isLoading={cafesLoading}
          />
        )}
      </div>

      <div className="relative order-1 h-[55vh] flex-1 md:order-2 md:h-auto">
        <MapView
          initialCenter={userLocation}
          userLocation={userLocation}
          focusTarget={focusTarget ?? userLocation}
          focusSignal={focusSignal}
          cafes={cafes}
          selectedCafeId={selectedCafeId}
          onSelectCafe={setSelectedCafeId}
          onMapMoved={handleMapMoved}
        />

        {showResearchButton && (
          <button
            type="button"
            onClick={handleResearchArea}
            className="absolute top-4 left-1/2 z-1000 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-lg dark:bg-zinc-900 dark:text-zinc-50"
          >
            このエリアを再検索
          </button>
        )}

        <button
          type="button"
          onClick={handleGoToCurrentLocation}
          className="absolute right-4 bottom-6 z-1000 flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg shadow-lg dark:bg-zinc-900"
          aria-label="現在地に戻る"
        >
          📍
        </button>
      </div>
    </div>
  );
}
