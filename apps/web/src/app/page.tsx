import CafeFinder from "@/components/CafeFinder";

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <h1 className="flex items-center gap-1.5 text-lg font-bold">
          <span aria-hidden>☕</span>
          <span className="bg-linear-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
            Cafénista
          </span>
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          近くのカフェを探す
        </p>
      </header>
      <CafeFinder />
    </div>
  );
}
