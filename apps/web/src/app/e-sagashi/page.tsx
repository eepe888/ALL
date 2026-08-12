import type { Metadata, Viewport } from "next";
import EsagashiGame from "@/components/e-sagashi/EsagashiGame";

export const metadata: Metadata = {
  title: "絵探しゲーム | Cafénista",
  description: "日本各地の風景イラストに隠れた動物を探す、のんびり絵探しゲーム",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function EsagashiPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <h1 className="flex items-center gap-1.5 text-lg font-bold">
          <span aria-hidden>🔍</span>
          <span className="bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
            絵探しゲーム
          </span>
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">隠れた動物を見つけよう</p>
      </header>
      <EsagashiGame />
    </div>
  );
}
