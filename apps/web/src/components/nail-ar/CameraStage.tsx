"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { detectHandsInVideo, loadHandLandmarker } from "@/lib/nail-ar/handTracking";
import { computeNailGeometry } from "@/lib/nail-ar/nailGeometry";
import { drawNail } from "@/lib/nail-ar/nailRender";
import { computeCoverRect, mapLandmarksToCanvas } from "@/lib/nail-ar/projection";
import type {
  DetectedHand,
  FingerId,
  FingertipPoint,
  HandSide,
  NailGeometry,
  NailStyleMap,
} from "@/types/nail-ar";

export type CameraFacingMode = "user" | "environment";

interface CameraStageProps {
  facingMode: CameraFacingMode;
  nailStyles: NailStyleMap;
  selectedTargets: { side: HandSide; finger: FingerId }[];
  onFingerTap: (side: HandSide, finger: FingerId) => void;
  onHandDetectedChange?: (detected: boolean) => void;
}

export interface CameraStageHandle {
  capture: () => string | null;
}

type PermissionState = "requesting" | "granted" | "denied" | "error";
type HandLandmarkerInstance = Awaited<ReturnType<typeof loadHandLandmarker>>;

const GUIDE_BOX = { x: 0.18, y: 0.22, w: 0.64, h: 0.56 };
const DARK_LUMINANCE_THRESHOLD = 60;
const NO_HAND_MESSAGE = "手を検出できません。カメラに手をかざしてください。";
const OUT_OF_FRAME_MESSAGE = "手を枠内に入れてください。";
const DARK_MESSAGE = "もう少し明るい場所でお試しください。";
const MODEL_LOADING_MESSAGE = "AI認識機能を準備中です。もう少しお待ちください…";
const MODEL_ERROR_MESSAGE =
  "AI認識機能を読み込めませんでした。通信環境をご確認のうえ、画面を開き直してお試しください。";

// Raw per-frame landmarks jitter noticeably at typical webcam resolution,
// which reads as the nail overlay not locking tightly onto the actual nail.
// Blending each frame's landmarks with the previous smoothed pose (per
// hand side) trades a small amount of latency for a much steadier fit.
const LANDMARK_SMOOTHING_ALPHA = 0.45;
// If a hand-side goes undetected for this many consecutive frames, its
// smoothing history is dropped so a hand reappearing elsewhere doesn't
// snap-blend from a stale position.
const SMOOTHING_RESET_FRAMES = 5;

function smoothLandmarks(
  previous: FingertipPoint[] | undefined,
  next: FingertipPoint[],
  alpha: number
): FingertipPoint[] {
  if (!previous || previous.length !== next.length) return next;
  return next.map((point, i) => ({
    x: previous[i].x + (point.x - previous[i].x) * alpha,
    y: previous[i].y + (point.y - previous[i].y) * alpha,
    z: point.z,
  }));
}

// A bent/curled finger nearly end-on to the camera collapses to a very
// short 2D projection, so its computed angle is dominated by landmark
// noise even after position smoothing — a small wobble in pixel space
// swings the angle wildly. Blending angle across frames (with a heavier
// damping than position) keeps the nail's rotation from snapping around
// on every frame instead of following the finger smoothly.
const GEOMETRY_POSITION_ALPHA = 0.5;
const GEOMETRY_ANGLE_ALPHA = 0.25;
const GEOMETRY_SIZE_ALPHA = 0.5;

function lerpAngle(from: number, to: number, t: number): number {
  let diff = to - from;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return from + diff * t;
}

function smoothNailGeometry(
  previous: NailGeometry | undefined,
  next: NailGeometry
): NailGeometry {
  if (!previous) return next;
  return {
    finger: next.finger,
    center: {
      x: previous.center.x + (next.center.x - previous.center.x) * GEOMETRY_POSITION_ALPHA,
      y: previous.center.y + (next.center.y - previous.center.y) * GEOMETRY_POSITION_ALPHA,
    },
    angleRad: lerpAngle(previous.angleRad, next.angleRad, GEOMETRY_ANGLE_ALPHA),
    length: previous.length + (next.length - previous.length) * GEOMETRY_SIZE_ALPHA,
    width: previous.width + (next.width - previous.width) * GEOMETRY_SIZE_ALPHA,
  };
}

