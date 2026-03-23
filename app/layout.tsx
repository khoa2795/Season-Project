import type { Metadata, Viewport } from "next";
import { Crimson_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson-pro",
  weight: ["200", "300", "400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Season - Luxury Eyewear",
  description: "Discover the new collection of luxury eyewear.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-serif antialiased",
          crimsonPro.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
