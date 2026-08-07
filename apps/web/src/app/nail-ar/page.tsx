import type { Metadata, Viewport } from "next";
import NailArApp from "@/components/nail-ar/NailArApp";

export const metadata: Metadata = {
  title: "ネイルAR試着 | Cafénista",
  description: "カメラに手をかざしてネイルのカラー・デザインをその場で試着できるツール",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function NailArPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <h1 className="flex items-center gap-1.5 text-lg font-bold">
          <span aria-hidden>💅</span>
          <span className="bg-linear-to-r from-pink-500 to-fuchsia-600 bg-clip-text text-transparent">
            ネイルAR試着
          </span>
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          カメラをかざしてカラー・デザインを試着
        </p>
      </header>
      <NailArApp />
    </div>
  );
}
