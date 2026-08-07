import type { FingertipPoint } from "@/types/nail-ar";

export interface CoverRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

// Mirrors CSS `object-fit: cover`: crops the source (video) frame so it
// fills the destination (canvas) box without distorting the aspect ratio.
export function computeCoverRect(
  srcWidth: number,
  srcHeight: number,
  destWidth: number,
  destHeight: number
): CoverRect {
  const srcRatio = srcWidth / srcHeight;
  const destRatio = destWidth / destHeight;

  if (srcRatio > destRatio) {
    const sw = srcHeight * destRatio;
    return { sx: (srcWidth - sw) / 2, sy: 0, sw, sh: srcHeight };
  }

  const sh = srcWidth / destRatio;
  return { sx: 0, sy: (srcHeight - sh) / 2, sw: srcWidth, sh };
}

// Converts MediaPipe's normalized (0-1, relative to the full source frame)
// landmarks into destination canvas pixel coordinates, accounting for the
// crop applied by `computeCoverRect`.
export function mapLandmarksToCanvas(
  landmarks: FingertipPoint[],
  srcWidth: number,
  srcHeight: number,
  cover: CoverRect,
  destWidth: number,
  destHeight: number
): FingertipPoint[] {
  const scaleX = destWidth / cover.sw;
  const scaleY = destHeight / cover.sh;
  return landmarks.map((point) => ({
    x: (point.x * srcWidth - cover.sx) * scaleX,
    y: (point.y * srcHeight - cover.sy) * scaleY,
    z: point.z,
  }));
}
