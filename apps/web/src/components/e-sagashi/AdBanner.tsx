"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useAdsRemoved } from "@/lib/premium";

const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const AD_SLOT = process.env.NEXT_PUBLIC_ADSENSE_AD_SLOT;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdBanner() {
  const { adsRemoved, isLoaded } = useAdsRemoved();
  // data-ad-slot が無いと Google 側がサイズ・配置を自動判断し、意図しない
  // 大きさ・位置（ゲーム画面に重なる等）で広告が出ることがあるため、
  // スロットIDが無い間は描画しない。
  const showAd = Boolean(PUBLISHER_ID) && Boolean(AD_SLOT) && isLoaded && !adsRemoved;

  useEffect(() => {
    if (!showAd) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSenseスクリプト未読み込み・広告ブロック時は無視
    }
  }, [showAd]);

  if (!showAd) return null;

  return (
    <div className="flex h-15 justify-center overflow-hidden border-t border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-950">
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {/* 固定サイズのディスプレイ広告ユニット。auto/full-width-responsive は
          使わず、サイズをこちらで完全に固定してレイアウト崩れを防ぐ。 */}
      <ins
        className="adsbygoogle"
        style={{ display: "inline-block", width: 468, height: 60 }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={AD_SLOT}
      />
    </div>
  );
}
