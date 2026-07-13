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
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#4285F4;border:3px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function cafeIcon(isSelected: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:${
      isSelected ? 34 : 28
    }px;height:${
      isSelected ? 34 : 28
    }px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${
      isSelected ? "#c2410c" : "#78350f"
    };border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);">
      <span style="transform:rotate(45deg);font-size:${
        isSelected ? 16 : 13
      }px;">☕</span>
    </div>`,
    iconSize: [isSelected ? 34 : 28, isSelected ? 34 : 28],
    iconAnchor: [isSelected ? 17 : 14, isSelected ? 34 : 28],
    popupAnchor: [0, -28],
  });
}

function MapEventsHandler({
  onMapMoved,
}: {
  onMapMoved: (center: LatLon) => void;
}) {
  useMapEvents({
    moveend: (e) => {
      const c = e.target.getCenter();
      onMapMoved({ lat: c.lat, lon: c.lng });
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
  focusTarget: LatLon;
  focusSignal: number;
  cafes: Cafe[];
  selectedCafeId: string | null;
  onSelectCafe: (id: string) => void;
  onMapMoved: (center: LatLon) => void;
}

export default function MapView({
  initialCenter,
  userLocation,
  focusTarget,
  focusSignal,
  cafes,
  selectedCafeId,
  onSelectCafe,
  onMapMoved,
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
      <MapEventsHandler onMapMoved={onMapMoved} />
      <RecenterHandler target={focusTarget} signal={focusSignal} />

      <Marker position={[userLocation.lat, userLocation.lon]} icon={userLocationIcon}>
        <Popup>現在地</Popup>
      </Marker>

      {cafes.map((cafe) => (
        <Marker
          key={cafe.id}
          position={[cafe.lat, cafe.lon]}
          icon={cafeIcon(cafe.id === selectedCafeId)}
          eventHandlers={{ click: () => onSelectCafe(cafe.id) }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{cafe.name}</p>
              {cafe.address && <p className="text-zinc-600">{cafe.address}</p>}
              <p className="text-zinc-500">現在地から{cafe.distanceMeters}m</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
