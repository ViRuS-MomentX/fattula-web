import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const font = (file: string) => fs.readFileSync(path.join(process.cwd(), "assets/fonts", file));

/** Shared link-preview card: big title on the purple backdrop. */
export function ogImage({ title, subtitle }: { title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 20% 20%, #4b24b0 0%, #150c21 55%), #150c21",
          color: "#eee6f8",
          fontFamily: "Onest",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 36, fontFamily: "Unbounded" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50% 50% 50% 12px",
              background: "linear-gradient(135deg, #d8c3ff, #7c4dff)",
            }}
          />
          fattula
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontFamily: "Unbounded", fontSize: title.length > 40 ? 58 : 76, lineHeight: 1.1 }}>
            {title}
          </div>
          <div style={{ fontSize: 30, color: "#a996c0" }}>{subtitle}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Unbounded", data: font("Unbounded-Bold.ttf"), weight: 700 },
        { name: "Onest", data: font("Onest-Medium.ttf"), weight: 500 },
      ],
    },
  );
}
