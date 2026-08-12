"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAdsRemoved } from "@/lib/premium";

export default function PurchaseSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { markAdsRemoved } = useAdsRemoved();
  const [status, setStatus] = useState<"checking" | "ok" | "failed">("checking");

  useEffect(() => {
    if (!sessionId) {
      Promise.resolve().then(() => setStatus("failed"));
      return;
    }
    fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((data: { paid: boolean }) => {
        if (data.paid) {
          markAdsRemoved();
          setStatus("ok");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [sessionId, markAdsRemoved]);

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      {status === "checking" && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">決済を確認しています…</p>
      )}
      {status === "ok" && (
        <>
          <span className="text-3xl" aria-hidden>
            🎉
          </span>
          <p className="text-base font-bold">購入ありがとうございます！</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            この端末では今後、絵探しゲームの広告が表示されなくなります。
          </p>
        </>
      )}
      {status === "failed" && (
        <p className="text-sm text-red-500">
          決済の確認ができませんでした。お手数ですがもう一度お試しください。
        </p>
      )}
      <Link
        href="/e-sagashi"
        className="text-xs text-emerald-600 underline dark:text-emerald-400"
      >
        絵探しゲームに戻る
      </Link>
    </div>
  );
}
