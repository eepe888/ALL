import {
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";

const WASM_BASE_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_ASSET_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

let landmarkerPromise: Promise<HandLandmarker> | null = null;

// The WASM runtime and model file are fetched from Google's CDN on first
// use (per spec §7, this requires network access and will fail offline).
// Cached as a module-level singleton so screen re-entry doesn't re-download.
export function loadHandLandmarker(): Promise<HandLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = FilesetResolver.forVisionTasks(WASM_BASE_URL)
      .then((vision) =>
        HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_ASSET_URL,
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 2,
          minHandDetectionConfidence: 0.6,
          minHandPresenceConfidence: 0.6,
          minTrackingConfidence: 0.6,
        })
      )
      .catch((err) => {
        // Let a later call retry instead of caching a permanent rejection
        // (a transient network blip shouldn't lock out the feature for the
        // rest of the session).
        landmarkerPromise = null;
        throw err;
      });
  }
  return landmarkerPromise;
}

export function detectHandsInVideo(
  landmarker: HandLandmarker,
  video: HTMLVideoElement,
  timestampMs: number
): HandLandmarkerResult {
  return landmarker.detectForVideo(video, timestampMs);
}
