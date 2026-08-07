"use client";

import { useState } from "react";
import type { SavedSnapshot } from "@/types/nail-ar";

interface ResultScreenProps {
  history: SavedSnapshot[];
  onBackToTryOn: () => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

function downloadSnapshot(snapshot: SavedSnapshot) {
  const link = document.createElement("a");
  link.href = snapshot.dataUrl;
  link.download = `nail-ar-${snapshot.capturedAt}.png`;
  link.click();
}

export default function ResultScreen({ history, onBackToTryOn }: ResultScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(history[0]?.id ?? null);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  const selected = history.find((s) => s.id === selectedId) ?? history[0] ?? null;
  const compareMode = compareIds.length === 2;
  const compareSnapshots = compareIds
    .map((id) => history.find((s) => s.id === id))
    .filter((s): s is SavedSnapshot => Boolean(s));

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>まだ保存された試着結果がありません。</p>
        <button
          type="button"
          onClick={onBackToTryOn}
          className="rounded-full bg-pink-500 px-5 py-2 text-sm font-medium text-white"
        >
          試着に戻る
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold">試着結果</h2>
        <button
          type="button"
          onClick={onBackToTryOn}
          className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs dark:border-zinc-700"
        >
          試着に戻る
        </button>
      </div>

      <div className="px-4">
        {compareMode ? (
          <div className="grid grid-cols-2 gap-2">
            {compareSnapshots.map((snap, i) => (
              <div key={snap.id} className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-zinc-500">
                  {i === 0 ? "Before" : "After"} ・ {formatTime(snap.capturedAt)}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={snap.dataUrl}
                  alt={`試着結果 ${formatTime(snap.capturedAt)}`}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800"
                />
              </div>
            ))}
          </div>
        ) : (
          selected && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selected.dataUrl}
              alt={`試着結果 ${formatTime(selected.capturedAt)}`}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800"
            />
          )
        )}
      </div>

      {selected && !compareMode && (
        <div className="flex justify-center gap-2 px-4 py-3">
          <button
            type="button"
            onClick={() => downloadSnapshot(selected)}
            className="rounded-full bg-pink-500 px-4 py-2 text-xs font-medium text-white"
          >
            端末に保存する
          </button>
        </div>
      )}

      <p className="px-4 text-[11px] text-zinc-400">
        サムネイルをタップして表示を切り替え、2枚選んで比較（Before/After）できます。
      </p>

      <div className="flex gap-2 overflow-x-auto px-4 py-3">
        {history.map((snap) => {
          const isCompareSelected = compareIds.includes(snap.id);
          return (
            <button
              key={snap.id}
              type="button"
              onClick={() => {
                setSelectedId(snap.id);
                toggleCompare(snap.id);
              }}
              className={`relative shrink-0 overflow-hidden rounded-md border-2 ${
                isCompareSelected
                  ? "border-blue-500"
                  : snap.id === selectedId
                    ? "border-pink-500"
                    : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={snap.dataUrl}
                alt={`試着結果サムネイル ${formatTime(snap.capturedAt)}`}
                className="h-16 w-16 object-cover"
              />
              <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-0.5 text-center text-[9px] text-white">
                {formatTime(snap.capturedAt)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
