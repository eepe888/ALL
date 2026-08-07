"use client";

interface TopScreenProps {
  onStart: () => void;
}

export default function TopScreen({ onStart }: TopScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <div className="space-y-2">
        <span aria-hidden className="text-4xl">💅</span>
        <h1 className="text-xl font-bold">ネイルAR試着</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          カメラに手をかざすだけで、カラーやデザインをその場で試着できます。
        </p>
      </div>

      <ul className="w-full max-w-xs space-y-2 text-left text-xs text-zinc-600 dark:text-zinc-300">
        <li className="flex gap-2">
          <span aria-hidden>1.</span>
          <span>ガイド枠に合わせて手をかざします</span>
        </li>
        <li className="flex gap-2">
          <span aria-hidden>2.</span>
          <span>カラー・デザインを選んで爪に重ねて表示します</span>
        </li>
        <li className="flex gap-2">
          <span aria-hidden>3.</span>
          <span>気に入ったデザインを保存・比較できます</span>
        </li>
      </ul>

      <button
        type="button"
        onClick={onStart}
        className="rounded-full bg-linear-to-r from-pink-500 to-fuchsia-600 px-8 py-3 text-sm font-semibold text-white shadow"
      >
        試着をはじめる
      </button>

      <div className="max-w-xs space-y-1 text-[10px] leading-relaxed text-zinc-400">
        <p>
          カメラ映像は試着の表示にのみ使用し、保存操作をしない限り端末外へ送信・保存されません。
        </p>
        <p>
          実際の施術の仕上がりとは質感・立体感が異なる場合があります。あくまでイメージ確認用途としてご利用ください。
        </p>
      </div>
    </div>
  );
}
