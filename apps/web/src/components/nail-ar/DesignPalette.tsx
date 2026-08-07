"use client";

import { useState } from "react";
import {
  COLOR_SWATCHES,
  DESIGN_CATEGORY_LABELS,
  DESIGN_TEMPLATES,
  FINISH_OPTIONS,
} from "@/lib/nail-ar/designs";
import { findColor } from "@/lib/nail-ar/designs";
import {
  FINGER_IDS,
  FINGER_LABELS,
  type DesignCategory,
  type FingerId,
  type HandSide,
  type NailStyle,
  type NailStyleMap,
} from "@/types/nail-ar";

interface DesignPaletteProps {
  activeSide: HandSide;
  onActiveSideChange: (side: HandSide) => void;
  nailStyles: NailStyleMap;
  selectedFingers: FingerId[];
  onToggleFinger: (finger: FingerId) => void;
  onApplyPartial: (partial: Partial<NailStyle>) => void;
  onApplyAll: () => void;
  activeStyle: NailStyle | null;
}

export default function DesignPalette({
  activeSide,
  onActiveSideChange,
  nailStyles,
  selectedFingers,
  onToggleFinger,
  onApplyPartial,
  onApplyAll,
  activeStyle,
}: DesignPaletteProps) {
  const [category, setCategory] = useState<DesignCategory>("simple");

  const handFingerStyles = nailStyles[activeSide];
  const filteredDesigns = DESIGN_TEMPLATES.filter((d) => d.category === category);

  return (
    <div className="flex max-h-[46vh] flex-col gap-3 overflow-y-auto border-t border-zinc-200 bg-white px-3 py-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1 rounded-full bg-zinc-100 p-1 text-xs dark:bg-zinc-900">
          {(["right", "left"] as HandSide[]).map((side) => (
            <button
              key={side}
              type="button"
              onClick={() => onActiveSideChange(side)}
              className={`rounded-full px-3 py-1.5 font-medium transition ${
                activeSide === side
                  ? "bg-pink-500 text-white"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {side === "right" ? "右手" : "左手"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onApplyAll}
          className="rounded-full border border-pink-400 px-3 py-1.5 text-xs font-medium text-pink-600 transition hover:bg-pink-50 dark:text-pink-300 dark:hover:bg-pink-950"
        >
          全爪に適用
        </button>
      </div>

      <div className="flex items-center justify-between gap-1.5">
        {FINGER_IDS.map((finger) => {
          const style = handFingerStyles[finger];
          const color = findColor(style.colorId);
          const selected = selectedFingers.includes(finger);
          return (
            <button
              key={finger}
              type="button"
              onClick={() => onToggleFinger(finger)}
              aria-pressed={selected}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span
                className={`h-8 w-8 rounded-full border-2 transition ${
                  selected
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "border-white dark:border-zinc-800"
                }`}
                style={{ backgroundColor: color.hex }}
                aria-hidden
              />
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {FINGER_LABELS[finger]}
              </span>
            </button>
          );
        })}
      </div>
      <p className="-mt-1 text-center text-[11px] text-zinc-400">
        {selectedFingers.length > 0
          ? `${selectedFingers.map((f) => FINGER_LABELS[f]).join("・")}を編集中`
          : "指を選択すると個別に編集できます（未選択時は全ての指に反映）"}
      </p>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          質感
        </p>
        <div className="flex flex-wrap gap-1.5">
          {FINISH_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onApplyPartial({ finish: option.id })}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                activeStyle?.finish === option.id
                  ? "border-pink-500 bg-pink-500 text-white"
                  : "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          カラー
        </p>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch.id}
              type="button"
              onClick={() => onApplyPartial({ colorId: swatch.id })}
              title={swatch.name}
              aria-label={swatch.name}
              className={`flex flex-col items-center gap-1`}
            >
              <span
                className={`h-8 w-8 rounded-full border-2 transition ${
                  activeStyle?.colorId === swatch.id
                    ? "border-blue-500 ring-2 ring-blue-300"
                    : "border-white dark:border-zinc-800"
                }`}
                style={{ backgroundColor: swatch.hex }}
              />
              <span className="max-w-[3.2rem] truncate text-[9px] text-zinc-500 dark:text-zinc-400">
                {swatch.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          デザイン
        </p>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {(Object.keys(DESIGN_CATEGORY_LABELS) as DesignCategory[]).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                category === cat
                  ? "border-zinc-800 bg-zinc-800 text-white dark:border-zinc-200 dark:bg-zinc-200 dark:text-zinc-900"
                  : "border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
              }`}
            >
              {DESIGN_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {filteredDesigns.map((design) => (
            <button
              key={design.id}
              type="button"
              onClick={() => onApplyPartial({ designId: design.id })}
              className={`rounded-lg border p-2 text-left transition ${
                activeStyle?.designId === design.id
                  ? "border-pink-500 bg-pink-50 dark:bg-pink-950"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <p className="text-xs font-medium">{design.name}</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {design.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
