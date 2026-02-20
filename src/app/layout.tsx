import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-minecraft",
});

export const metadata: Metadata = {
  title: "Dharm's Portfolio | Minecraft Edition",
  description:
    "A Minecraft-inspired developer portfolio — explore projects, skills, and achievements through a pixelated adventure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pixelFont.variable} font-[family-name:var(--font-minecraft)]`}>
        {children}
      </body>
    </html>
  );
}
