import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const agilera = localFont({
  src: "../public/fonts/Agilera.woff",
  variable: "--font-agilera",
  display: "block",
  preload: true,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Shams for Humanity",
  description: "A gathering of music, art and collective care.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f2eb",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={agilera.variable}>
      <body>{children}</body>
    </html>
  );
}
