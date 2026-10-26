import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { AudioPlayer } from "@/components/ui/AudioPlayer";
import "./globals.css";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Space Portfolio | Web Developer & Creative Technologist",
  description:
    "An interactive 3D journey through space showcasing web development projects, technical skills, and achievements.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#02030a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body">
        {children}
        {/* In the layout so the music keeps playing across page changes */}
        <AudioPlayer />
      </body>
    </html>
  );
}
