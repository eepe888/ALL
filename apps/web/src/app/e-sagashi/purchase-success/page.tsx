import { Suspense } from "react";
import type { Metadata } from "next";
import PurchaseSuccessContent from "@/components/e-sagashi/PurchaseSuccessContent";

export const metadata: Metadata = {
  title: "購入完了 | 絵探しゲーム",
};

export default function PurchaseSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-0 flex-1 items-center justify-center p-6 text-sm text-zinc-500 dark:text-zinc-400">
          読み込み中…
        </div>
      }
    >
      <PurchaseSuccessContent />
    </Suspense>
  );
}
