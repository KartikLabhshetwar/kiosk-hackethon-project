import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PreferencesProvider, CartProvider } from "@/lib/context";
import { DataInitializer } from "@/lib/components/DataInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evol Studio - AI Jewelry Kiosk",
  description: "Find the perfect jewelry with AI-powered recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PreferencesProvider>
          <CartProvider>
            <DataInitializer>
              {children}
            </DataInitializer>
          </CartProvider>
        </PreferencesProvider>
      </body>
    </html>
  );
}
