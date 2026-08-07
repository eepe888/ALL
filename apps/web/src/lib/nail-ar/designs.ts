import type {
  ColorSwatch,
  DesignCategory,
  DesignTemplate,
  FinishKind,
  NailStyle,
} from "@/types/nail-ar";

export const COLOR_SWATCHES: ColorSwatch[] = [
  { id: "nude-beige", name: "ヌードベージュ", hex: "#d8b79c" },
  { id: "coral-pink", name: "コーラルピンク", hex: "#f28fa0" },
  { id: "greige", name: "グレージュ", hex: "#b3a89c" },
  { id: "cherry-red", name: "チェリーレッド", hex: "#c62839" },
  { id: "bordeaux", name: "ボルドー", hex: "#6d1f2e" },
  { id: "lavender", name: "ラベンダー", hex: "#b7a3d6" },
  { id: "sky-blue", name: "スカイブルー", hex: "#8fc5e8" },
  { id: "mint-green", name: "ミントグリーン", hex: "#9fd8c4" },
  { id: "milky-white", name: "ミルキーホワイト", hex: "#f5f0e8" },
  { id: "charcoal", name: "チャコール", hex: "#3a3a3c" },
  { id: "gold-shimmer", name: "ゴールドシマー", hex: "#d8b04a" },
  { id: "rose-gold", name: "ローズゴールド", hex: "#caa199" },
];

export const FINISH_OPTIONS: { id: FinishKind; label: string }[] = [
  { id: "solid", label: "単色" },
  { id: "gradient", label: "グラデーション" },
  { id: "glitter", label: "ラメ" },
  { id: "matte", label: "マット" },
  { id: "glossy", label: "グロス" },
];

export const DESIGN_CATEGORY_LABELS: Record<DesignCategory, string> = {
  simple: "シンプル",
  french: "フレンチ",
  art: "アート",
  seasonal: "季節限定",
};

export const DESIGN_TEMPLATES: DesignTemplate[] = [
  {
    id: "plain",
    name: "プレーン",
    category: "simple",
    description: "爪全体を単色で塗りつぶすベーシックなデザイン",
  },
  {
    id: "french-classic",
    name: "クラシックフレンチ",
    category: "french",
    description: "先端に白いラインを入れた定番フレンチ",
  },
  {
    id: "french-color",
    name: "カラーフレンチ",
    category: "french",
    description: "先端にアクセントカラーを入れたフレンチ",
  },
  {
    id: "one-point-heart",
    name: "ワンポイントハート",
    category: "art",
    description: "爪の中央にハートをひとつあしらったデザイン",
  },
  {
    id: "stone",
    name: "ストーン",
    category: "art",
    description: "小さなストーンを散りばめたきらめくデザイン",
  },
  {
    id: "marble",
    name: "マーブル",
    category: "seasonal",
    description: "揺らぎのある大理石調の模様",
  },
];

export const DEFAULT_NAIL_STYLE: NailStyle = {
  colorId: "coral-pink",
  finish: "solid",
  designId: "plain",
};

export function findColor(colorId: string): ColorSwatch {
  return (
    COLOR_SWATCHES.find((c) => c.id === colorId) ?? COLOR_SWATCHES[0]
  );
}

export function findDesign(designId: string): DesignTemplate {
  return (
    DESIGN_TEMPLATES.find((d) => d.id === designId) ?? DESIGN_TEMPLATES[0]
  );
}
