import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import VedaCompanion from "@/components/veda/VedaCompanion";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DHARA - Where India's stories flow",
  description: "Digital Heritage Adventure & Recreation Architecture",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-parchment-100 text-earth-900">
        {children}
        <VedaCompanion />
      </body>
    </html>
  );
}
