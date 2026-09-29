import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import Spotlight from "@/components/Spotlight";
import KeyboardNav from "@/components/KeyboardNav";
import BackToTop from "@/components/BackToTop";
import Konami from "@/components/Konami";
import Backdrop from "@/components/Backdrop";
import Magnetic from "@/components/Magnetic";
import RouteProgress from "@/components/RouteProgress";
import Cursor from "@/components/Cursor";
import PartyMode from "@/components/PartyMode";
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
  openGraph: {
    siteName: SITE.name,
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#150c21",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Apply the saved accent before first paint, so the page never flashes the default. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var a=localStorage.getItem("fattula:accent");if(a)document.documentElement.dataset.accent=a}catch(e){}`,
          }}
        />
      </head>
      <body>
        <Backdrop />
        <RouteProgress />
        <a className="skip-link" href="#main">
          Перейти к содержимому
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <CommandPalette items={getSearchIndex()} />
        <Spotlight />
        <KeyboardNav />
        <BackToTop />
        <Konami />
        <Magnetic />
        <Cursor />
        <PartyMode />
      </body>
    </html>
  );
}
