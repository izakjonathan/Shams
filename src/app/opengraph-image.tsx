import { ImageResponse } from "next/og";
import { contentRepository } from "../features/content";
import { siteTheme } from "../lib/theme";

const event = contentRepository.getEvent();

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
          background: siteTheme.paper,
          color: siteTheme.ink,
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
          <svg width="44" height="44" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 10c1.2 8 3 14.4 6.8 18.2C42.6 32 49 33.8 57 35c-8 1.2-14.4 3-18.2 6.8C35 45.6 33.2 52 32 60c-1.2-8-3-14.4-6.8-18.2C21.4 38 15 36.2 7 35c8-1.2 14.4-3 18.2-6.8C29 24.4 30.8 18 32 10z" fill={siteTheme.ink} />
          </svg>
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
