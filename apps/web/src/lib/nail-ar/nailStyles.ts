import { DEFAULT_NAIL_STYLE } from "./designs";
import { FINGER_IDS } from "@/types/nail-ar";
import type { FingerId, HandSide, NailStyle, NailStyleMap } from "@/types/nail-ar";

export function createDefaultNailStyleMap(): NailStyleMap {
  const perHand = () =>
    Object.fromEntries(
      FINGER_IDS.map((finger) => [finger, { ...DEFAULT_NAIL_STYLE }])
    ) as Record<FingerId, NailStyle>;
  return { left: perHand(), right: perHand() };
}

export function applyPartialToTargets(
  styles: NailStyleMap,
  side: HandSide,
  targets: FingerId[],
  partial: Partial<NailStyle>
): NailStyleMap {
  const fingers = targets.length > 0 ? targets : FINGER_IDS;
  const updatedHand = { ...styles[side] };
  for (const finger of fingers) {
    updatedHand[finger] = { ...updatedHand[finger], ...partial };
  }
  return { ...styles, [side]: updatedHand };
}

// Used to highlight the palette's currently-active color/finish/design: a
// single selected finger shows its own style; an empty or mixed selection
// falls back to the hand's shared style when every finger agrees, or null
// when the hand carries multiple different styles.
export function getRepresentativeStyle(
  styles: NailStyleMap,
  side: HandSide,
  selectedFingers: FingerId[]
): NailStyle | null {
  const hand = styles[side];
  if (selectedFingers.length === 1) {
    return hand[selectedFingers[0]];
  }
  const fingers = selectedFingers.length > 0 ? selectedFingers : FINGER_IDS;
  const first = hand[fingers[0]];
  const allSame = fingers.every(
    (f) =>
      hand[f].colorId === first.colorId &&
      hand[f].finish === first.finish &&
      hand[f].designId === first.designId
  );
  return allSame ? first : null;
}
