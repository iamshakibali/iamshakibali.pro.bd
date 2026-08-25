import type { Metadata } from "next";
import { preload } from "react-dom";
import "./globals.css";
import { content } from "@/lib/content";
import { ThemeProvider } from "@/components/theme-provider";
import { DockBar } from "@/components/DockBar";
import { SiteShell } from "@/components/SiteShell";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const overusedGrotesk = localFont({
  src: "./fonts/OverusedGrotesk-Medium.ttf",
  weight: "500",
  variable: "--font-overused-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: content.name,
  description: content.subtext,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Hero images as head preloads: the welcome gate hides content with
  // visibility:hidden (loads start but unprioritized), so on a cold cache
  // images could still be fetching when the loader lifts and pop in late.
  preload("/avatar.gif", { as: "image" });
  preload("/badges/company-logo.svg", { as: "image" });
  preload("/badges/orbix.png", { as: "image" });
  preload("/badges/screens.png", { as: "image" });
  preload("/badges/pintop.png", { as: "image" });
  preload("/x-avatar.png", { as: "image" });
  preload("/linkedin-avatar.png", { as: "image" });

  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${overusedGrotesk.variable}`}>
      <body className="antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SiteShell>{children}</SiteShell>
          <DockBar />
        </ThemeProvider>
      </body>
    </html>
  );
}
