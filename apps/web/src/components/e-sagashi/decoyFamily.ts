/**
 * ユーザー提供の lemur_family.svg から抽出した「そっくりさん」16種類。
 * 本命キャラ（AnimalIcon）と体型は同じだが、耳・目・冠・尻尾・帽子などが
 * 少しずつ違うデコイとして群衆に紛れ込ませ、間違い探しの難易度を出す。
 * <symbol> として1回だけ定義し、シーン側では <use> で使い回す。
 */
export const DECOY_FAMILY_SYMBOLS = `
<symbol id="decoy-1" viewBox="-80 -165 210 260">
  <path d="M40,55 C95,55 118,15 92,-15 C74,-35 48,-24 55,-2" stroke="black" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="55" cy="-2" r="13" fill="black"/>
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <path d="M-59,-82 Q-46,-70 -33,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M33,-82 Q46,-70 59,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <polyline points="-18.0,-118 -6.0,-96 6.0,-118 18.0,-96" stroke="black" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <path d="M-33,-36 Q-18,-26 -3,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="18" cy="-36" r="16" fill="white"/>
  <circle cx="21" cy="-33" r="6.5" fill="black"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
</symbol>
<symbol id="decoy-2" viewBox="-80 -165 210 260">
  <path d="M42,50 C80,60 100,60 122,45" stroke="black" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <path d="M-59,-82 Q-46,-70 -33,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M33,-82 Q46,-70 59,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <polyline points="-18.0,-118 0.0,-96 18.0,-118" stroke="black" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <circle cx="-18" cy="-36" r="16" fill="white"/>
  <circle cx="-15" cy="-33" r="6.5" fill="black"/>
  <circle cx="18" cy="-36" r="16" fill="white"/>
  <circle cx="21" cy="-33" r="6.5" fill="black"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
  <path d="M-14,8 L0,18 L-14,28 Z M14,8 L0,18 L14,28 Z" fill="black"/>
  <circle cx="0" cy="18" r="4" fill="white" stroke="black" stroke-width="2"/>
</symbol>
<symbol id="decoy-3" viewBox="-80 -165 210 260">
  <path d="M40,55 C90,60 110,30 98,0" stroke="black" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="98" cy="0" r="20" fill="white" stroke="black" stroke-width="6"/>
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <polyline points="-18.0,-118 -9.0,-96 0.0,-118 9.0,-96 18.0,-118" stroke="black" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <circle cx="-18" cy="-36" r="16" fill="white"/>
  <circle cx="-15" cy="-33" r="6.5" fill="black"/>
  <path d="M3,-36 Q18,-26 33,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
</symbol>
<symbol id="decoy-4" viewBox="-80 -165 210 260">
  <path d="M40,55 C95,55 118,15 92,-15 C74,-35 48,-24 55,-2" stroke="black" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="55" cy="-2" r="13" fill="black"/>
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <path d="M-59,-82 Q-46,-70 -33,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M33,-82 Q46,-70 59,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <polyline points="-18.0,-118 18.0,-96" stroke="black" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <path d="M-33,-36 Q-18,-26 -3,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M3,-36 Q18,-26 33,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
  <path d="M-20,-125 L20,-125 L12,-155 L-12,-155 Z" fill="black"/>
  <rect x="-26" y="-128" width="52" height="8" fill="black"/>
</symbol>
<symbol id="decoy-5" viewBox="-80 -165 210 260">
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <polyline points="-18.0,-118 -6.0,-96 6.0,-118 18.0,-96" stroke="black" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <circle cx="-18" cy="-36" r="16" fill="white"/>
  <circle cx="-15" cy="-33" r="6.5" fill="black"/>
  <circle cx="18" cy="-36" r="16" fill="white"/>
  <circle cx="21" cy="-33" r="6.5" fill="black"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
  <circle cx="-18" cy="-36" r="21" fill="none" stroke="white" stroke-width="8"/>
  <circle cx="-18" cy="-36" r="21" fill="none" stroke="black" stroke-width="3.5"/>
  <circle cx="18" cy="-36" r="21" fill="none" stroke="white" stroke-width="8"/>
  <circle cx="18" cy="-36" r="21" fill="none" stroke="black" stroke-width="3.5"/>
  <line x1="3" y1="-36" x2="-3" y2="-36" stroke="white" stroke-width="8"/>
  <line x1="3" y1="-36" x2="-3" y2="-36" stroke="black" stroke-width="3.5"/>
</symbol>
<symbol id="decoy-6" viewBox="-80 -165 210 260">
  <path d="M40,55 C90,60 110,30 98,0" stroke="black" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="98" cy="0" r="20" fill="white" stroke="black" stroke-width="6"/>
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <path d="M-59,-82 Q-46,-70 -33,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M33,-82 Q46,-70 59,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <polyline points="-18.0,-118 0.0,-96 18.0,-118" stroke="black" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <path d="M-33,-36 Q-18,-26 -3,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="18" cy="-36" r="16" fill="white"/>
  <circle cx="21" cy="-33" r="6.5" fill="black"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
  <path d="M-40,10 Q0,26 40,10 L40,22 Q0,38 -40,22 Z" fill="black"/>
</symbol>
<symbol id="decoy-7" viewBox="-80 -165 210 260">
  <path d="M40,55 C95,55 118,15 92,-15 C74,-35 48,-24 55,-2" stroke="black" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="55" cy="-2" r="13" fill="black"/>
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <polyline points="-18.0,-118 -9.0,-96 0.0,-118 9.0,-96 18.0,-118" stroke="black" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <circle cx="-18" cy="-36" r="16" fill="white"/>
  <circle cx="-15" cy="-33" r="6.5" fill="black"/>
  <circle cx="18" cy="-36" r="16" fill="white"/>
  <circle cx="21" cy="-33" r="6.5" fill="black"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
</symbol>
<symbol id="decoy-8" viewBox="-80 -165 210 260">
  <path d="M42,50 C80,60 100,60 122,45" stroke="black" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <circle cx="-18" cy="-36" r="16" fill="white"/>
  <circle cx="-15" cy="-33" r="6.5" fill="black"/>
  <path d="M3,-36 Q18,-26 33,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
  <path d="M-14,8 L0,18 L-14,28 Z M14,8 L0,18 L14,28 Z" fill="black"/>
  <circle cx="0" cy="18" r="4" fill="white" stroke="black" stroke-width="2"/>
</symbol>
<symbol id="decoy-9" viewBox="-80 -165 210 260">
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <polyline points="-18.0,-118 -6.0,-96 6.0,-118 18.0,-96" stroke="black" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <circle cx="-18" cy="-36" r="16" fill="white"/>
  <circle cx="-15" cy="-33" r="6.5" fill="black"/>
  <circle cx="18" cy="-36" r="16" fill="white"/>
  <circle cx="21" cy="-33" r="6.5" fill="black"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
  <circle cx="-18" cy="-36" r="21" fill="none" stroke="white" stroke-width="8"/>
  <circle cx="-18" cy="-36" r="21" fill="none" stroke="black" stroke-width="3.5"/>
  <circle cx="18" cy="-36" r="21" fill="none" stroke="white" stroke-width="8"/>
  <circle cx="18" cy="-36" r="21" fill="none" stroke="black" stroke-width="3.5"/>
  <line x1="3" y1="-36" x2="-3" y2="-36" stroke="white" stroke-width="8"/>
  <line x1="3" y1="-36" x2="-3" y2="-36" stroke="black" stroke-width="3.5"/>
</symbol>
<symbol id="decoy-10" viewBox="-80 -165 210 260">
  <path d="M40,55 C95,55 118,15 92,-15 C74,-35 48,-24 55,-2" stroke="black" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="55" cy="-2" r="13" fill="black"/>
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <path d="M-59,-82 Q-46,-70 -33,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M33,-82 Q46,-70 59,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <polyline points="-18.0,-118 0.0,-96 18.0,-118" stroke="black" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <path d="M-33,-36 Q-18,-26 -3,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M3,-36 Q18,-26 33,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
  <path d="M-20,-125 L20,-125 L12,-155 L-12,-155 Z" fill="black"/>
  <rect x="-26" y="-128" width="52" height="8" fill="black"/>
</symbol>
<symbol id="decoy-11" viewBox="-80 -165 210 260">
  <path d="M40,55 C90,60 110,30 98,0" stroke="black" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="98" cy="0" r="20" fill="white" stroke="black" stroke-width="6"/>
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <path d="M-59,-82 Q-46,-70 -33,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M33,-82 Q46,-70 59,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <polyline points="-18.0,-118 18.0,-96" stroke="black" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <path d="M-33,-36 Q-18,-26 -3,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="18" cy="-36" r="16" fill="white"/>
  <circle cx="21" cy="-33" r="6.5" fill="black"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
</symbol>
<symbol id="decoy-12" viewBox="-80 -165 210 260">
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <path d="M-59,-82 Q-46,-70 -33,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M33,-82 Q46,-70 59,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <polyline points="-18.0,-118 -6.0,-96 6.0,-118 18.0,-96" stroke="black" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <path d="M-33,-36 Q-18,-26 -3,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M3,-36 Q18,-26 33,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
  <circle cx="-18" cy="-36" r="21" fill="none" stroke="white" stroke-width="8"/>
  <circle cx="-18" cy="-36" r="21" fill="none" stroke="black" stroke-width="3.5"/>
  <circle cx="18" cy="-36" r="21" fill="none" stroke="white" stroke-width="8"/>
  <circle cx="18" cy="-36" r="21" fill="none" stroke="black" stroke-width="3.5"/>
  <line x1="3" y1="-36" x2="-3" y2="-36" stroke="white" stroke-width="8"/>
  <line x1="3" y1="-36" x2="-3" y2="-36" stroke="black" stroke-width="3.5"/>
</symbol>
<symbol id="decoy-13" viewBox="-80 -165 210 260">
  <path d="M42,50 C80,60 100,60 122,45" stroke="black" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <polyline points="-18.0,-118 -6.0,-96 6.0,-118 18.0,-96" stroke="black" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <circle cx="-18" cy="-36" r="16" fill="white"/>
  <circle cx="-15" cy="-33" r="6.5" fill="black"/>
  <circle cx="18" cy="-36" r="16" fill="white"/>
  <circle cx="21" cy="-33" r="6.5" fill="black"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
</symbol>
<symbol id="decoy-14" viewBox="-80 -165 210 260">
  <path d="M40,55 C95,55 118,15 92,-15 C74,-35 48,-24 55,-2" stroke="black" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="55" cy="-2" r="13" fill="black"/>
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <path d="M-59,-82 Q-46,-70 -33,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M33,-82 Q46,-70 59,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <polyline points="-18.0,-118 0.0,-96 18.0,-118" stroke="black" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <path d="M-33,-36 Q-18,-26 -3,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M3,-36 Q18,-26 33,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
</symbol>
<symbol id="decoy-15" viewBox="-80 -165 210 260">
  <path d="M40,55 C90,60 110,30 98,0" stroke="black" stroke-width="8" fill="none" stroke-linecap="round"/>
  <circle cx="98" cy="0" r="20" fill="white" stroke="black" stroke-width="6"/>
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <path d="M-59,-82 Q-46,-70 -33,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M33,-82 Q46,-70 59,-82" stroke="black" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <path d="M-33,-36 Q-18,-26 -3,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="18" cy="-36" r="16" fill="white"/>
  <circle cx="21" cy="-33" r="6.5" fill="black"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
  <path d="M-20,-125 L20,-125 L12,-155 L-12,-155 Z" fill="black"/>
  <rect x="-26" y="-128" width="52" height="8" fill="black"/>
</symbol>
<symbol id="decoy-16" viewBox="-80 -165 210 260">
  <path d="M-20,55 L-26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <path d="M20,55 L26,72" stroke="black" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="-27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="27" cy="78" rx="15" ry="9" fill="white" stroke="black" stroke-width="5"/>
  <ellipse cx="0" cy="38" rx="46" ry="42" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="-46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="46" cy="-82" r="29" fill="white" stroke="black" stroke-width="6"/>
  <circle cx="0" cy="-38" r="49" fill="white" stroke="black" stroke-width="6"/>
  <ellipse cx="0" cy="-36" rx="42" ry="27" fill="black"/>
  <circle cx="-18" cy="-36" r="16" fill="white"/>
  <circle cx="-15" cy="-33" r="6.5" fill="black"/>
  <path d="M3,-36 Q18,-26 33,-36" stroke="white" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-12" rx="5" ry="4" fill="black"/>
</symbol>
`;

/** decoy-1 〜 decoy-16 のIDリスト */
export const DECOY_IDS = Array.from({ length: 16 }, (_, i) => `decoy-${i + 1}`);
