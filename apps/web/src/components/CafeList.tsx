"use client";

import type { Cafe } from "@/types/cafe";

interface CafeListProps {
  cafes: Cafe[];
  selectedCafeId: string | null;
  onSelectCafe: (id: string) => void;
  isLoading: boolean;
  searchOriginLabel: string;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (cafe: Cafe) => void;
  emptyMessage?: string;
}

export default function CafeList({
  cafes,
  selectedCafeId,
  onSelectCafe,
  isLoading,
  searchOriginLabel,
  isFavorite,
  onToggleFavorite,
  emptyMessage,
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
      <div className="flex flex-1 items-center justify-center p-6 text-center text-sm whitespace-pre-line text-zinc-500">
        {emptyMessage ??
          "周辺にカフェが見つかりませんでした。\n検索範囲を広げてみてください。"}
      </div>
    );
  }

  return (
    <ul className="min-h-0 flex-1 divide-y divide-zinc-200 overflow-y-auto dark:divide-zinc-800">
      {cafes.map((cafe) => {
        const favorite = isFavorite(cafe.id);
        return (
          <li
            key={cafe.id}
            className={`flex items-stretch transition-colors ${
              cafe.id === selectedCafeId
                ? "bg-linear-to-r from-pink-50 to-orange-50 dark:from-pink-950/30 dark:to-orange-950/20"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
          >
            <button
              type="button"
              onClick={() => onSelectCafe(cafe.id)}
              className="min-w-0 flex-1 px-4 py-3 text-left"
            >
              <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                {cafe.name}
              </p>
              {cafe.address && (
                <p className="mt-0.5 truncate text-sm text-zinc-500">
                  {cafe.address}
                </p>
              )}
              <p className="mt-0.5 text-sm font-medium text-rose-600 dark:text-rose-400">
                {searchOriginLabel}から {cafe.distanceMeters}m
              </p>
            </button>

            <button
              type="button"
              onClick={() => onToggleFavorite(cafe)}
              aria-label={
                favorite ? "お気に入りから削除" : "お気に入りに追加"
              }
              aria-pressed={favorite}
              className="flex w-12 shrink-0 items-center justify-center text-zinc-300 transition-colors hover:text-amber-400 dark:text-zinc-600"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill={favorite ? "#f59e0b" : "none"}
                stroke={favorite ? "#f59e0b" : "currentColor"}
                strokeWidth={1.5}
                strokeLinejoin="round"
              >
                <path d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7-5.4-4.7 7.1-.6z" />
              </svg>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
