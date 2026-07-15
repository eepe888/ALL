"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { Cafe } from "@/types/cafe";
import type { LatLon } from "@/lib/geo";

const DEFAULT_ZOOM = 15;

const userLocationIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:22px;height:22px;">
      <div class="marker-pulse-ring" style="position:absolute;inset:-9px;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,0.55),transparent 70%);"></div>
      <div style="position:relative;width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#22d3ee,#2563eb);border:3px solid white;box-shadow:0 2px 10px rgba(37,99,235,0.55);"></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const pinLocationIcon = L.divIcon({
  className: "",
  html: `<div class="marker-pop-in" style="width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:linear-gradient(135deg,#c4b5fd,#7c3aed);border:3px solid white;box-shadow:0 3px 10px rgba(124,58,237,0.55);"></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function cafeIcon(isSelected: boolean) {
  const size = isSelected ? 38 : 30;
  const background = isSelected
    ? "linear-gradient(135deg,#ff5fa2,#c2185b)"
    : "linear-gradient(135deg,#ffb199,#ff6b4a)";
  const shadow = isSelected
    ? "0 4px 14px rgba(194,24,91,0.6)"
    : "0 3px 8px rgba(255,107,74,0.45)";
  return L.divIcon({
    className: "",
    html: `<div class="${
      isSelected ? "marker-pop-in" : ""
    }" style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${background};border:3px solid white;box-shadow:${shadow};">
      <span style="transform:rotate(45deg);font-size:${
        isSelected ? 18 : 15
      }px;">☕</span>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function MapEventsHandler({
  onMapMoved,
  onMapClick,
}: {
  onMapMoved: (center: LatLon) => void;
  onMapClick: (location: LatLon) => void;
}) {
  useMapEvents({
    moveend: (e) => {
      const c = e.target.getCenter();
      onMapMoved({ lat: c.lat, lon: c.lng });
    },
    click: (e) => {
      onMapClick({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return null;
}

function RecenterHandler({
  target,
  signal,
}: {
  target: LatLon;
  signal: number;
}) {
  const map = useMap();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    map.flyTo([target.lat, target.lon], DEFAULT_ZOOM);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signal]);

  return null;
}

interface MapViewProps {
  initialCenter: LatLon;
  userLocation: LatLon;
  pinLocation: LatLon | null;
  focusTarget: LatLon;
  focusSignal: number;
  cafes: Cafe[];
  selectedCafeId: string | null;
  searchOriginLabel: string;
  isFavorite: (id: string) => boolean;
  onSelectCafe: (id: string) => void;
  onToggleFavorite: (cafe: Cafe) => void;
  onMapMoved: (center: LatLon) => void;
  onMapClick: (location: LatLon) => void;
}

export default function MapView({
  initialCenter,
  userLocation,
  pinLocation,
  focusTarget,
  focusSignal,
  cafes,
  selectedCafeId,
  searchOriginLabel,
  isFavorite,
  onSelectCafe,
  onToggleFavorite,
  onMapMoved,
  onMapClick,
}: MapViewProps) {
  return (
    <MapContainer
      center={[initialCenter.lat, initialCenter.lon]}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      className="absolute inset-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEventsHandler onMapMoved={onMapMoved} onMapClick={onMapClick} />
      <RecenterHandler target={focusTarget} signal={focusSignal} />

      <Marker position={[userLocation.lat, userLocation.lon]} icon={userLocationIcon}>
        <Popup>現在地</Popup>
      </Marker>

      {pinLocation && (
        <Marker position={[pinLocation.lat, pinLocation.lon]} icon={pinLocationIcon}>
          <Popup>検索地点</Popup>
        </Marker>
      )}

      {cafes.map((cafe) => {
        const favorite = isFavorite(cafe.id);
        return (
          <Marker
            key={cafe.id}
            position={[cafe.lat, cafe.lon]}
            icon={cafeIcon(cafe.id === selectedCafeId)}
            eventHandlers={{ click: () => onSelectCafe(cafe.id) }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{cafe.name}</p>
                {cafe.address && (
                  <p className="text-zinc-600">{cafe.address}</p>
                )}
                <p className="text-zinc-500">
                  {searchOriginLabel}から{cafe.distanceMeters}m
                </p>
                <button
                  type="button"
                  onClick={() => onToggleFavorite(cafe)}
                  className="mt-1.5 flex items-center gap-1 font-medium text-amber-600"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="15"
                    height="15"
                    fill={favorite ? "#f59e0b" : "none"}
                    stroke={favorite ? "#f59e0b" : "currentColor"}
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                  >
                    <path d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7-5.4-4.7 7.1-.6z" />
                  </svg>
                  {favorite ? "お気に入り済み" : "お気に入りに追加"}
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
