import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cafénista | 近くのカフェを探す",
  description: "現在地から近くのカフェを地図で探せるサービス「Cafénista(カフェニスタ)」",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets content draw under the notch/Dynamic Island and home indicator so
  // the safe-area-inset-* env() variables resolve to real values instead of 0,
  // which the floating map controls rely on to avoid sitting under them.
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex h-full flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <nav className="flex shrink-0 gap-3 border-b border-zinc-200 px-4 py-1.5 text-xs dark:border-zinc-800">
          <Link href="/" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            ☕ カフェ検索
          </Link>
          <Link href="/nail-ar" className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            💅 ネイルAR試着
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
