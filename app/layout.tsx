import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://haronzie.vercel.app"),
  title: "Haronzie — Portfolio",
  description:
    "Portfolio of Haronzie — I design and build fast, fluid apps for mobile and web.",
  openGraph: {
    title: "Haronzie — Portfolio",
    description:
      "I design and build fast, fluid apps for mobile and web — Flutter, Firebase and modern TypeScript.",
    url: "https://haronzie.vercel.app",
    siteName: "Haronzie",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Haronzie — I design & build apps that feel effortless." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Haronzie — Portfolio",
    description:
      "I design and build fast, fluid apps for mobile and web.",
    images: ["/og.png"],
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