function mapGetUserMediaError(err: unknown): string {
  const name = err instanceof Error ? err.name : undefined;
  switch (name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return "カメラの利用が許可されていません。ブラウザの設定でカメラを許可してください。";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "利用可能なカメラが見つかりませんでした。";
    case "NotReadableError":
      return "カメラを起動できませんでした。他のアプリがカメラを使用していないか確認してください。";
    case "InsecureContextError":
      return "カメラを利用するには安全な接続が必要です。https:// で始まるURL、またはパソコンの localhost からアクセスしてください。";
    case "UnsupportedError":
      return "お使いのブラウザはカメラ機能に対応していません。別のブラウザでお試しください。";
    case "TimeoutError":
      return "カメラの起動がタイムアウトしました。ページを再読み込みするか、別のブラウザでお試しください。";
    default:
      return "カメラの起動中にエラーが発生しました。";
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, name: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(Object.assign(new Error("timed out"), { name }));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

const CameraStage = forwardRef<CameraStageHandle, CameraStageProps>(
  function CameraStage(
    { facingMode, nailStyles, selectedTargets, onFingerTap, onHandDetectedChange },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const handsRef = useRef<DetectedHand[]>([]);
    const nailStylesRef = useRef(nailStyles);
    const selectedTargetsRef = useRef(selectedTargets);
    const noHandFrameCountRef = useRef(0);
    const lastBrightnessCheckRef = useRef(0);
    const lastGuidanceRef = useRef<string | null>(null);
    const lastHasHandRef = useRef(false);
    const brightnessCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const landmarkerRef = useRef<HandLandmarkerInstance | null>(null);
    const smoothedLandmarksRef = useRef<Partial<Record<HandSide, FingertipPoint[]>>>({});
    const smoothedGeometryRef = useRef<
      Partial<Record<HandSide, Partial<Record<FingerId, NailGeometry>>>>
    >({});
    const missingFrameCountRef = useRef<Record<HandSide, number>>({ left: 0, right: 0 });

    const [permissionState, setPermissionState] = useState<PermissionState>("requesting");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [guidanceMessage, setGuidanceMessage] = useState<string | null>(null);
    const [modelLoadError, setModelLoadError] = useState<string | null>(null);

    nailStylesRef.current = nailStyles;
    selectedTargetsRef.current = selectedTargets;

    useImperativeHandle(ref, () => ({
      capture: () => canvasRef.current?.toDataURL("image/png") ?? null,
    }));

    useEffect(() => {
      let cancelled = false;

      Promise.resolve().then(() => {
        if (cancelled) return;
        setPermissionState("requesting");
        setErrorMessage(null);
        setGuidanceMessage(null);
        setModelLoadError(null);
      });

      // Kicked off in parallel with getUserMedia below, not awaited before
      // showing the camera feed: the AI model is several MB fetched from a
      // CDN and can take seconds, but the live preview only needs the
      // camera stream. `loadHandLandmarker` caches its promise, so this is
      // instant on second entry into this screen.
      loadHandLandmarker()
        .then((landmarker) => {
          if (!cancelled) landmarkerRef.current = landmarker;
        })
        .catch(() => {
          if (!cancelled) setModelLoadError(MODEL_ERROR_MESSAGE);
        });

      async function setup() {
        try {
          // getUserMedia is unavailable outside a secure context (https://,
          // or localhost) — on some mobile browsers this silently leaves
          // `mediaDevices` undefined rather than raising a catchable error,
          // which otherwise looks identical to the permission dialog never
          // appearing. Surface it explicitly instead of hitting a TypeError.
          if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
            throw Object.assign(new Error("insecure context"), {
              name: "InsecureContextError",
            });
          }

          const stream = await withTimeout(
            navigator.mediaDevices.getUserMedia({
              video: {
                facingMode,
                width: { ideal: 960 },
                height: { ideal: 1280 },
              },
              audio: false,
            }),
            15000,
            "TimeoutError"
          );
          if (cancelled) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }
          streamRef.current = stream;
          const video = videoRef.current;
          if (!video) return;
          video.srcObject = stream;
          await video.play();
          if (cancelled) return;
          setPermissionState("granted");

          const loop = () => {
            if (cancelled) return;
            runFrame(landmarkerRef.current);
            rafIdRef.current = requestAnimationFrame(loop);
          };
          rafIdRef.current = requestAnimationFrame(loop);
        } catch (err) {
          if (cancelled) return;
          setPermissionState("error");
          setErrorMessage(mapGetUserMediaError(err));
        }
      }

      function runFrame(landmarker: HandLandmarkerInstance | null) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!video || !canvas || !container || video.readyState < 2) return;
        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const destWidth = Math.round(container.clientWidth * dpr);
        const destHeight = Math.round(container.clientHeight * dpr);
        if (destWidth === 0 || destHeight === 0) return;
        if (canvas.width !== destWidth || canvas.height !== destHeight) {
          canvas.width = destWidth;
          canvas.height = destHeight;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const result = landmarker
          ? detectHandsInVideo(landmarker, video, performance.now())
          : { landmarks: [], handedness: [] };

        const cover = computeCoverRect(
          video.videoWidth,
          video.videoHeight,
          destWidth,
          destHeight
        );

        ctx.save();
        ctx.clearRect(0, 0, destWidth, destHeight);
        const mirrored = facingMode === "user";
        if (mirrored) {
          ctx.translate(destWidth, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(
          video,
          cover.sx,
          cover.sy,
          cover.sw,
          cover.sh,
          0,
          0,
          destWidth,
          destHeight
        );

        const guideRect = {
          x: GUIDE_BOX.x * destWidth,
          y: GUIDE_BOX.y * destHeight,
          w: GUIDE_BOX.w * destWidth,
          h: GUIDE_BOX.h * destHeight,
        };

        const hasHand = result.landmarks.length > 0;
        const hands: DetectedHand[] = [];
        let anyOutOfFrame = false;
        const seenSides = new Set<HandSide>();

        // MediaPipe's own handedness label assumes a mirrored (selfie-style)
        // input frame, but `video` here is always the raw, unmirrored sensor
        // frame — whether that assumption then needs inverting turned out to
        // vary by device/browser and wasn't reliable. Instead, side is
        // decided purely from screen position: whichever hand appears on the
        // left half of what the user actually sees (post-mirror, for a front
        // camera) is "left". This is what the 右手/左手 tabs mean to the user
        // anyway, and it can never disagree with what's drawn on screen.
        const rawHands = result.landmarks.map((landmarks) => {
          const rawPixelLandmarks = mapLandmarksToCanvas(
            landmarks,
            video.videoWidth,
            video.videoHeight,
            cover,
            destWidth,
            destHeight
          );
          const avgX =
            rawPixelLandmarks.reduce((sum, p) => sum + p.x, 0) / rawPixelLandmarks.length;
          const displayX = mirrored ? destWidth - avgX : avgX;
          return { rawPixelLandmarks, displayX };
        });

        let sides: HandSide[];
        if (rawHands.length === 2) {
          sides =
            rawHands[0].displayX <= rawHands[1].displayX
              ? ["left", "right"]
              : ["right", "left"];
        } else {
          sides = rawHands.map((h) => (h.displayX < destWidth / 2 ? "left" : "right"));
        }

        rawHands.forEach(({ rawPixelLandmarks }, index) => {
          const side = sides[index];
          seenSides.add(side);

          const pixelLandmarks = smoothLandmarks(
            smoothedLandmarksRef.current[side],
            rawPixelLandmarks,
            LANDMARK_SMOOTHING_ALPHA
          );
          smoothedLandmarksRef.current[side] = pixelLandmarks;
          missingFrameCountRef.current[side] = 0;

          const smoothedGeometryBySide = smoothedGeometryRef.current[side] ?? {};
          const nails = computeNailGeometry(pixelLandmarks).map((nail) => {
            const smoothed = smoothNailGeometry(smoothedGeometryBySide[nail.finger], nail);
            smoothedGeometryBySide[nail.finger] = smoothed;
            return smoothed;
          });
          smoothedGeometryRef.current[side] = smoothedGeometryBySide;
          hands.push({ side, nails });

          const centroid = pixelLandmarks.reduce(
            (acc, p) => ({ x: acc.x + p.x / pixelLandmarks.length, y: acc.y + p.y / pixelLandmarks.length }),
            { x: 0, y: 0 }
          );
          const inFrame =
            centroid.x >= guideRect.x &&
            centroid.x <= guideRect.x + guideRect.w &&
            centroid.y >= guideRect.y &&
            centroid.y <= guideRect.y + guideRect.h;
          if (!inFrame) anyOutOfFrame = true;

          const styleForSide = nailStylesRef.current[side];
          for (const nail of nails) {
            const isSelected = selectedTargetsRef.current.some(
              (t) => t.side === side && t.finger === nail.finger
            );
            drawNail(ctx, nail, styleForSide[nail.finger], isSelected);
          }
        });

        (["left", "right"] as HandSide[]).forEach((side) => {
          if (seenSides.has(side)) return;
          missingFrameCountRef.current[side] += 1;
          if (missingFrameCountRef.current[side] > SMOOTHING_RESET_FRAMES) {
            delete smoothedLandmarksRef.current[side];
            delete smoothedGeometryRef.current[side];
          }
        });

        handsRef.current = hands;
        ctx.restore();

        // Guide frame, drawn last (outside the mirror transform) so its
        // dashed border and label always read left-to-right normally.
        ctx.save();
        ctx.strokeStyle = hasHand && !anyOutOfFrame ? "rgba(74, 222, 128, 0.85)" : "rgba(255, 255, 255, 0.75)";
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 8]);
        const radius = 24;
        ctx.beginPath();
        ctx.roundRect(guideRect.x, guideRect.y, guideRect.w, guideRect.h, radius);
        ctx.stroke();
        ctx.restore();

        noHandFrameCountRef.current = hasHand ? 0 : noHandFrameCountRef.current + 1;

        let nextGuidance: string | null = null;
        if (!landmarker) {
          nextGuidance = MODEL_LOADING_MESSAGE;
        } else if (noHandFrameCountRef.current > 30) {
          nextGuidance = NO_HAND_MESSAGE;
        } else if (hasHand && anyOutOfFrame) {
          nextGuidance = OUT_OF_FRAME_MESSAGE;
        }

        const now = performance.now();
        if (!nextGuidance && now - lastBrightnessCheckRef.current > 500) {
          lastBrightnessCheckRef.current = now;
          if (!brightnessCanvasRef.current) {
            brightnessCanvasRef.current = document.createElement("canvas");
            brightnessCanvasRef.current.width = 16;
            brightnessCanvasRef.current.height = 16;
          }
          const bctx = brightnessCanvasRef.current.getContext("2d");
          if (bctx) {
            bctx.drawImage(video, 0, 0, 16, 16);
            const { data } = bctx.getImageData(0, 0, 16, 16);
            let total = 0;
            for (let i = 0; i < data.length; i += 4) {
              total += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            }
            const avgLuminance = total / (data.length / 4);
            if (avgLuminance < DARK_LUMINANCE_THRESHOLD) {
              nextGuidance = DARK_MESSAGE;
            }
          }
        }

        if (nextGuidance !== lastGuidanceRef.current) {
          lastGuidanceRef.current = nextGuidance;
          setGuidanceMessage(nextGuidance);
        }
        if (hasHand !== lastHasHandRef.current) {
          lastHasHandRef.current = hasHand;
          onHandDetectedChange?.(hasHand);
        }
      }

      setup();

      return () => {
        cancelled = true;
        if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facingMode]);

    function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      let x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;
      if (facingMode === "user") {
        x = canvas.width - x;
      }

      let closest: { side: HandSide; finger: FingerId; dist: number } | null = null;
      for (const hand of handsRef.current) {
        for (const nail of hand.nails) {
          const dist = Math.hypot(nail.center.x - x, nail.center.y - y);
          const threshold = Math.max(nail.length, nail.width) * 1.1;
          if (dist <= threshold && (!closest || dist < closest.dist)) {
            closest = { side: hand.side, finger: nail.finger, dist };
          }
        }
      }
      if (closest) {
        onFingerTap(closest.side, closest.finger);
      }
    }

    return (
      <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        />
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          className="absolute inset-0 h-full w-full touch-none"
        />

        {permissionState === "requesting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 px-6 text-center text-sm text-white">
            <span aria-hidden className="text-2xl">📷</span>
            <p>カメラを起動しています…</p>
            <p className="text-xs text-white/70">
              カメラの利用許可を求めるダイアログが表示されたら「許可」を選択してください。
            </p>
          </div>
        )}

        {permissionState === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/85 px-6 text-center text-sm text-white">
            <span aria-hidden className="text-2xl">⚠️</span>
            <p>{errorMessage}</p>
          </div>
        )}

        {permissionState === "granted" && (modelLoadError || guidanceMessage) && (
          <div
            className={`absolute inset-x-4 top-4 rounded-full px-4 py-2 text-center text-xs text-white shadow ${
              modelLoadError ? "bg-red-600/85" : "bg-black/70"
            }`}
          >
            {modelLoadError ?? guidanceMessage}
          </div>
        )}
      </div>
    );
  }
);

export default CameraStage;
