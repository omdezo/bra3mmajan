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
