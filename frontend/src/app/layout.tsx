import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://flowpay.example.com";

export const metadata: Metadata = {
  title: {
    default: "FlowPay — Programmable USDC Payments on Arc",
    template: "%s | FlowPay",
  },
  description:
    "FlowPay is a programmable USDC payment platform built on Arc. Create secure on-chain payments with escrow, split payments, invoices, and dispute resolution.",
  keywords: [
    "FlowPay",
    "USDC",
    "Arc",
    "Arc Testnet",
    "escrow",
    "split payment",
    "smart contract",
    "blockchain payments",
    "DeFi",
    "built on Arc",
  ],
  authors: [{ name: "FlowPay" }],
  creator: "FlowPay",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "FlowPay",
    title: "FlowPay — Programmable USDC Payments on Arc",
    description:
      "Create secure on-chain payments with escrow, split payments, invoices, and dispute resolution.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "FlowPay — Programmable USDC Payments",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowPay — Programmable USDC Payments on Arc",
    description:
      "Create secure on-chain payments with escrow, split payments, invoices, and dispute resolution.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: [
      { url: "/icon-32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/icon-48.png?v=2", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/apple-touch-icon.png?v=2",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
