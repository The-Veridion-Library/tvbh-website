import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";
import { VercelToolbar } from "@vercel/toolbar/next";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Veridion Book Hunt",
  description: "A community-driven book scavenger hunt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Add a check for Vercel Toolbar injection
  const shouldInjectToolbar = process.env.NODE_ENV === "development";
  return (
    <html lang="en" className={figtree.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
        {shouldInjectToolbar && <VercelToolbar />}
        <Footer />
      </body>
    </html>
  );
}
