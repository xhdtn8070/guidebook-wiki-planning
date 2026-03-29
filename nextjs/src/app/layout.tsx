import type { Metadata } from "next";
import { IBM_Plex_Sans_KR, Inter, Newsreader, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const sansLatin = Inter({
  variable: "--font-sans-latin",
  subsets: ["latin"],
  display: "swap",
});

const sansKr = IBM_Plex_Sans_KR({
  variable: "--font-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const serifLatin = Newsreader({
  variable: "--font-serif-latin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const serifKr = Noto_Serif_KR({
  variable: "--font-serif-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Guidebook Wiki",
  description: "Guidebook Wiki Next.js shell aligned to the live backend API contract.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${sansLatin.variable} ${sansKr.variable} ${serifLatin.variable} ${serifKr.variable} bg-background text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
