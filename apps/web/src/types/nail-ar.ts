export type FingerId = "thumb" | "index" | "middle" | "ring" | "pinky";

export const FINGER_IDS: FingerId[] = [
  "thumb",
  "index",
  "middle",
  "ring",
  "pinky",
];

export const FINGER_LABELS: Record<FingerId, string> = {
  thumb: "親指",
  index: "人差し指",
  middle: "中指",
  ring: "薬指",
  pinky: "小指",
};

export type HandSide = "left" | "right";

export type FinishKind = "solid" | "gradient" | "glitter" | "matte" | "glossy";

export type DesignCategory = "simple" | "french" | "art" | "seasonal";

export interface DesignTemplate {
  id: string;
  name: string;
  category: DesignCategory;
  description: string;
}

export interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
}

export interface NailStyle {
  colorId: string;
  finish: FinishKind;
  designId: string;
}

export type NailStyleMap = Record<HandSide, Record<FingerId, NailStyle>>;

export interface FingertipPoint {
  x: number;
  y: number;
  z: number;
}

export interface NailGeometry {
  finger: FingerId;
  center: { x: number; y: number };
  angleRad: number;
  length: number;
  width: number;
}

export interface DetectedHand {
  side: HandSide;
  nails: NailGeometry[];
}

export interface SavedSnapshot {
  id: string;
  dataUrl: string;
  capturedAt: number;
}
