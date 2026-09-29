import type { MetadataRoute } from "next";
import { BASE_PATH } from "@/lib/format";

export const dynamic = "force-static";

/** Lets phones install the site to the home screen as an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "fattula",
    short_name: "fattula",
    description: "Посты и проекты fattula: что делаю, как делаю и что из этого вышло.",
    lang: "ru",
    start_url: `${BASE_PATH}/`,
    scope: `${BASE_PATH}/`,
    display: "standalone",
    background_color: "#150c21",
    theme_color: "#150c21",
    icons: [
      { src: `${BASE_PATH}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${BASE_PATH}/icons/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${BASE_PATH}/icons/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
