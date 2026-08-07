import type { FingerId, FingertipPoint, NailGeometry } from "@/types/nail-ar";

// MediaPipe HandLandmarker's 21-point layout: for every finger except the
// thumb, the DIP joint precedes the TIP; the thumb only has an IP joint at
// that position. The nail is approximated as an ellipse sitting between the
// two, biased toward the tip — there is no dedicated nail landmark.
const FINGER_JOINTS: Record<FingerId, { joint: number; tip: number }> = {
  thumb: { joint: 3, tip: 4 },
  index: { joint: 7, tip: 8 },
  middle: { joint: 11, tip: 12 },
  ring: { joint: 15, tip: 16 },
  pinky: { joint: 19, tip: 20 },
};

// A visible fingernail covers most of the width of its fingertip, not a
// thin sliver — the thumbnail reads noticeably wider than the others, the
// pinky narrower.
const FINGER_WIDTH_FACTOR: Record<FingerId, number> = {
  thumb: 0.78,
  index: 0.64,
  middle: 0.62,
  ring: 0.6,
  pinky: 0.54,
};

// `landmarks` must already be in destination canvas pixel space (see
// `mapLandmarksToCanvas`) — this function does no normalization itself, so
// it stays agnostic to whatever letterbox/crop projection was used upstream.
export function computeNailGeometry(landmarks: FingertipPoint[]): NailGeometry[] {
  const wrist = landmarks[0];
  const middleMcp = landmarks[9];
  const handScale = Math.hypot(middleMcp.x - wrist.x, middleMcp.y - wrist.y);

  return (Object.keys(FINGER_JOINTS) as FingerId[]).map((finger) => {
    const { joint, tip } = FINGER_JOINTS[finger];
    const jointPx = landmarks[joint];
    const tipPx = landmarks[tip];

    const dx = tipPx.x - jointPx.x;
    const dy = tipPx.y - jointPx.y;
    const segmentLength = Math.hypot(dx, dy);
    const angleRad = Math.atan2(dy, dx);

    // Pull the nail center back from the very tip so it sits on the last
    // segment rather than floating past the fingertip.
    const center = {
      x: tipPx.x - dx * 0.3,
      y: tipPx.y - dy * 0.3,
    };

    const length = Math.max(segmentLength * 0.7, handScale * 0.2);
    // A real nail reads close to as wide as it is long (not the thin
    // capsule a small width factor produces) — width tracks `length` as
    // its primary driver, with the handScale-based term only as a floor
    // for degenerate/foreshortened frames.
    const width = Math.max(
      handScale * 0.24 * FINGER_WIDTH_FACTOR[finger],
      length * 0.82
    );

    return { finger, center, angleRad, length, width };
  });
}
