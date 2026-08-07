"use client";

import { useRef, useState } from "react";
import CameraStage, { type CameraFacingMode, type CameraStageHandle } from "./CameraStage";
import DesignPalette from "./DesignPalette";
import ResultScreen from "./ResultScreen";
import TopScreen from "./TopScreen";
import { applyPartialToTargets, createDefaultNailStyleMap, getRepresentativeStyle } from "@/lib/nail-ar/nailStyles";
import type { FingerId, HandSide, NailStyle, SavedSnapshot } from "@/types/nail-ar";

type Screen = "top" | "tryon" | "result";

export default function NailArApp() {
  const [screen, setScreen] = useState<Screen>("top");
  const [facingMode, setFacingMode] = useState<CameraFacingMode>("user");
  const [nailStyles, setNailStyles] = useState(createDefaultNailStyleMap());
  const [activeSide, setActiveSide] = useState<HandSide>("right");
  const [selectedFingers, setSelectedFingers] = useState<FingerId[]>([]);
  const [history, setHistory] = useState<SavedSnapshot[]>([]);
  const [handDetected, setHandDetected] = useState(false);
  const cameraStageRef = useRef<CameraStageHandle>(null);

  function handleFingerTap(side: HandSide, finger: FingerId) {
    if (side !== activeSide) {
      setActiveSide(side);
      setSelectedFingers([finger]);
      return;
    }
    setSelectedFingers((prev) =>
      prev.includes(finger) ? prev.filter((f) => f !== finger) : [...prev, finger]
    );
  }

  function handleApplyPartial(partial: Partial<NailStyle>) {
    setNailStyles((prev) => applyPartialToTargets(prev, activeSide, selectedFingers, partial));
  }

  function handleApplyAll() {
    const source =
      getRepresentativeStyle(nailStyles, activeSide, selectedFingers) ??
      nailStyles[activeSide][selectedFingers[0] ?? "thumb"];
    setNailStyles((prev) => applyPartialToTargets(prev, activeSide, [], { ...source }));
    setSelectedFingers([]);
  }

  function handleCapture() {
    const dataUrl = cameraStageRef.current?.capture();
    if (!dataUrl) return;
    const snapshot: SavedSnapshot = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      dataUrl,
      capturedAt: Date.now(),
    };
    setHistory((prev) => [snapshot, ...prev].slice(0, 12));
    setScreen("result");
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {screen === "top" && <TopScreen onStart={() => setScreen("tryon")} />}

      {screen === "tryon" && (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between px-3 py-2">
            <button
              type="button"
              onClick={() => setScreen("top")}
              className="text-xs text-zinc-500 dark:text-zinc-400"
            >
              ← トップ
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setFacingMode((m) => (m === "user" ? "environment" : "user"))
                }
                className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700"
              >
                🔄 カメラ切替
              </button>
              <button
                type="button"
                onClick={() => setScreen("result")}
                disabled={history.length === 0}
                className="rounded-full border border-zinc-300 px-3 py-1 text-xs disabled:opacity-40 dark:border-zinc-700"
              >
                履歴
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1">
            <CameraStage
              ref={cameraStageRef}
              facingMode={facingMode}
              nailStyles={nailStyles}
              selectedTargets={selectedFingers.map((finger) => ({ side: activeSide, finger }))}
              onFingerTap={handleFingerTap}
              onHandDetectedChange={setHandDetected}
            />
          </div>

          <div className="flex justify-center py-2">
            <button
              type="button"
              onClick={handleCapture}
              disabled={!handDetected}
              className="rounded-full bg-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow disabled:opacity-40"
            >
              📸 この状態を保存する
            </button>
          </div>

          <DesignPalette
            activeSide={activeSide}
            onActiveSideChange={(side) => {
              setActiveSide(side);
              setSelectedFingers([]);
            }}
            nailStyles={nailStyles}
            selectedFingers={selectedFingers}
            onToggleFinger={(finger) =>
              setSelectedFingers((prev) =>
                prev.includes(finger) ? prev.filter((f) => f !== finger) : [...prev, finger]
              )
            }
            onApplyPartial={handleApplyPartial}
            onApplyAll={handleApplyAll}
            activeStyle={getRepresentativeStyle(nailStyles, activeSide, selectedFingers)}
          />
        </div>
      )}

      {screen === "result" && (
        <ResultScreen history={history} onBackToTryOn={() => setScreen("tryon")} />
      )}
    </div>
  );
}
