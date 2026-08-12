"use client";

import { useState } from "react";
import { useAdsRemoved } from "@/lib/premium";

export default function RemoveAdsButton() {
  const { adsRemoved, isLoaded } = useAdsRemoved();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoaded || adsRemoved) return null;

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "決済ページを開けませんでした");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
      setLoading(false);
    }
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="shrink-0 whitespace-nowrap rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        {loading ? "処理中…" : "広告を非表示にする（¥300）"}
      </button>
      {error && <p className="max-w-40 text-right text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
