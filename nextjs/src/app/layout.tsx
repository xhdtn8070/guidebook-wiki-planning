import type { Metadata } from "next";
import "./globals.css";
import { getThemeInitScript } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Guidebook Wiki – Next.js Prototype",
  description: "API 실전 플레이북 테넌트용 Next.js 위키 프론트엔드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInit = getThemeInitScript();

  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
