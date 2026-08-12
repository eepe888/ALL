import { DECOY_FAMILY_SYMBOLS, DECOY_IDS } from "./decoyFamily";

const STROKE = "#171717";
/** 建築部分だけ細い線・淡いグレーで描き、太いキャラクター層と視覚的に分離する */
const ARCH_STROKE = "#4a4a4a";
const ARCH_SHADE = "#e2e2e2";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * 手前(t=0)ほど大きく・奥(t=1)ほど小さくなる、奥行きのある交差点の地面上の
 * 位置を返す。u=0が左端、u=1が右端。
 */
function groundPoint(u: number, t: number) {
  const leftX = lerp(14, 150, t);
  const rightX = lerp(386, 250, t);
  const x = lerp(leftX, rightX, u);
  const y = lerp(298, 122, t);
  const scale = lerp(0.46, 0.15, t);
  return { x, y, scale };
}

type DecoyPlacement = { u: number; t: number; id: string; rotate: number; mirror: boolean };

/**
 * 交差点を埋め尽くすデコイの配置を行ごとに生成する。デコイは16種類しか
 * ないので使い回す前提。手前ほど行の人数を多くし、擬似乱数（インデックス
 * ベースの決定的な値）でジッターを付けて機械的な整列に見えないようにする。
 */
function buildDecoyField(): DecoyPlacement[] {
  const rows = [
    { t: 0.28, count: 5 },
    { t: 0.37, count: 6 },
    { t: 0.46, count: 7 },
    { t: 0.55, count: 8 },
    { t: 0.64, count: 8 },
    { t: 0.73, count: 7 },
    { t: 0.82, count: 6 },
    { t: 0.91, count: 5 },
  ];
  const placements: DecoyPlacement[] = [];
  let i = 0;
  for (const row of rows) {
    for (let col = 0; col < row.count; col++) {
      const jitterU = (((i * 53) % 17) / 17 - 0.5) * (0.9 / row.count);
      const jitterT = (((i * 29) % 13) / 13 - 0.5) * 0.05;
      const u = (col + 0.5) / row.count + jitterU;
      const t = row.t + jitterT;
      const id = DECOY_IDS[i % DECOY_IDS.length];
      const rotate = ((i * 47) % 36) - 18;
      const mirror = (i * 31) % 2 === 0;
      placements.push({ u, t, id, rotate, mirror });
      i++;
    }
  }
  return placements;
}

const DECOYS = buildDecoyField();

/** 装飾的なランタン付き街灯を、道の両脇の指定した深さ(t)に並べる */
const STREETLIGHT_ROWS: Array<{ t: number; mirror: boolean }> = [
  { t: 0.12, mirror: false },
  { t: 0.12, mirror: true },
  { t: 0.32, mirror: false },
  { t: 0.32, mirror: true },
  { t: 0.52, mirror: false },
  { t: 0.52, mirror: true },
  { t: 0.72, mirror: false },
  { t: 0.72, mirror: true },
  { t: 0.9, mirror: false },
  { t: 0.9, mirror: true },
];

function Streetlight({ x, y, scale, mirror }: { x: number; y: number; scale: number; mirror: boolean }) {
  const dir = mirror ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {/* 台座 */}
      <rect x={-5 * dir} y="-2" width={5} height="7" fill={ARCH_SHADE} stroke={ARCH_STROKE} strokeWidth={2} />
      {/* 支柱の装飾リング */}
      <line x1="0" y1="4" x2="0" y2="-42" stroke={ARCH_STROKE} strokeWidth={2.6} />
      <circle cx="0" cy="-10" r="2.2" fill="none" stroke={ARCH_STROKE} strokeWidth={1.8} />
      <circle cx="0" cy="-26" r="2.2" fill="none" stroke={ARCH_STROKE} strokeWidth={1.8} />
      <circle cx="0" cy="-42" r="2.6" fill={ARCH_STROKE} />
      {/* 腕とランタン */}
      <path d={`M0,-40 Q${16 * dir},-43 ${19 * dir},-32`} fill="none" stroke={ARCH_STROKE} strokeWidth={2.4} strokeLinecap="round" />
      <path
        d={`M${15 * dir},-33 L${24 * dir},-33 L${22 * dir},-21 L${19 * dir},-16 L${16 * dir},-21 Z`}
        fill="#ffffff"
        stroke={ARCH_STROKE}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <line x1={19.5 * dir} y1="-33" x2={19.5 * dir} y2="-39" stroke={ARCH_STROKE} strokeWidth={1.8} />
      {/* 小さな案内旗 */}
      <path d={`M0,-32 L${12 * dir},-32 L${12 * dir},-24 L0,-24 Z`} fill={ARCH_SHADE} stroke={ARCH_STROKE} strokeWidth={1.6} />
    </g>
  );
}

/**
 * 仮素材: 渋谷スクランブル交差点を、塔状のビルに向かって奥行きのある
 * street view で見上げたイラスト。太い黒アウトライン・白抜きのタッチで
 * 統一し、ユーザー提供の「そっくりさんファミリー」を通行人に紛れ込ませて
 * 本命キャラを探す難易度を出している。本番リリース時は内製で用意する
 * 高解像度イラストに差し替える想定。
 */
