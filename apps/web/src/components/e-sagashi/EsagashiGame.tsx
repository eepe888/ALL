"use client";

import { stages } from "@/lib/esagashi-data";
import { useEsagashiProgress } from "@/lib/esagashi-progress";
import SceneIllustration from "./SceneIllustration";
import AnimalIcon from "./AnimalIcon";
import ClearOverlay from "./ClearOverlay";
import AdBanner from "./AdBanner";
import RemoveAdsButton from "./RemoveAdsButton";

export default function EsagashiGame() {
  const stage = stages[0];
  const { foundIds, markFound, resetStage } = useEsagashiProgress(stage.id);
  const target = stage.animals[0];
  const isCleared = foundIds.has(target.id);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
        <p className="min-w-0 text-xs text-zinc-500 dark:text-zinc-400">{stage.description}</p>
        <RemoveAdsButton />
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-zinc-50 p-3 dark:bg-zinc-950">
        <div className="relative aspect-[4/3] w-full max-w-2xl">
          <SceneIllustration />
          <button
            type="button"
            onClick={() => markFound(target.id)}
            disabled={isCleared}
            aria-label={isCleared ? `${target.name}（発見済み）` : "この辺りをタップして探す"}
            className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full disabled:cursor-default"
            style={{ left: `${target.xPct}%`, top: `${target.yPct}%` }}
          >
            <AnimalIcon
              fill={isCleared ? target.revealColor : "#ffffff"}
              className={`relative transition-all duration-300 ${
                isCleared
                  ? "scale-125 drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
                  : "scale-75"
              }`}
            />
            {isCleared && (
              <span className="marker-pulse-ring absolute inset-0 rounded-full border-2 border-emerald-400" />
            )}
          </button>
        </div>
      </div>

      <AdBanner />

      {isCleared && <ClearOverlay stageTitle={stage.title} onReset={resetStage} />}
    </div>
  );
}
