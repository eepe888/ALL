"use client";

import type { Cafe } from "@/types/cafe";

interface CafeListProps {
  cafes: Cafe[];
  selectedCafeId: string | null;
  onSelectCafe: (id: string) => void;
  isLoading: boolean;
}

export default function CafeList({
  cafes,
  selectedCafeId,
  onSelectCafe,
  isLoading,
}: CafeListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-zinc-500">
        周辺のカフェを検索中...
      </div>
    );
  }

  if (cafes.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-zinc-500">
        周辺にカフェが見つかりませんでした。
        <br />
        検索範囲を広げてみてください。
      </div>
    );
  }

  return (
    <ul className="min-h-0 flex-1 divide-y divide-zinc-200 overflow-y-auto dark:divide-zinc-800">
      {cafes.map((cafe) => (
        <li key={cafe.id}>
          <button
            type="button"
            onClick={() => onSelectCafe(cafe.id)}
            className={`block w-full px-4 py-3 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 ${
              cafe.id === selectedCafeId
                ? "bg-amber-50 dark:bg-amber-950/40"
                : ""
            }`}
          >
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              {cafe.name}
            </p>
            {cafe.address && (
              <p className="mt-0.5 text-sm text-zinc-500">{cafe.address}</p>
            )}
            <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-500">
              現在地から {cafe.distanceMeters}m
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}