export default function SceneIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="absolute inset-0 h-full w-full rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800"
      role="img"
      aria-label="奥に塔状のビルが見える渋谷スクランブル交差点のイラスト（仮素材）"
    >
      <defs dangerouslySetInnerHTML={{ __html: DECOY_FAMILY_SYMBOLS }} />
      <defs>
        <clipPath id="tower-clip">
          <path d="M170,125 L170,55 A30,30 0 0 1 230,55 L230,125 Z" />
        </clipPath>
      </defs>

      <rect width="400" height="300" fill="#ffffff" />

      {/* 奥の左右のビル群（淡いグレーで陰影をつけて奥行きを出す） */}
      <path d="M0,124 L0,58 L54,44 L54,124 Z" fill="#ffffff" stroke={ARCH_STROKE} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M50,124 L54,34 L118,20 L124,124 Z" fill={ARCH_SHADE} stroke={ARCH_STROKE} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M400,124 L400,50 L344,36 L344,124 Z" fill="#ffffff" stroke={ARCH_STROKE} strokeWidth={2.2} strokeLinejoin="round" />
      <path d="M350,124 L346,26 L280,12 L276,124 Z" fill={ARCH_SHADE} stroke={ARCH_STROKE} strokeWidth={2.2} strokeLinejoin="round" />

      {/* ビルの窓（グリッド） */}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <rect key={`wl-${row}-${col}`} x={62 + col * 18} y={30 + row * 16} width="9" height="8" fill="#ffffff" stroke={ARCH_STROKE} strokeWidth={1.3} />
        )),
      )}
      {Array.from({ length: 5 }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <rect key={`wr-${row}-${col}`} x={284 + col * 18} y={22 + row * 16} width="9" height="8" fill="#ffffff" stroke={ARCH_STROKE} strokeWidth={1.3} />
        )),
      )}

      {/* 手前の小さな店舗と庇 */}
      <rect x="4" y="98" width="42" height="26" fill="#ffffff" stroke={ARCH_STROKE} strokeWidth={2} />
      <path d="M2,98 L48,98 L44,90 L6,90 Z" fill={ARCH_SHADE} stroke={ARCH_STROKE} strokeWidth={2} strokeLinejoin="round" />
      <rect x="358" y="96" width="38" height="28" fill="#ffffff" stroke={ARCH_STROKE} strokeWidth={2} />
      <path d="M356,96 L398,96 L394,88 L360,88 Z" fill={ARCH_SHADE} stroke={ARCH_STROKE} strokeWidth={2} strokeLinejoin="round" />

      {/* 中央の円筒タワー */}
      <path
        d="M170,125 L170,55 A30,30 0 0 1 230,55 L230,125 Z"
        fill="#ffffff"
        stroke={ARCH_STROKE}
        strokeWidth={2.4}
      />
      <g clipPath="url(#tower-clip)">
        {Array.from({ length: 9 }).map((_, col) => (
          <line key={`tv-${col}`} x1={170 + col * 7.5} y1="20" x2={170 + col * 7.5} y2="130" stroke={ARCH_STROKE} strokeWidth={0.9} opacity="0.7" />
        ))}
        {Array.from({ length: 8 }).map((_, row) => (
          <line key={`th-${row}`} x1="160" y1={30 + row * 12} x2="240" y2={30 + row * 12} stroke={ARCH_STROKE} strokeWidth={0.9} opacity="0.7" />
        ))}
        {/* 大型ビジョンパネル */}
        <rect x="182" y="68" width="36" height="32" rx="2" fill="#ffffff" stroke={ARCH_STROKE} strokeWidth={1.6} />
      </g>
      <path d="M170,125 L170,55 A30,30 0 0 1 230,55 L230,125" fill="none" stroke={ARCH_STROKE} strokeWidth={2.4} />
      <rect x="196" y="20" width="8" height="10" fill="#ffffff" stroke={ARCH_STROKE} strokeWidth={1.6} />
      <line x1="200" y1="20" x2="200" y2="8" stroke={ARCH_STROKE} strokeWidth={1.6} />
      <circle cx="200" cy="6" r="1.6" fill={ARCH_STROKE} />

      {/* 交差点の地面 */}
      <path d="M14,298 L386,298 L250,122 L150,122 Z" fill="#d9dadb" stroke={ARCH_STROKE} strokeWidth={2.4} strokeLinejoin="round" />

      {/* 横断歩道のストライプ（奥ほど幅が狭くなる） */}
      {Array.from({ length: 7 }).map((_, i) => {
        const t = (i + 0.5) / 7;
        const leftX = lerp(14, 150, t);
        const rightX = lerp(386, 250, t);
        const y = lerp(298, 122, t);
        const h = lerp(20, 7, t);
        return <rect key={`stripe-${i}`} x={leftX} y={y - h / 2} width={rightX - leftX} height={h} fill={STROKE} opacity="0.22" />;
      })}

      {/* 歩道の舗装テクスチャ（交差点脇の余白を埋める） */}
      {[
        [40, 160], [70, 190], [100, 220], [30, 210], [60, 250], [90, 280], [20, 260],
        [340, 150], [370, 170], [355, 200], [385, 210], [365, 240], [345, 270], [378, 260],
      ].map(([x, y]) => (
        <line
          key={`pave-${x}-${y}`}
          x1={x - 6}
          y1={y + 4}
          x2={x + 6}
          y2={y - 4}
          stroke={STROKE}
          strokeWidth={2}
          opacity="0.15"
        />
      ))}

      {/* 街灯（道の両脇に並べる） */}
      {STREETLIGHT_ROWS.map(({ t, mirror }, i) => {
        const edgeU = mirror ? 0.98 : 0.02;
        const { x, y, scale } = groundPoint(edgeU, t);
        return <Streetlight key={`light-${i}`} x={x} y={y} scale={scale * 2.6} mirror={mirror} />;
      })}

      {/* 自動販売機 */}
      <g transform="translate(50,232)">
        <rect x="-14" y="-40" width="28" height="58" rx="2" fill="#ffffff" stroke={ARCH_STROKE} strokeWidth={2} />
        <rect x="-10" y="-34" width="20" height="20" rx="1" fill={ARCH_SHADE} stroke={ARCH_STROKE} strokeWidth={1.4} />
        {Array.from({ length: 2 }).map((_, row) =>
          Array.from({ length: 3 }).map((_, col) => (
            <circle key={`vm-${row}-${col}`} cx={-8 + col * 8} cy={-4 + row * 8} r="1.3" fill={ARCH_STROKE} />
          )),
        )}
      </g>

      {/* 自転車 */}
      <g transform="translate(95,258)">
        <circle cx="-14" cy="10" r="10" fill="none" stroke={ARCH_STROKE} strokeWidth={1.8} />
        <circle cx="14" cy="10" r="10" fill="none" stroke={ARCH_STROKE} strokeWidth={1.8} />
        <path
          d="M-14,10 L-2,-9 L14,10 M-2,-9 L4,-14 M-14,10 L11,-6"
          stroke={ARCH_STROKE}
          strokeWidth={1.6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* ハチ公像（太いアウトライン・白抜きのシンプルなシルエット、段差のある台座） */}
      <g transform="translate(345,218) scale(1.15)">
        {/* 台座（2段＋銘板の切り欠き） */}
        <rect x="-24" y="24" width="48" height="9" fill="#ffffff" stroke={STROKE} strokeWidth={4} />
        <rect x="-15" y="15" width="30" height="10" fill="#ffffff" stroke={STROKE} strokeWidth={4} />
        <rect x="-6" y="26" width="12" height="6" fill="#ffffff" stroke={STROKE} strokeWidth={2.5} />

        {/* 尻尾 */}
        <path
          d="M13,10 C28,7 30,-9 17,-14 C23,-6 20,3 11,5"
          fill="#ffffff"
          stroke={STROKE}
          strokeWidth={4}
          strokeLinejoin="round"
        />

        {/* 座った胴体 */}
        <path
          d="M-16,15 C-18,-8 -12,-21 0,-21 C12,-21 18,-8 16,15 Z"
          fill="#ffffff"
          stroke={STROKE}
          strokeWidth={4}
          strokeLinejoin="round"
        />

        {/* 前脚 */}
        <rect x="-11" y="6" width="6" height="10" rx="2" fill="#ffffff" stroke={STROKE} strokeWidth={3} />
        <rect x="5" y="6" width="6" height="10" rx="2" fill="#ffffff" stroke={STROKE} strokeWidth={3} />

        {/* 頭・耳 */}
        <circle cx="0" cy="-28" r="13" fill="#ffffff" stroke={STROKE} strokeWidth={4} />
        <path d="M-10,-36 L-15,-49 L-3,-39 Z" fill="#ffffff" stroke={STROKE} strokeWidth={3} strokeLinejoin="round" />
        <path d="M10,-36 L15,-49 L3,-39 Z" fill="#ffffff" stroke={STROKE} strokeWidth={3} strokeLinejoin="round" />
        <circle cx="-4" cy="-28" r="1.4" fill={STROKE} />
        <circle cx="4" cy="-28" r="1.4" fill={STROKE} />
      </g>

      {/* そっくりさんファミリーで交差点を埋め尽くす（この中に本命キャラが紛れている） */}
      {DECOYS.map(({ u, t, id, rotate, mirror }, i) => {
        const { x, y, scale } = groundPoint(u, t);
        return (
          <use
            key={`decoy-use-${i}`}
            href={`#${id}`}
            x={-45}
            y={-90}
            width="90"
            height="140"
            transform={`translate(${x} ${y}) scale(${scale * (mirror ? -1 : 1)} ${scale}) rotate(${rotate})`}
          />
        );
      })}
    </svg>
  );
}
