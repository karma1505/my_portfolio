import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import Dock from "@/components/Dock";
import { GoogleAnalytics } from "@next/third-parties/google";
import { WindowProvider } from "@/contexts/WindowContext";

const myFont = localFont({
  src: "../../public/font/font.ttf",
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "KarmaOS",
  description: "A macOS-inspired portfolio website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${myFont.className} bg-smoky text-floral bg-gray-100 min-h-screen flex flex-col items-center`}
      >
        {/* Google Analytics (Next.js way) */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />

        <WindowProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-8rem)] flex flex-col">
            {children}
          </main>
          <Dock />
        </WindowProvider>
      </body>
    </html>
  );
}