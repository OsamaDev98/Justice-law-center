import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Justice Law Center | Professional Legal Services",
  description: "Accurate and reliable legal advice from experienced attorneys at Justice Law Center.",
  keywords: ["law firm", "attorneys", "legal services", "justice law center", "lawyers"],
  openGraph: {
    title: "Justice Law Center",
    description: "Expert legal representation and counsel you can trust.",
    url: "https://justicelawcenter.com",
    siteName: "Justice Law Center",
    images: [
      {
        url: "/og-image.jpg", // placeholder
        width: 1200,
        height: 630,
        alt: "Justice Law Center",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Justice Law Center",
    description: "Expert legal representation and counsel you can trust.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          publicSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
