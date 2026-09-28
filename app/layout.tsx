import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import Spotlight from "@/components/Spotlight";
import { getSearchIndex } from "@/lib/content";
import { SITE } from "@/lib/format";
import "./globals.css";

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-display",
  weight: "variable",
});

const body = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: "variable",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.name}` },
  description: SITE.description,
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
  openGraph: { siteName: SITE.name, locale: "ru_RU", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#150c21",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Перейти к содержимому
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CommandPalette items={getSearchIndex()} />
        <Spotlight />
      </body>
    </html>
  );
}
