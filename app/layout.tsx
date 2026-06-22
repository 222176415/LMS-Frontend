import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes"; // CORE THEME MODULE IMPORT
import NextTopLoader from 'nextjs-toploader';
import { cn } from "@/lib/utils";
import Providers from "@/components/providers";
import "./globals.css";
import { useRef } from 'react';
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// UPDATED: Descriptive, production-ready system metadata
export const metadata: Metadata = {
  title: "LMS Core | Independent Lending Dashboard",
  description:
    "High-performance multi-tenant short term loan ledger tracking console.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const topLoaderRef = useRef(null);
  return (
    <html
      lang="en-ZA"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NextTopLoader
              ref={topLoaderRef}
              color="#2299DD"
              height={3}
              crawlSpeed={200}
              initialPosition={0.08}
              crawl
              showSpinner={true}
          />
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
