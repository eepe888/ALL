type Props = {
  /** 白抜き（体の毛色）部分の塗り色。発見前は白、発見後はアクセントカラーを渡す */
  fill?: string;
  className?: string;
};

/**
 * ユーザー提供の本命キャラクター（MAIN_CHARACTER.svg）をそのまま再現した
 * アイコン。太い黒アウトライン・眠そうな耳・両目パッチリ・王冠の房・
 * 蝶ネクタイ・輪っか尻尾が特徴で、そっくりさんファミリー（デコイ）とは
 * 目の開閉や尻尾の色などの細部で見分けられる。
 */
export default function AnimalIcon({ fill = "#ffffff", className }: Props) {
  return (
    <svg viewBox="-80 -165 210 260" className={className} role="img" aria-label="キャラクター">
      <path
        d="M40,55 C95,55 118,15 92,-15 C74,-35 48,-24 55,-2"
        stroke="black"
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="55" cy="-2" r="13" fill={fill} stroke="black" strokeWidth={6} />
      <path d="M-20,55 L-26,72" stroke="black" strokeWidth={6} strokeLinecap="round" />
      <path d="M20,55 L26,72" stroke="black" strokeWidth={6} strokeLinecap="round" />
      <ellipse cx="-27" cy="78" rx="15" ry="9" fill={fill} stroke="black" strokeWidth={5} />
      <ellipse cx="27" cy="78" rx="15" ry="9" fill={fill} stroke="black" strokeWidth={5} />
      <ellipse cx="0" cy="38" rx="46" ry="42" fill={fill} stroke="black" strokeWidth={6} />
      <circle cx="-46" cy="-82" r="29" fill={fill} stroke="black" strokeWidth={6} />
      <circle cx="46" cy="-82" r="29" fill={fill} stroke="black" strokeWidth={6} />
      <path d="M-59,-82 Q-46,-70 -33,-82" stroke="black" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M33,-82 Q46,-70 59,-82" stroke="black" strokeWidth={4} fill="none" strokeLinecap="round" />
      <circle cx="0" cy="-38" r="49" fill={fill} stroke="black" strokeWidth={6} />
      <polyline
        points="-18.0,-118 -6.0,-96 6.0,-118 18.0,-96"
        stroke="black"
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black" />
      <circle cx="-18" cy="-36" r="16" fill="#ffffff" />
      <circle cx="-15" cy="-33" r="6.5" fill="black" />
      <circle cx="18" cy="-36" r="16" fill="#ffffff" />
      <circle cx="21" cy="-33" r="6.5" fill="black" />
      <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black" />
      <path d="M-14,8 L0,18 L-14,28 Z M14,8 L0,18 L14,28 Z" fill="black" />
      <circle cx="0" cy="18" r="4" fill="#ffffff" stroke="black" strokeWidth={2} />
    </svg>
  );
}
