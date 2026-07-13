import CafeFinder from "@/components/CafeFinder";

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <h1 className="text-lg font-semibold">近くのカフェを探す</h1>
      </header>
      <CafeFinder />
    </div>
  );
}
