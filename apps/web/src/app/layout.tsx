import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
