import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guidebook Wiki – Next.js Prototype",
  description: "API 실전 플레이북 테넌트용 Next.js 위키 프론트엔드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="light">
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
