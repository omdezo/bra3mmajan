import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ImagePreloader } from "@/components/ImagePreloader";

const rubik = Rubik({
  subsets: ["arabic"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "Baraem Majan | براعم مجان",
  description: "منصة تعليمية ترفيهية للأطفال - تنمو بالعلم... تزهو بعمان",
  icons: {
    icon: [
      { url: "/assets/logo.png" },
      { url: "/assets/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/assets/logo.png",
    shortcut: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
          rubik.variable
        )}
      >
        <ImagePreloader />
        {children}
      </body>
    </html>
  );
}
