import { ImageResponse } from "next/og";
import { event } from "./lib/content";

export const runtime = "edge";
export const alt = "Shams for Humanity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f2eb",
          color: "#0b0b0b",
          fontFamily: "Arial, Helvetica, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 64,
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          SHAMS / HUMANITY
        </div>
        <div
          style={{
            position: "absolute",
            top: 56,
            right: 64,
            fontSize: 22,
            letterSpacing: 2,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          {event.city} · {event.date}
        </div>
        <div
          style={{
            fontSize: 44,
            marginBottom: 16,
            display: "flex",
          }}
        >
          ✦
        </div>
        <div
          style={{
            fontSize: 128,
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 0.95,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Shams for</span>
          <span>Humanity</span>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 26,
            color: "#555",
            display: "flex",
          }}
        >
          Music · Art · Solidarity
        </div>
      </div>
    ),
    { ...size }
  );
}
