import type { Metadata } from "next";
import { ThemeProvider } from "@/shared/theme/theme-provider";
import "./globals.css";

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
    <html lang="ko" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
      </head>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
