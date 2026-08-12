export type EsagashiAnimal = {
  id: string;
  name: string;
  /** 発見時にふわっと乗せるアクセントカラー */
  revealColor: string;
  /** 0-100, シーン幅に対する左からの位置(%) */
  xPct: number;
  /** 0-100, シーン高さに対する上からの位置(%) */
  yPct: number;
};

export type EsagashiStage = {
  id: string;
  title: string;
  description: string;
  animals: EsagashiAnimal[];
};

export const stages: EsagashiStage[] = [
  {
    id: "shibuya-crossing",
    title: "渋谷スクランブル交差点",
    description: "行き交う人込みのどこかに、あの仲間が1匹だけ紛れています。よく探してみましょう。",
    animals: [{ id: "hidden-1", name: "隠れている仲間", revealColor: "#ffe3a3", xPct: 50, yPct: 67 }],
  },
];
