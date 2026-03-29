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
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
      </head>
      <body className="bg-background text-foreground antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var themeKey = "guidebook_theme";
                var modeKey = "guidebook_mode";
                var root = document.documentElement;
                var theme = localStorage.getItem(themeKey) || "midnight";
                var mode = localStorage.getItem(modeKey) || "dark";
                root.setAttribute("data-theme", theme);
                root.setAttribute("data-mode", mode);
                root.classList.remove("light", "dark");
                root.classList.add(mode);
              })();
            `,
          }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
